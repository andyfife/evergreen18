// lib/whisper.ts
import { execFile } from 'child_process';
import { promisify } from 'util';
import { unlink } from 'fs/promises';

const execFileAsync = promisify(execFile);

export async function transcribeWithWhisper(videoUrl: string) {
  const videoPath = `/tmp/${Date.now()}-video.mp4`;
  const audioPath = `/tmp/${Date.now()}-audio.wav`;

  try {
    // 1. Download video
    await execFileAsync('curl', ['-L', '-o', videoPath, videoUrl]);

    // 2. Extract audio
    await execFileAsync('ffmpeg', [
      '-i',
      videoPath,
      '-vn',
      '-acodec',
      'pcm_s16le',
      '-ar',
      '16000',
      '-ac',
      '1',
      audioPath,
    ]);

    // 3. Run faster-whisper
    const { stdout } = await execFileAsync('whisper', [
      audioPath,
      '--model',
      'base',
      '--output_format',
      'json',
    ]);

    const result = JSON.parse(stdout);
    return {
      text: result.text,
      segments: result.segments,
    };
  } finally {
    // Cleanup
    await Promise.allSettled([
      unlink(videoPath).catch(() => {}),
      unlink(audioPath).catch(() => {}),
    ]);
  }
}
