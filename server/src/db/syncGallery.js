import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { parseGalleryManifest } from '../domain/galleryItem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, 'gallery-business-profile.json');

async function syncGallery() {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Gallery source file not found: ${sourcePath}. Skipping sync.`);
    await pool.end();
    return;
  }

  const raw = fs.readFileSync(sourcePath, 'utf-8');
  const parsedJson = JSON.parse(raw);
  const parsed = parseGalleryManifest(parsedJson);

  if (!parsed.ok) {
    throw new Error(parsed.error);
  }

  const items = parsed.value;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM gallery');

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      await client.query(
        `INSERT INTO gallery (title, caption, image_url, category, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, TRUE)`,
        [
          item.title,
          item.caption,
          item.imageUrl,
          item.category,
          i + 1,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Gallery synchronized successfully with ${items.length} image(s).`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

syncGallery().catch((err) => {
  console.error('Gallery sync failed:', err.message);
  process.exit(1);
});
