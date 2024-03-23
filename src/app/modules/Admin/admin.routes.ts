import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validations";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  AdminController.getAllFromDB
);

router.get(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  AdminController.getById
);

router.patch(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(adminValidationSchemas.update),
  AdminController.update
);

router.delete(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  AdminController.deleteData
);

router.delete(
  "/soft/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  AdminController.deleteData
);

export const AdminRoutes = router;
