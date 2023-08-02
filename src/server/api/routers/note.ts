import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const note = await ctx.prisma.note.findUnique({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
    if (note !== null) {
      return note;
    }

    return ctx.prisma.note.create({
      data: {
        text: "",
        ownerId: ctx.session.user.id,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.note.update({
        where: {
          ownerId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
