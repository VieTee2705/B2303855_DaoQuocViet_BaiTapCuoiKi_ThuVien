// backend/middlewares/upload.js
import multer from "multer";
import path from "path";

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu vào thư mục 'public/uploads' đã tạo ở Bước 1
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // Đặt tên file = timestamp + đuôi file gốc (để không bị trùng tên)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;
