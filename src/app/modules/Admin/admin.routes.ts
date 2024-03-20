import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validations";

const router = express.Router();

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getById);
router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.update),
  AdminController.update
);
router.delete("/:id", AdminController.deleteData);

export const AdminRoutes = router;
