import mongoose from "mongoose";

const tipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Chiên – Xào", "Nấu – Luộc", "Sơ chế", "Bảo quản"],
    },
    imageUrl: { type: String, required: true },
    frequency: { type: String, default: "Áp dụng hằng ngày" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Tip = mongoose.model("Tip", tipSchema);
