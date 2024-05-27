import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { MetaController } from "./meta.controller";

const router = express.Router();

// Routes for fetching metadata for the dashboard
router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  MetaController.fetchDashboardMetadata
);

export const MetaRoutes = router;
