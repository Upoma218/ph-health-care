import express from "express";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { DoctorRoutes } from "../modules/Doctor/doctor.route";
import { SpecialitiesRoutes } from "../modules/Specialities/specialities.routes";
import { userRoutes } from "../modules/User/user.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
