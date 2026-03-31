import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirnameRoutes = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirnameRoutes, "..", "..");
const uploadDir = path.join(backendRoot, "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.error("[upload] Không tạo được thư mục uploads:", uploadDir, e);
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/x-icon",
  "image/heic",
  "image/heif",
  "image/pjpeg",
]);

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
  ".heic",
  ".heif",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt =
      ext && ext.length <= 8
        ? ext
        : file.mimetype === "image/jpeg"
          ? ".jpg"
          : ".png";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (ALLOWED_MIME.has(file.mimetype) || ALLOWED_EXT.has(ext)) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Chỉ chấp nhận ảnh: JPEG, PNG, GIF, WebP, SVG, BMP, ICO, HEIC"
      )
    );
  },
});

const router = Router();

router.post("/", (req, res) => {
  try {
    upload.single("image")(req, res, (err) => {
      if (err) {
        const msg =
          err.code === "LIMIT_FILE_SIZE"
            ? "Ảnh tối đa 5MB"
            : err.message || "Upload thất bại";
        return res.status(400).json({ message: msg });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Chưa chọn file ảnh" });
      }
      res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
    });
  } catch (e) {
    console.error("[upload]", e);
    res.status(500).json({ message: "Lỗi máy chủ khi nhận file" });
  }
});

export default router;
