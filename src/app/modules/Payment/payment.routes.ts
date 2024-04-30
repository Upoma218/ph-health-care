import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// router.post("/ipn", PaymentController.validate);
router.get("/ipn", PaymentController.validate);

router.post(
  "/init/:appointmentId",
  auth(UserRole.patient),
  PaymentController.initPayment
);

export const paymentRoutes = router;
