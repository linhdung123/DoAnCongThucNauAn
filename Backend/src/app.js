import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tipsRouter from "./routes/tips.js";
import recipesRouter from "./routes/recipes.js";
import uploadRouter from "./routes/upload.js";

const app = express();

const __dirnameApp = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirnameApp, "..");
const uploadsPath = path.join(backendRoot, "uploads");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadsPath));

app.get("/", (_req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><title>API Cooks Delight</title></head>
<body style="font-family:system-ui;padding:2rem;max-width:40rem">
  <h1>Backend API đang chạy</h1>
  <p>Đây chỉ là máy chủ API (port 5000). <strong>Giao diện web</strong> cần mở riêng:</p>
  <p>Chạy trong thư mục <code>Frontend</code>: <code>npm run dev</code> → thường là <a href="http://localhost:5173">http://localhost:5173</a></p>
  <hr>
  <p>Thử API:</p>
  <ul>
    <li><a href="/api/health">GET /api/health</a></li>
    <li><a href="/api/tips">GET /api/tips</a></li>
    <li><a href="/api/recipes">GET /api/recipes</a></li>
  </ul>
</body></html>`);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/tips", tipsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/upload", uploadRouter);

/** Lỗi từ express.json (body sai) hoặc next(err) — trả JSON thay vì HTML 500 */
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const msg = String(err.message || "");
  if (status === 400 && (/json|parse/i.test(msg) || err instanceof SyntaxError)) {
    return res.status(400).json({ message: "Dữ liệu gửi lên không phải JSON hợp lệ" });
  }
  if (status < 500) {
    return res.status(status).json({ message: msg || "Lỗi yêu cầu" });
  }
  console.error("[express]", err);
  res.status(500).json({ message: msg || "Lỗi máy chủ" });
});

export default app;
