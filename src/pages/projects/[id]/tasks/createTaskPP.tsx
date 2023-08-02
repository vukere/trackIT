import { type NextPage } from "next";
import { Navbar } from "~/components/Navbar";
import styles from "./createTaskPP.module.css";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/Button";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { Team, ProgressStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { CurrentDayCard } from "~/components/CurrentDayCard";

type CreateTaskInput = {
  name: string;
  description: string;
  notes: string;
  deadline: Date;
  status: ProgressStatus;
};

function CreateTaskForm() {
  const { register, handleSubmit } = useForm<CreateTaskInput>();
  const createTask = api.task.create.useMutation();
  const router = useRouter();
  const projectId = router.query.id as string;
  const onSubmit: SubmitHandler<CreateTaskInput> = (data) =>
    createTask.mutate(
      { ...data, projectId: projectId, team: Team.NONE },
      {
        onSuccess: () => void router.back(),
      }
    );

  return (
    <form
      className={styles.createTaskFormWrapper}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.createTaskDataWrapper}>
        <div className={styles.createTaskDataName}>Task name</div>
        <input type="text" className={styles.createTaskData} {...register("name")} />
        <div className={styles.createTaskDataName}>Task description</div>
        <textarea className={styles.createTaskData} {...register("description")} />
        <div className={styles.createTaskDataName}>Add notes</div>
        <textarea className={styles.createTaskData} {...register("notes")} />

        <div className={styles.itemsWrapper}>
          <div className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Deadline date</div>
            <input type="date" className={styles.createTaskData2} {...register("deadline", { valueAsDate: true })} />
          </div>
          <label className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Status</div>
            <select className={styles.createTaskData2} {...register("status")}>
              <option value={ProgressStatus.NOT_STARTED}>not started</option>
              <option value={ProgressStatus.DONE}>done</option>
              <option value={ProgressStatus.IN_PROGRESS}>in progress</option>
            </select>
          </label>
        </div>
      </div>
      <div className={styles.createButtWrapper}>
        <Button text="Cancel" variant="secondary" href={`/projects/${projectId}/tasks`} />
        <Button text="Submit" variant="primary" />
      </div>
    </form>
  );
}

const createTask: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create task</title>
        <meta name="description" content="Create task" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.createTaskPageWrapper}>
        <Navbar />

        <div className={styles.createTaskWrapper}>
          <div className={styles.createTaskHeader}>
            <div className={styles.createTaskTextHeaderWrapper}>
              <div className={styles.createTaskText}>Create task</div>
              <Link className={styles.createTaskBackText} href="">
                &#8592; back to tasks
              </Link>
            </div>
            <CurrentDayCard />
          </div>
          <CreateTaskForm />
        </div>
      </div>
    </>
  );
};

export default createTask;
