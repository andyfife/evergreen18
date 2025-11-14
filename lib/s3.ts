import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { lookup } from 'mime-types';
import { Readable } from 'stream';

// ---------------------
// Environment validation
// ---------------------
function validateEnv() {
  const required = [
    'DO_SPACES',
    'DO_SPACES_REGION',
    'DO_SPACES_KEY',
    'DO_SPACES_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
validateEnv();

export const BUCKET = process.env.DO_SPACES!;
export const REGION = process.env.DO_SPACES_REGION!;
export const ENDPOINT = `https://${REGION}.digitaloceanspaces.com`;

export const s3Client = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
  forcePathStyle: true,
});

// ---------------------
// Retry helper
// ---------------------
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries - 1) {
        const backoff = delayMs * Math.pow(2, attempt);
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${backoff}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }
  throw new Error(`Failed after ${retries} attempts: ${lastError!.message}`);
}

// ---------------------
// Cache control helper
// ---------------------
function getCacheControl(contentType: string): string {
  if (contentType.startsWith('video/')) return 'max-age=604800, public'; // 7 days
  if (contentType.includes('vtt') || contentType.includes('srt'))
    return 'max-age=3600, public'; // 1 hour for subtitles
  return 'max-age=86400, public'; // 1 day default
}

// ---------------------
// Upload a small file (buffer) - images/posters
// ---------------------
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType?: string,
  isPublic = false
): Promise<string> {
  if (!key || key.trim() === '') throw new Error('Invalid key');
  if (!file || file.length === 0) throw new Error('Invalid file');

  const detectedType = contentType || lookup(key) || 'application/octet-stream';
  const acl: ObjectCannedACL = isPublic ? 'public-read' : 'private';
  const cacheControl = getCacheControl(detectedType);

  await withRetry(() =>
    s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: detectedType,
        ACL: acl,
        CacheControl: cacheControl,
      })
    )
  );

  const url = isPublic
    ? `https://${BUCKET}.${REGION}.digitaloceanspaces.com/${key}`
    : await getSignedUrlForKey(key, 60 * 60 * 24 * 7); // 7 days

  console.log(`Uploaded buffer: ${key} (${isPublic ? 'public' : 'private'})`);
  return url;
}

// ---------------------
// Upload a large file (stream) - videos
// ---------------------
export async function uploadStreamToS3(
  stream: Readable,
  key: string,
  contentType?: string,
  isPublic = false
): Promise<string> {
  if (!key || key.trim() === '') throw new Error('Invalid key');
  if (!stream) throw new Error('Invalid stream');

  const detectedType = contentType || 'application/octet-stream';
  const acl: ObjectCannedACL = isPublic ? 'public-read' : 'private';
  const cacheControl = getCacheControl(detectedType);

  await withRetry(() =>
    s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: stream,
        ContentType: detectedType,
        ACL: acl,
        CacheControl: cacheControl,
      })
    )
  );

  const url = isPublic
    ? `https://${BUCKET}.${REGION}.digitaloceanspaces.com/${key}`
    : await getSignedUrlForKey(key, 60 * 60 * 24 * 7);

  console.log(`Uploaded stream: ${key} (${isPublic ? 'public' : 'private'})`);
  return url;
}

// ---------------------
// Change object visibility
// ---------------------
export async function setObjectVisibility(
  key: string,
  makePublic: boolean
): Promise<void> {
  if (!key || key.trim() === '') throw new Error('Invalid key');

  const acl: ObjectCannedACL = makePublic ? 'public-read' : 'private';
  const head = await withRetry(() =>
    s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
  );
  const contentType = head.ContentType || 'application/octet-stream';

  await withRetry(() =>
    s3Client.send(
      new CopyObjectCommand({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${key}`,
        Key: key,
        ACL: acl,
        ContentType: contentType,
        MetadataDirective: 'COPY',
        CacheControl: head.CacheControl,
      })
    )
  );

  console.log(
    `Updated visibility for ${key}: ${makePublic ? 'public' : 'private'}`
  );
}

// ---------------------
// Get signed URL for private file
// ---------------------
export async function getSignedUrlForKey(
  key: string,
  expiresIn = 3600
): Promise<string> {
  if (!key || key.trim() === '') throw new Error('Invalid key');
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

// ---------------------
// Purge CDN cache
// ---------------------
export async function purgeCdnCache(
  endpointId: string,
  files: string[]
): Promise<void> {
  if (!endpointId || endpointId.trim() === '')
    throw new Error('Invalid endpointId');
  if (!files || files.length === 0) throw new Error('No files to purge');

  const response = await fetch(
    `https://api.digitalocean.com/v2/cdn/endpoints/${endpointId}/purge`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`CDN purge failed (${response.status}): ${err}`);
  }

  console.log(`Purged ${files.length} file(s) from CDN`);
}

// ---------------------
// Check if object exists
// ---------------------
export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404)
      return false;
    throw error;
  }
}

// ---------------------
// Get object metadata
// ---------------------
export async function getObjectMetadata(key: string) {
  const head = await s3Client.send(
    new HeadObjectCommand({ Bucket: BUCKET, Key: key })
  );
  return {
    contentType: head.ContentType,
    contentLength: head.ContentLength,
    lastModified: head.LastModified,
    cacheControl: head.CacheControl,
    metadata: head.Metadata,
  };
}

// ---------------------
// Delete object (handles query strings safely)
// ---------------------
export async function deleteObject(urlOrKey: string) {
  if (!urlOrKey || urlOrKey.trim() === '') throw new Error('Invalid key');

  // Strip URL query string if passed full signed URL
  const key = urlOrKey.includes('://')
    ? urlOrKey.split('/').slice(-3).join('/').split('?')[0]
    : urlOrKey.split('?')[0];

  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log(`Deleted object: ${key}`);
}
