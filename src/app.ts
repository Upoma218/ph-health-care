import cors from "cors";
import express, { Application, Request, Response } from "express";
import { userRoutes } from "./app/modules/User/user";

const app: Application = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "PH Healthcare server is running..",
  });
});

app.use("/api/v1/user", userRoutes);

export default app;
