import express from "express";
import * as docgiaController from "../controllers/docgia.controller.js";

const router = express.Router();

// Định nghĩa các route cho Độc giả

router
  .route("/")
  // Lấy tất cả độc giả (có thể tìm theo Tên)
  // GET /api/docgia?Ten=...
  .get(docgiaController.findAll)

  // Tạo một độc giả mới
  // POST /api/docgia
  .post(docgiaController.create2)

  // Xóa tất cả độc giả
  // DELETE /api/docgia
  .delete(docgiaController.deleteAll);

router
  .route("/:id")
  // Lấy một độc giả bằng id
  // GET /api/docgia/:id
  .get(docgiaController.findOne)

  // Cập nhật thông tin một độc giả
  // PUT /api/docgia/:id
  .put(docgiaController.update)

  // Xóa một độc giả
  // DELETE /api/docgia/:id
  .delete(docgiaController.deleteOne);

router.route("/login").post(docgiaController.login);

export default router;
