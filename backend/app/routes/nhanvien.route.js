import express from "express";
import * as nhanvienController from "../controllers/nhanvien.controller.js";

const router = express.Router();

router
  .route("/")
  .get(nhanvienController.findAll)
  .post(nhanvienController.create)
  .delete(nhanvienController.deleteAll);

router.route("/login").post(nhanvienController.login);

router
  .route("/:id")
  .get(nhanvienController.findOne)
  .put(nhanvienController.update)
  .delete(nhanvienController.deleteOne);

export default router;
