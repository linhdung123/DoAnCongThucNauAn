import { Router } from "express";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe.js";

const router = Router();

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/** Chuẩn hóa body từ client — tránh phần tử sai kiểu gây lỗi khi ghi MongoDB */
function sanitizeRecipeBody(body) {
  const b = body && typeof body === "object" ? body : {};
  const ingredients = [];
  if (Array.isArray(b.ingredients)) {
    for (const item of b.ingredients) {
      if (item != null && typeof item === "object" && !Array.isArray(item)) {
        const name = String(item.name ?? "").trim();
        const amount = String(item.amount ?? "").trim();
        if (name) ingredients.push({ name, amount });
      }
    }
  }
  let instructions = [];
  if (Array.isArray(b.instructions)) {
    instructions = b.instructions
      .map((x) => String(x ?? "").trim())
      .filter(Boolean);
  }
  return {
    name: String(b.name ?? "").trim(),
    description: String(b.description ?? "").trim(),
    category: String(b.category ?? "").trim(),
    ingredients,
    instructions,
    imageUrl: String(b.imageUrl ?? "").trim(),
  };
}

router.get("/", async (_req, res) => {
  try {
    const list = await Recipe.find().sort({ updatedAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message || "Lỗi máy chủ" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Chưa kết nối MongoDB — kiểm tra MongoDB và khởi động lại Backend.",
      });
    }
    const data = sanitizeRecipeBody(req.body);
    if (!data.name) {
      return res.status(400).json({ message: "Thiếu tên món" });
    }
    if (!data.category) {
      return res.status(400).json({ message: "Thiếu danh mục" });
    }
    if (!data.imageUrl) {
      return res.status(400).json({ message: "Thiếu ảnh món (tải ảnh hoặc dán link)" });
    }
    const doc = await Recipe.create(data);
    res.status(201).json(doc.toObject());
  } catch (e) {
    console.error("[POST /api/recipes]", e);
    res.status(400).json({ message: e.message || "Dữ liệu không hợp lệ" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const data = sanitizeRecipeBody(req.body);
    if (!data.name) {
      return res.status(400).json({ message: "Thiếu tên món" });
    }
    if (!data.category) {
      return res.status(400).json({ message: "Thiếu danh mục" });
    }
    if (!data.imageUrl) {
      return res.status(400).json({ message: "Thiếu ảnh món" });
    }
    const updated = await Recipe.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(updated);
  } catch (e) {
    console.error("[PUT /api/recipes]", e);
    res.status(400).json({ message: e.message || "Cập nhật thất bại" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const deleted = await Recipe.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy" });
    res.json({ ok: true, id });
  } catch (e) {
    res.status(500).json({ message: e.message || "Lỗi máy chủ" });
  }
});

export default router;
