import express from "express";
import * as theodoimuonsachController from "../controllers/theodoimuonsach.controller.js";

const router = express.Router();

router
  .route("/")
  .get(theodoimuonsachController.findAll)
  .post(theodoimuonsachController.create)
  .delete(theodoimuonsachController.deleteAll);

router
  .route("/:id")
  .get(theodoimuonsachController.findOne)
  .put(theodoimuonsachController.update)
  .delete(theodoimuonsachController.deleteOne);

export default router;
