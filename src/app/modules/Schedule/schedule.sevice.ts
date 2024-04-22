import { Prisma, Schedule } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { paginationHelper } from "../../../helpars/paginationHelper";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { ISchedule, IScheduleFilterRequest } from "./schedule.interface";

const inserIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interverlTime = 30;
  const schedule = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(lastDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interverlTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedule.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedule;
};

const getAllFromDB = async (
  filters: IScheduleFilterRequest,
  options: IPaginationOptions,
  user: any
): Promise<IGenericResponse<Schedule[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  console.log("time", startDate, endDate);

  // Extracting startDate and endDate from filters

  const andConditions = [];

  // Adding date filtering conditions if startDate and endDate are provided
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate, // Greater than or equal to startDate
          },
        },
        {
          endDateTime: {
            lte: endDate, // Less than or equal to endDate
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorsSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorScheduleIds = new Set(
    doctorsSchedules.map((schedule) => schedule.scheduleId)
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: [...doctorScheduleIds],
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: [...doctorScheduleIds],
      },
    },
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

export const ScheduleService = {
  inserIntoDB,
  getAllFromDB,
};
