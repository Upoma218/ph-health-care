import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor),
  ScheduleController.getAllSchedule
);

router.post(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  ScheduleController.inserIntoDB
);

export const ScheduleRoutes = router;
