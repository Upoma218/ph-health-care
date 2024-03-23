import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", auth(UserRole.superAdmin), userController.createAdmin);

export const userRoutes = router;
