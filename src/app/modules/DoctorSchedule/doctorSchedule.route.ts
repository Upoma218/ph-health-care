import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleController } from "./doctorSchedule.controller";
import { DoctorScheduleValidation } from "./doctorSchedule.validations";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  ScheduleController.getAllFromDB
);

router.get(
  "/my-schedules",
  auth(UserRole.doctor),
  ScheduleController.getMySchedules
);

router.patch("/:id", ScheduleController.updateIntoDB);
router.post(
  "/",
  validateRequest(DoctorScheduleValidation.create),
  auth(UserRole.doctor),
  ScheduleController.insertIntoDB
);
router.delete("/:id", auth(UserRole.doctor), ScheduleController.deleteFromDB);

export const DoctorScheduleRoutes = router;
