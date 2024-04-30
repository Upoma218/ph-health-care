import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentController } from "./appointment.controller";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  AppointmentController.getAllFromDB
);

router.get(
  "/my-appointments",
  auth(UserRole.patient, UserRole.doctor),
  AppointmentController.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.patient),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

router.patch(
  "/status/:id",
  auth(UserRole.doctor, UserRole.admin, UserRole.superAdmin),
  AppointmentController.changeAppointmentStatus
);

export const AppointmentRoutes = router;
