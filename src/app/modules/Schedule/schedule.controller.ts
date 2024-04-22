import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { ScheduleService } from "./schedule.sevice";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.inserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});
const getAllSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await ScheduleService.getAllFromDB(filters, options, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const ScheduleController = {
  inserIntoDB,
  getAllSchedule,
};
