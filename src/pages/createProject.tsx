import { type NextPage } from "next";
import { Navbar } from "~/components/Navbar";
import styles from "./createProject.module.css";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/Button";
import { ProgressStatus, ProjectType } from "@prisma/client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { CurrentDayCard } from "~/components/CurrentDayCard";
import { useRouter } from "next/router";

type CreateProjectInput = {
  name: string;
  description: string;
  notes: string;
  deadline: Date;
  status: ProgressStatus;
  type: ProjectType;
};

function CreateProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectInput>();
  const createProject = api.project.create.useMutation();
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateProjectInput> = (data) =>
    createProject.mutate(data, { onSuccess: () => router.back() });

  return (
    <form
      className={styles.createProjectFormWrapper}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.createProjectDataWrapper}>
        <div className={styles.createProjectDataName}>Project name</div>
        <input type="text" className={styles.createProjectData} {...register("name", { required: true })} />
        {errors.name && <span>This field is required</span>}
        <div className={styles.createProjectDataName}>Project description</div>
        <textarea className={styles.createProjectData} {...register("description", { required: true })} />
        {errors.description && <span>This field is required</span>}
        <div className={styles.createProjectDataName}>Add notes</div>
        <textarea className={styles.createProjectData} {...register("notes", { required: true })} />
        {errors.notes && <span>This field is required</span>}

        <div className={styles.itemsWrapper}>
          <div className={styles.additionalGapInItems}>
            <div className={styles.createProjectDataName}>Deadline date</div>
            <input
              type="date"
              className={styles.createProjectData2}
              {...register("deadline", { valueAsDate: true, required: true })}
            />
            {errors.deadline && <span>This field is required</span>}
          </div>
          <label className={styles.additionalGapInItems}>
            <div className={styles.createProjectDataName}>Status</div>
            <select className={styles.createProjectData2} {...register("status")}>
              <option value={ProgressStatus.NOT_STARTED}>not started</option>
              <option value={ProgressStatus.DONE}>done</option>
              <option value={ProgressStatus.IN_PROGRESS}>in progress</option>
            </select>
          </label>
        </div>

        <label className={styles.additionalGapInItems}>
          <div className={styles.createProjectDataName}>Type</div>
          <select className={styles.createProjectData2} {...register("type")}>
            <option value={ProjectType.COMPANY}>company project</option>
            <option value={ProjectType.PERSONAL}>personal project</option>
          </select>
        </label>
      </div>

      <div className={styles.createButtWrapper}>
        <Button text="Cancel" variant="secondary" href={`/projects`} />
        <Button text="Submit" variant="primary" />
      </div>
    </form>
  );
}

const CreateProject: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create project</title>
        <meta name="description" content="Create project" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.createProjectPageWrapper}>
        <Navbar />

        <div className={styles.createProjectWrapper}>
          <div className={styles.createProjectHeader}>
            <div className={styles.createProjectTextHeaderWrapper}>
              <div className={styles.createProjectText}>Create project</div>
              <Link className={styles.createProjectBackText} href={`/projects`}>
                &#8592; back to projects
              </Link>
            </div>
            <CurrentDayCard />
          </div>
          <CreateProjectForm />
        </div>
      </div>
    </>
  );
};

export default CreateProject;
