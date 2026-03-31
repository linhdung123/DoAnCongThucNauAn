import { Router } from "express";
import { Tip } from "../models/Tip.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};
    const tips = await Tip.find(filter).sort({ createdAt: -1 }).lean();
    res.json(tips);
  } catch (e) {
    res.status(500).json({ message: e.message || "Lỗi máy chủ" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const tip = await Tip.findOne({ slug: req.params.slug }).lean();
    if (!tip) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(tip);
  } catch (e) {
    res.status(500).json({ message: e.message || "Lỗi máy chủ" });
  }
});

export default router;
