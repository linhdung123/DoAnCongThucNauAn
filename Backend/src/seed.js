import "dotenv/config";
import mongoose from "mongoose";
import { Tip } from "./models/Tip.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cooks_delight";

const samples = [
  {
    title: "Chiên – Xào đúng cách",
    description: "Giúp món ăn vàng đều, không khô",
    category: "Chiên – Xào",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    frequency: "Áp dụng hằng ngày",
    slug: "chien-xao-dung-cach",
  },
  {
    title: "Nấu – Luộc ngon hơn",
    description: "Giữ vị ngọt tự nhiên, không bị bở",
    category: "Nấu – Luộc",
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    frequency: "Áp dụng hằng ngày",
    slug: "nau-luoc-ngon-hon",
  },
  {
    title: "Sơ chế thực phẩm đúng cách",
    description: "An toàn và giữ dinh dưỡng tối đa",
    category: "Sơ chế",
    imageUrl:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80",
    frequency: "Áp dụng hằng ngày",
    slug: "so-che-dung-cach",
  },
  {
    title: "Bảo quản thực phẩm tươi lâu hơn",
    description: "Sắp xếp tủ lạnh và gói bọc hợp lý",
    category: "Bảo quản",
    imageUrl:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80",
    frequency: "Áp dụng hằng ngày",
    slug: "bao-quan-tuoi-lau",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Tip.deleteMany({});
  await Tip.insertMany(samples);
  console.log("Đã seed", samples.length, "tips.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
