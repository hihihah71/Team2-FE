## CV Matching Platform – Frontend

Ứng dụng web React + TypeScript + Vite cho bài toán quản lý CV sinh viên và nhà tuyển dụng.

### 1. Yêu cầu môi trường

- Node.js >= 18
- Yarn (khuyến nghị)

### 2. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc frontend:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

`VITE_API_BASE_URL` là URL của backend (Node/Express). Khi deploy, chỉ cần đổi giá trị này.

### 3. Các bước khởi động

1. **Cài dependency (chạy một lần) – trong thư mục `Team2-FE`:**

   ```bash
   yarn install
   ```
2. **Chạy backend – trong thư mục backend (ví dụ `Team2-BE`):**

   ```bash
   yarn dev
   ```
   Backend mặc định chạy ở `http://localhost:3000`.
3. **Chạy frontend – trong thư mục `Team2-FE`:**

   ```bash
   yarn dev
   ```
   Mở trình duyệt tới `http://localhost:5173` (hoặc URL Vite in ra).
4. **Build production (tuỳ chọn):**

   ```bash
   yarn build
   ```
   Kết quả build nằm trong thư mục `dist/`.
