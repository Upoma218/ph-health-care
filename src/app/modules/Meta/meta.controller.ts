import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { metaServices } from "./meta.service";

const fetchDashboardMetadata = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await metaServices.fetchDashboardMetadata(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Patient retrieval successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetadata,
};
