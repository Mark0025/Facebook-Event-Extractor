import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 48, 128];
const sourceIcon = new URL('../src/assets/icon.svg', import.meta.url).pathname;

async function generateIcons() {
  try {
    // Ensure assets directory exists
    await mkdir(new URL('../dist/assets', import.meta.url).pathname, { recursive: true });

    // Generate icons for each size
    await Promise.all(sizes.map(async (size) => {
      const outputPath = new URL(`../dist/assets/icon${size}.png`, import.meta.url).pathname;
      
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${size}x${size} icon`);
    }));
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 