# Quy ước cho Dự án Backend

Để đảm bảo sự đồng bộ và chất lượng code trong dự án backend, tất cả các thành viên trong nhóm cần tuân thủ các quy ước sau.

## 1. Công cụ và Môi trường

*   **Ngôn ngữ:** [Chưa xác định - Vui lòng cập nhật] (ví dụ: Node.js, Python, Java)
*   **Code Formatter & Linter:** Sử dụng các công cụ định dạng và kiểm tra code tiêu chuẩn cho ngôn ngữ đã chọn (ví dụ: Prettier/ESLint cho Node.js, Black/Flake8 cho Python).
*   **Quản lý Biến môi trường:** Tất cả các thông tin nhạy cảm (API keys, database credentials) phải được lưu trong file `.env` và không được commit lên Git. Cần có một file `.env.example` để mô tả các biến cần thiết.

## 2. Quy ước Thiết kế API

*   **RESTful Principles:** Tuân thủ các nguyên tắc của RESTful API.
    *   Sử dụng các phương thức HTTP một cách chính xác: `GET` (lấy dữ liệu), `POST` (tạo mới), `PUT`/`PATCH` (cập nhật), `DELETE` (xóa).
    *   **Endpoint Naming:** Sử dụng danh từ số nhiều và `kebab-case` (ví dụ: `/api/v1/users`, `/api/v1/blog-posts`).
*   **Versioning:** Đưa phiên bản API vào URL (ví dụ: `/api/v1/...`).
*   **Response Format:** Thống nhất cấu trúc JSON trả về.
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Thao tác thành công"
    }
    ```
    Hoặc khi có lỗi:
    ```json
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message": "Mô tả lỗi"
      }
    }
    ```

## 3. Quy ước Viết Code

*   **Naming:** Sử dụng `camelCase` cho biến/hàm và `PascalCase` cho classes (tuỳ thuộc vào quy ước của ngôn ngữ).
*   **Error Handling:** Sử dụng cơ chế `try...catch` hoặc tương đương để xử lý lỗi một cách triệt để. Không để lộ chi tiết lỗi hệ thống cho người dùng cuối.
*   **Database:**
    *   Tên bảng (table) dùng danh từ số nhiều, viết bằng `snake_case` (ví dụ: `blog_posts`).
    *   Tên cột (column) dùng danh từ số ít, viết bằng `snake_case` (ví dụ: `user_name`, `created_at`).

---
*Vui lòng cập nhật tài liệu này nếu có bất kỳ thay đổi nào trong quy ước của dự án.*
