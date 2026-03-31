# Quy ước cho Dự án Frontend

Để đảm bảo tính nhất quán và tránh xung đột trong quá trình phát triển, tất cả các thành viên trong nhóm cần tuân thủ các quy ước dưới đây.

## 1. Công cụ và Cấu hình

*   **Code Formatter:** Sử dụng [Prettier](https://prettier.io/) để tự động định dạng code. Cấu hình Prettier sẽ được chia sẻ trong file `.prettierrc` của dự án.
*   **Linter:** Sử dụng [ESLint](https://eslint.org/) để phát hiện các vấn đề về cú pháp và phong cách code. Cấu hình sẽ nằm trong file `.eslintrc.js`.
*   **Editor:** Khuyến khích sử dụng Visual Studio Code với các extension sau:
    *   ESLint
    *   Prettier - Code formatter

## 2. Quy ước Đặt tên

*   **Components:** Sử dụng `PascalCase` (ví dụ: `UserProfile`, `NavigationBar`). Tên file component phải trùng với tên component.
*   **Files & Folders:** Sử dụng `kebab-case` cho các file và thư mục khác (ví dụ: `user-profile.js`, `api-client`).
*   **Biến và Hàm:** Sử dụng `camelCase` (ví dụ: `userName`, `fetchData`).

## 3. Cấu trúc Thư mục

Dự án tuân theo cấu trúc thư mục đã được thống nhất:

```
/
├── public/         # Chứa các file tĩnh (index.html, images)
└── src/
    ├── assets/     # Chứa tài sản (hình ảnh, fonts)
    ├── components/ # Chứa các component tái sử dụng
    ├── pages/      # Chứa các trang chính của ứng dụng
    ├── styles/     # Chứa các file style toàn cục
    └── utils/      # Chứa các hàm tiện ích
```

## 4. Quy ước Viết Code

*   **Imports:** Sắp xếp các import theo thứ tự: thư viện bên ngoài, sau đó đến các module nội bộ.
*   **Comments:** Viết comment rõ ràng cho các logic phức tạp.

## 5. Quy ước HTML

*   **Semantic HTML:** Luôn sử dụng các thẻ HTML ngữ nghĩa (`<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>`) để cải thiện SEO và khả năng tiếp cận (accessibility).
*   **Accessibility (a11y):** Đảm bảo các yếu tố trên trang có thể truy cập được. Ví dụ:
    *   Thêm thuộc tính `alt` cho tất cả các thẻ `<img>`.
    *   Sử dụng thẻ `<label>` cho các input trong form.
*   **Viết code sạch:**
    *   Sử dụng chữ thường cho tên thẻ và thuộc tính.
    *   Luôn đóng các thẻ.
    *   Thụt lề code một cách nhất quán.

## 6. Quy ước CSS

*   **Phương pháp luận:** Sử dụng quy ước đặt tên **BEM (Block, Element, Modifier)** để viết CSS có cấu trúc và dễ bảo trì.
    *   `.block`
    *   `.block__element`
    *   `.block--modifier`
*   **Thứ tự thuộc tính:** Sắp xếp các thuộc tính CSS theo một thứ tự logic để dễ đọc. Ví dụ:
    1.  Positioning (`position`, `top`, `z-index`)
    2.  Box Model (`display`, `width`, `margin`, `padding`)
    3.  Typography (`font-family`, `font-size`, `color`)
    4.  Visual (`background`, `border`, `box-shadow`)
    5.  Misc (`transition`, `animation`)
*   **Đơn vị:** Ưu tiên sử dụng các đơn vị tương đối (`rem`, `em`, `%`) thay vì đơn vị tuyệt đối (`px`) để hỗ trợ responsive design.

---
*Vui lòng cập nhật tài liệu này nếu có bất kỳ thay đổi nào trong quy ước của dự án.*
