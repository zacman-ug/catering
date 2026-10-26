import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGalleryManifest } from './galleryItem.js';

test('parseGalleryManifest rejects non-array input', () => {
  const result = parseGalleryManifest({});
  assert.equal(result.ok, false);
});

test('parseGalleryManifest validates items', () => {
  const result = parseGalleryManifest([
    { title: 'Event', image_url: '/uploads/gallery/1.webp' },
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.value[0].imageUrl, '/uploads/gallery/1.webp');
});
