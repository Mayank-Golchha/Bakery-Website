import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeImages() {
  const dir = './public';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') && f.startsWith('image'));
  for (const file of files) {
    console.log(`Optimizing ${file}...`);
    await sharp(path.join(dir, file))
      .resize(600) // Resize to 600px width
      .webp({ quality: 80 })
      .toFile(path.join(dir, file.replace('.jpg', '.webp')));
  }
  console.log('Done!');
}
optimizeImages();
