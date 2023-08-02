import { createTRPCRouter } from '~/server/api/trpc';
import { profileRouter } from './routers/profile';
import { projectRouter } from './routers/project';
import { taskRouter } from './routers/task';
import { timeRecordRouter } from './routers/timeRecord';
import { noteRouter } from './routers/note';
import { inviteLinkRouter } from './routers/inviteLink';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  project: projectRouter,
  task: taskRouter,
  timeRecord: timeRecordRouter,
  note: noteRouter,
  inviteLink: inviteLinkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
