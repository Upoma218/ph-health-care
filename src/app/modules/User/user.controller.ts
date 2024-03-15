import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  //   console.log();
  const result = await userServices.createAdminIntoDB(req.body);
  res.send(result);
};

export const userController = {
  createAdmin,
};
