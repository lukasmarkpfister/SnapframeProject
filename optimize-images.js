import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = './src/static';
const outputDir = './src/static';

const images = [
  'framecolors.jpeg',
  'productblackframestacked.jpeg',
  'productblackframestacked2.jpeg',
  'productpicinvisible.jpeg',
  'productpicvisible.jpeg'
];

async function optimizeImages() {
  console.log('Starting image optimization...\n');
  
  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const outputPath = path.join(outputDir, image.replace('.jpeg', '.webp'));
    
    try {
      const info = await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const newSize = info.size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
      
      console.log(`✓ ${image}`);
      console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`  Optimized: ${(newSize / 1024).toFixed(2)} KB`);
      console.log(`  Reduction: ${reduction}%\n`);
    } catch (error) {
      console.error(`✗ Error processing ${image}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
}

optimizeImages();
