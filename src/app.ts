import cors from "cors";
import express, { Application, Request, Response } from "express";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";
import { userRoutes } from "./app/modules/User/user.routes";

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "PH Healthcare server is running..",
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", AdminRoutes);

export default app;
