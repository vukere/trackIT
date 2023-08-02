import { Team } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    if (profile !== null) {
      return profile;
    }

    const newProfile = await ctx.prisma.profile.create({
      data: {
        name: ctx.session.user.name ?? "",
        surname: "",
        email: ctx.session.user.email ?? "",
        team: Team.NONE,
        ownerId: ctx.session.user.id,
      },
    });
    return newProfile;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        surname: z.string(),
        email: z.string().email(),
        team: z.nativeEnum(Team),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.profile.update({
        where: {
          ownerId: ctx.session.user.id,
        },
        data: input,
      });
    }),
});
