// app/utils/mongodb.js
import mongoose from 'mongoose';
import 'dotenv/config'; // Nạp biến môi trường từ .env

// Lấy URI từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Lỗi: Vui lòng cung cấp MONGODB_URI trong file .env");
    process.exit(1);
}

/**
 * Khởi tạo kết nối đến MongoDB bằng Mongoose.
 */
async function connectToDatabase() {
    try {
        // Mongoose.connect trả về một promise
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Đã kết nối thành công đến MongoDB (Mongoose).");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
}

// Thiết lập lắng nghe sự kiện khi mất kết nối
mongoose.connection.on('disconnected', () => {
    console.log("MongoDB đã bị ngắt kết nối.");
});

// export default connectToDatabase;
// Hoặc export một đối tượng nếu bạn muốn
const MongoDB = {
    connect: connectToDatabase,
    // Bạn có thể thêm các thứ khác ở đây nếu cần
};

export default MongoDB;