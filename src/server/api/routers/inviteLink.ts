import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const inviteLinkRouter = createTRPCRouter({
  join: protectedProcedure
    .input(
      z.object({
        inviteId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const inviteLink = await ctx.prisma.inviteLink.findUnique({
        where: {
          id: input.inviteId,
        },
      });
      if (inviteLink === null) {
        return;
      }
      await ctx.prisma.projectMembers.create({
        data: {
          projectId: inviteLink.projectId,
          memberId: ctx.session.user.id,
        },
      });
      return ctx.prisma.inviteLink.delete({
        where: {
          id: input.inviteId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.inviteLink.create({
        data: {
          projectId: input.projectId,
        },
      });
    }),
});
