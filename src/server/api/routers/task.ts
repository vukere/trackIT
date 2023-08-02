import { ProgressStatus, Team } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ input, ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        projectId: input.projectId,
      },
    });
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getMy: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        assignedToId: ctx.session.user.id,
      },
      include: {
        project: {
          select: {
            type: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        notes: z.string(),
        status: z.nativeEnum(ProgressStatus),
        team: z.nativeEnum(Team),
        assignedToId: z.string().optional(),
        deadline: z.date(),
        projectId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.create({
        data: {
          ...input,
          assignedToId: input.assignedToId ?? ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        notes: z.string(),
        status: z.nativeEnum(ProgressStatus),
        team: z.nativeEnum(Team),
        assignedToId: z.string().optional(),
        deadline: z.date(),
        projectId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
