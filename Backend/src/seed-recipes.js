import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "./models/Recipe.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cooks_delight";

const samples = [
  {
    name: "Salad Cá",
    description: "Nhẹ bụng, giàu omega-3",
    category: "Salad",
    ingredients: [
      { name: "Cá hồi", amount: "200g" },
      { name: "Rau xà lách", amount: "1 bó" },
    ],
    instructions: [
      "Bước 1: Áp chảo cá hai mặt.",
      "Bước 2: Trộn rau với sốt olive.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  },
  {
    name: "Phở",
    description: "Nước dùng trong, thơm quế hồi",
    category: "Nấu – Luộc",
    ingredients: [
      { name: "Xương bò", amount: "1kg" },
      { name: "Bánh phở", amount: "500g" },
    ],
    instructions: [
      "Bước 1: Hầm xương 3–4 giờ.",
      "Bước 2: Nêm gia vị, chan nước dùng nóng.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80",
  },
  {
    name: "Cơm Tấm",
    description: "Sườn nướng đậm đà",
    category: "Chiên – Xào",
    ingredients: [
      { name: "Sườn heo", amount: "400g" },
      { name: "Gạo tấm", amount: "300g" },
    ],
    instructions: [
      "Bước 1: Ướp sườn với tỏi, nước mắm.",
      "Bước 2: Nướng hoặc chiên vàng, ăn kèm cơm.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80",
  },
  {
    name: "Mì Ý",
    description: "Sốt cà chua homemade",
    category: "Mì & Pasta",
    ingredients: [
      { name: "Mì spaghetti", amount: "250g" },
      { name: "Cà chua", amount: "400g" },
    ],
    instructions: [
      "Bước 1: Luộc mì al dente.",
      "Bước 2: Xào sốt cà, trộn với mì.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Recipe.deleteMany({});
  await Recipe.insertMany(samples);
  console.log("Đã seed", samples.length, "món ăn.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
