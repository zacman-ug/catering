import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  cb(ext && mime ? null : new Error('Only image files are allowed'), ext && mime);
};

export const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadSizeMb * 1024 * 1024 },
  fileFilter,
});
