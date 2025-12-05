import express from "express";
import * as nhaxuatbanController from "../controllers/nhaxuatban.controller.js";

const router = express.Router();

router
  .route("/")
  .get(nhaxuatbanController.findAll)
  .post(nhaxuatbanController.create)
  .delete(nhaxuatbanController.deleteAll);

router
  .route("/:id")
  .get(nhaxuatbanController.findOne)
  .put(nhaxuatbanController.update)
  .delete(nhaxuatbanController.deleteOne);

export default router;
