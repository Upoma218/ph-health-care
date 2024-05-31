import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cron from "node-cron";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AppointmentServices } from "./app/modules/Appointment/appointment.services";
import router from "./app/routes";

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cron.schedule("* * * * *", async (): Promise<void> => {
  try {
    await AppointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "PH Healthcare server is running..",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
