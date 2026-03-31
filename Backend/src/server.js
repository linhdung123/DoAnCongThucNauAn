import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cooks_delight";

async function main() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API chạy tại http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
