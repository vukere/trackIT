import dayjs from "dayjs";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function getTodayAt0() {
  return dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0).toDate();
}

function getStartOfTheWeek() {
  const now = getTodayAt0();
  const day = now.getDay();
  const diff = now.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

export const timeRecordRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.timeRecord.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
        task: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        to: z.date(),
        from: z.date(),
        taskId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.timeRecord.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.timeRecord.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getTimeToday: protectedProcedure.query(async ({ ctx }) => {
    const zero = getTodayAt0();
    console.log(zero.toDateString());

    const records = await ctx.prisma.timeRecord.findMany({
      where: {
        ownerId: ctx.session.user.id,
        from: getTodayAt0(),
      },
    });
    const millis = records.reduce((res, current) => res + (current.to.getTime() - current.from.getTime()), 0);
    const minutes = Math.floor(millis / 60 / 1000);
    const hours = (minutes - (minutes % 60)) / 60;
    const clockMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${clockMinutes.toString().padStart(2, "0")}`;
  }),

  getReport: protectedProcedure.query(async ({ ctx }) => {
    const records = await ctx.prisma.timeRecord.findMany({
      where: {
        ownerId: ctx.session.user.id,
        to: {
          gte: getStartOfTheWeek(),
        },
      },
    });
    console.log(records);

    const timeSpentPerDay = [0, 0, 0, 0, 0, 0, 0];
    records.forEach((record) => {
      const timeSpent = (record.to.getTime() - record.from.getTime()) / 1000 / 60 / 60;
      console.log(timeSpent);
      console.log(record.to.getDate() - record.from.getDate());
      const dayOfTheWeek = record.to.getDay();
      timeSpentPerDay[dayOfTheWeek] += timeSpent;
    });
    return timeSpentPerDay;
  }),
});
