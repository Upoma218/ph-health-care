import express from "express";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AppointmentRoutes } from "../modules/Appointment/appointment.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { DoctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";
import { PatientRoutes } from "../modules/Patient/patient.route";
import { paymentRoutes } from "../modules/Payment/payment.routes";
import { ScheduleRoutes } from "../modules/Schedule/schedule.routes";
import { SpecialitiesRoutes } from "../modules/Specialities/specialities.routes";
import { userRoutes } from "../modules/User/user.routes";
import { PrescriptionsRoutes } from "../modules/Prescription/prescription.route";
import { ReviewRoutes } from "../modules/Review/review.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialities",
    route: SpecialitiesRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionsRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
