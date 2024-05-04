import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionValidation } from "./prescription.validations";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  PrescriptionController.getAllFromDB
);

//router.get('/:id', PrescriptionController.getByIdFromDB);
router.get(
  "/my-prescriptions",
  auth(UserRole.patient),
  PrescriptionController.patientPrescriptions
);

router.post(
  "/",
  auth(UserRole.doctor),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionsRoutes = router;
