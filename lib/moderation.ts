// lib/moderation.ts
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';

const execAsync = promisify(exec);

let modelWarmedUp = false;

/**
 * Warm up the Hugging Face NSFW model to reduce first-call latency.
 */
export async function warmupModel(): Promise<void> {
  if (modelWarmedUp) return;

  try {
    console.log('[Moderation] Warming up Hugging Face NSFW model...');

    const script = `
from transformers import pipeline
# Load the model
classifier = pipeline("image-classification", model="AdamCodd/vit-base-nsfw-detector")
# Dummy run with blank image to warm up
from PIL import Image
import numpy as np
dummy = Image.fromarray(np.zeros((384,384,3), dtype=np.uint8))
_ = classifier(dummy)
print("Model warmed up successfully")
`;

    const scriptPath = `/tmp/warmup_${crypto.randomUUID()}.py`;
    await writeFile(scriptPath, script);
    await execAsync(`python3 "${scriptPath}"`);
    await unlink(scriptPath).catch(() => {});

    modelWarmedUp = true;
    console.log('[Moderation] Model warmup complete');
  } catch (err) {
    console.warn('[Moderation] Warmup failed:', err);
  }
}

/**
 * Full NSFW check: analyze multiple frames or the full video.
 * For now, this implementation just checks the middle frame.
 */
export async function checkNsfw(videoPath: string): Promise<boolean> {
  const scriptPath = `/tmp/nsfw_${crypto.randomUUID()}.py`;

  try {
    const pythonScript = `
import sys, json, subprocess
from transformers import pipeline
from PIL import Image

video_path = sys.argv[1]
temp_frame = '/tmp/temp_frame.jpg'

# Get video duration
result = subprocess.run(
    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', video_path],
    capture_output=True, text=True
)
duration = float(result.stdout.strip())
middle_time = duration / 2

# Extract middle frame
subprocess.run([
    'ffmpeg', '-ss', str(middle_time), '-i', video_path,
    '-vframes', '1', '-vf', 'scale=384:384', temp_frame, '-y'
], capture_output=True)

# Load model and predict
classifier = pipeline("image-classification", model="AdamCodd/vit-base-nsfw-detector")
img = Image.open(temp_frame)
scores = classifier(img)[0]  # Returns dict like {'label': 'sfw', 'score': 0.99}

print(json.dumps(scores))

# Clean up
import os
os.remove(temp_frame)
`;

    await writeFile(scriptPath, pythonScript);
    const { stdout } = await execAsync(
      `python3 "${scriptPath}" "${videoPath}"`
    );
    await unlink(scriptPath).catch(() => {});

    const result = JSON.parse(stdout);
    // If label is 'sfw', consider safe; else unsafe
    return result.label.toLowerCase() === 'sfw';
  } catch (err) {
    console.error('[Moderation] NSFW check failed:', err);
    return false;
  }
}

/**
 * Fast NSFW check: single-frame sampling
 * Alias to checkNsfw for now
 */
export async function checkNsfwFast(videoPath: string): Promise<boolean> {
  return checkNsfw(videoPath);
}
