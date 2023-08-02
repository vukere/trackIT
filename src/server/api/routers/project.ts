import { ProgressStatus, ProjectType } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        members: {
          some: {
            memberId: ctx.session.user.id,
          },
        },
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
      return ctx.prisma.project.findFirst({
        where: {
          members: {
            some: {
              memberId: ctx.session.user.id,
            },
          },
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        notes: z.string(),
        deadline: z.date(),
        status: z.nativeEnum(ProgressStatus),
        type: z.nativeEnum(ProjectType),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newProject = await ctx.prisma.project.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
        },
      });
      await ctx.prisma.projectMembers.create({
        data: {
          projectId: newProject.id,
          memberId: ctx.session.user.id,
        },
      });

      return newProject;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        notes: z.string(),
        deadline: z.date(),
        status: z.nativeEnum(ProgressStatus),
        type: z.nativeEnum(ProjectType),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.project.update({
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
      return ctx.prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          members: {
            include: {
              member: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return result?.members ?? [];
    }),

  getBriefWithTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        members: {
          some: {
            memberId: ctx.session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        tasks: {
          select: {
            id: true,
            name: true,
          },
          where: {
            assignedToId: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
