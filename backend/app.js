// app.js
import express from "express";
import cors from "cors";
import ApiError from "./app/api-error.js"; // Import ApiError (ESM)
import path from "path";
// Import các routers (bạn cần tạo các file route này)
import nhanVienRouter from "./app/routes/nhanvien.route.js";
import docGiaRouter from "./app/routes/docgia.route.js";
import nhaXuatBanRouter from "./app/routes/nhaxuatban.route.js";
import sachRouter from "./app/routes/sach.route.js";
import muonSachRouter from "./app/routes/theodoimuonsach.route.js";
import authRouter from "./app/routes/auth.route.js";
import yeuCauMuonSachRouter from "./app/routes/yeucaumuonsach.route.js";

const app = express();

// --- Cấu hình Middleware ---
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Phân tích JSON request body
app.use("/uploads", express.static("public/uploads"));
// --- Tuyến đường (Routes) ---

// Route cơ bản
app.get("/", (req, res) => {
  res.json({ message: "Chào mừng đến với ứng dụng quản lý thư viện." });
});

// Đăng ký các API routes cho từng module
app.use("/api/nhanvien", nhanVienRouter);
app.use("/api/docgia", docGiaRouter);
app.use("/api/nhaxuatban", nhaXuatBanRouter);
app.use("/api/sach", sachRouter);
app.use("/api/yeucaumuonsach", yeuCauMuonSachRouter);
app.use("/api/auth", authRouter);
app.use("/api/muonsach", muonSachRouter);

// --- Xử lý lỗi tập trung ---

// 1. Xử lý lỗi 404 (Không tìm thấy route)
app.use((req, res, next) => {
  // Chuyển tiếp lỗi 404 đến middleware xử lý lỗi
  return next(new ApiError(404, "Không tìm thấy tài nguyên"));
});

// 2. Middleware xử lý lỗi tập trung (Error Handler)
app.use((err, req, res, next) => {
  // Logic AN TOÀN: Nếu statusCode không phải là số, ép về 500
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;

  const message = err.message || "Lỗi nội bộ server";
  return res.status(statusCode).json({
    message: message,
  });
});

export default app;
