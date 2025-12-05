// server.js
import app from "./app.js"; // Import ứng dụng Express đã cấu hình
import MongoDB from "./app/utils/util.mongodb.js"; // Import hàm kết nối Mongoose
import "dotenv/config"; // Nạp biến môi trường ngay từ đầu

// Lấy port từ biến môi trường, nếu không có thì dùng port 3000
const PORT = process.env.PORT || 3000;

/**
 * Hàm bất đồng bộ để khởi chạy máy chủ
 */
async function startServer() {
  try {
    // 1. Kết nối đến cơ sở dữ liệu
    await MongoDB.connect();

    // 2. Nếu kết nối thành công, khởi chạy máy chủ
    app.listen(PORT, () => {
      console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
      console.log(`Truy cập tại: http://localhost:${PORT}`);
    });
  } catch (error) {
    // Nếu kết nối DB thất bại, server sẽ không khởi chạy
    console.error("Không thể khởi chạy máy chủ:", error);
    process.exit(1); // Thoát ứng dụng
  }
}

startServer();
