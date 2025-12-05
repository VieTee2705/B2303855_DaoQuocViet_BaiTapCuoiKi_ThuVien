import express from "express";
import * as sachController from "../controllers/sach.controller.js";

// --- BỔ SUNG: Import Multer ---
// (Nếu bạn chưa có file này, xem hướng dẫn tạo ở mục 2 bên dưới)
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(sachController.findAll)

  // --- SỬA LẠI DÒNG NÀY ---
  // Thêm upload.single('HinhAnh') vào trước controller
  // 'HinhAnh' phải khớp với formData.append('HinhAnh', ...) bên Vue
  .post(upload.single("HinhAnh"), sachController.create)

  .delete(sachController.deleteAll);

router
  .route("/:id")
  .get(sachController.findOne)
  // Nếu update sách có cho đổi ảnh bìa thì cũng phải thêm upload.single vào đây
  .put(upload.single("HinhAnh"), sachController.update)
  .delete(sachController.deleteOne);

export default router;
