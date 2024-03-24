import { UserRole } from "@prisma/client";
import express from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.superAdmin),
  fileUploader.upload.single("file"),
  userController.createAdmin
);

export const userRoutes = router;
