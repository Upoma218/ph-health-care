import { DoctorSchedules, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser, IGenericResponse } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IDoctorScheduleFilterRequest } from "./doctorSchedule.interface";

const insertIntoDB = async (
  data: { scheduleIds: string[] },
  user: any
): Promise<{ count: number }> => {
  const { scheduleIds } = data;
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exists!");
  }
  const doctorSchedulesData = scheduleIds.map((scheduleId) => ({
    doctorId: isDoctorExists.id,
    scheduleId,
    isBooked: false,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedulesData,
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<DoctorSchedules[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedules.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<DoctorSchedules | null> => {
  const result = await prisma.doctorSchedules.findUnique({
    where: {
      id,
    },
    include: {
      doctor: true,
      schedule: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<DoctorSchedules>
): Promise<DoctorSchedules | null> => {
  const result = await prisma.doctorSchedules.update({
    where: {
      id,
    },
    data: payload,
    include: {
      doctor: true,
      schedule: true,
    },
  });
  return result;
};

const deleteFromDB = async (
  user: any,
  scheduleId: string
): Promise<DoctorSchedules> => {
  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exitsts");
  }

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: isDoctorExists.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (!isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't delete thid schedule! It's already booked!"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: isDoctorExists.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

const getMySchedules = async (
  filters: any,
  options: IPaginationOptions,
  user: IAuthUser
): Promise<IGenericResponse<DoctorSchedules[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {},
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const DoctorScheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  getMySchedules,
};
