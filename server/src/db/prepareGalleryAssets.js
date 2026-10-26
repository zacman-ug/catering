import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'images');
const uploadsGalleryDir = path.join(__dirname, '../../uploads/gallery');
const manifestPath = path.join(__dirname, 'gallery-business-profile.json');

function toNaturalNumeric(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function prepareGalleryAssets() {
  await fs.mkdir(uploadsGalleryDir, { recursive: true });

  let entries = [];
  try {
    entries = await fs.readdir(sourceDir, { withFileTypes: true });
  } catch {
    entries = [];
  }

  const imageFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(webp|jpg|jpeg|png|gif)$/i.test(name))
    .sort(toNaturalNumeric);

  if (imageFiles.length === 0) {
    await fs.writeFile(manifestPath, '[]\n', 'utf-8');
    console.warn(`No images in ${sourceDir}. Wrote empty gallery manifest. Add photos and re-run.`);
    return;
  }

  const manifest = [];

  for (let index = 0; index < imageFiles.length; index += 1) {
    const fileName = imageFiles[index];
    const sourceFile = path.join(sourceDir, fileName);
    const targetFile = path.join(uploadsGalleryDir, fileName);

    await fs.copyFile(sourceFile, targetFile);

    manifest.push({
      title: `Chef Godwin Photo ${index + 1}`,
      caption: 'Chef Godwin Foods and Kitchen Uganda',
      image_url: `/uploads/gallery/${fileName}`,
      category: 'business-profile',
    });
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

  console.log(`Prepared ${imageFiles.length} image(s) into ${uploadsGalleryDir}`);
  console.log(`Updated gallery manifest: ${manifestPath}`);
}

prepareGalleryAssets().catch((error) => {
  console.error('Gallery prepare failed:', error.message);
  process.exit(1);
});
