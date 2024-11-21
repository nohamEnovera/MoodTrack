import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ffmpegPath = dirname(require.resolve('@ffmpeg/core'));
const publicPath = join(__dirname, '../public/ffmpeg');

try {
  // Create ffmpeg directory if it doesn't exist
  mkdirSync(publicPath, { recursive: true });

  // Copy FFmpeg files
  copyFileSync(
    join(ffmpegPath, 'ffmpeg-core.wasm'),
    join(publicPath, 'ffmpeg-core.wasm')
  );
  
  copyFileSync(
    join(ffmpegPath, 'ffmpeg-core.worker.js'),
    join(publicPath, 'ffmpeg-core.worker.js')
  );
} catch (error) {
  console.error('Error copying FFmpeg files:', error);
  process.exit(1);
}