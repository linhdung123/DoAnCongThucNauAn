# Cooks Delight — Đồ án công thức nấu ăn

## Chức năng

- **Frontend (React + Vite + Tailwind):** Cooks Delight — Tips & mẹo; **Mục lục** (`/muc-luc`) = **Quản lý món ăn**: form thêm/sửa, lưới thẻ Sửa/Xóa.
- **Backend (Express + Mongoose):** `/api/tips`, `/api/recipes` (CRUD).
- **MongoDB:** `tips` (Tip); `recipes` (Recipe) — `name`, `description`, `category`, `ingredients[]` (`name`, `amount`), `instructions[]`, `imageUrl`.

## Chạy dự án

1. Cài và khởi động **MongoDB** (local hoặc Atlas). Sao chép `Backend/.env.example` thành `Backend/.env` và chỉnh `MONGODB_URI` nếu cần.

2. **Backend**

```bash
cd Backend
npm install
npm run seed
npm run seed:recipes
npm run dev
```

3. **Frontend** (terminal khác)

```bash
cd Frontend
npm install
npm run dev
```

Mở trình duyệt: `http://localhost:5173` — API được proxy tới `http://localhost:5000` khi dev.

## API

- `GET /api/tips` — tất cả tips.
- `GET /api/tips?category=Chiên%20%E2%80%93%20Xào` — lọc theo `category` (chuỗi khớp enum trong model).
- `GET /api/tips/:slug` — một tip.

**Recipes**

- `GET /api/recipes` — danh sách món.
- `POST /api/recipes` — tạo món (JSON body).
- `PUT /api/recipes/:id` — cập nhật.
- `DELETE /api/recipes/:id` — xóa.

- `POST /api/upload` — multipart field `image` (ảnh JPEG, PNG, GIF, WebP, SVG, BMP, ICO; tối đa 5MB) → trả `{ imageUrl: "/uploads/..." }`. File lưu trong `Backend/uploads/`.
