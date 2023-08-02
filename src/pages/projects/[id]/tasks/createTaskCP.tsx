import { type NextPage } from 'next';
import { Navbar } from '~/components/Navbar';
import styles from './createTaskCP.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { ProgressStatus, Team } from '@prisma/client';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { CurrentDayCard } from '~/components/CurrentDayCard';

type CreateTaskInput = {
  name: string;
  description: string;
  notes: string;
  team: Team;
  assignedToId: string;
  deadline: Date;
  status: ProgressStatus;
};

function CreateTaskForm() {
  const { register, handleSubmit } = useForm<CreateTaskInput>();
  const createTask = api.task.create.useMutation();
  const router = useRouter();
  const projectId = router.query.id as string;
  const onSubmit: SubmitHandler<CreateTaskInput> = data =>
    createTask.mutate(
      { ...data, projectId: projectId },
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
        <input type='text' className={styles.createTaskData} {...register('name')} />
        <div className={styles.createTaskDataName}>Task description</div>
        <textarea className={styles.createTaskData} {...register('description')} />
        <div className={styles.createTaskDataName}>Add notes</div>
        <textarea className={styles.createTaskData} {...register('notes')} />

        <div className={styles.itemsWrapper}>
          <label className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Team</div>
            <select className={styles.createTaskData2} {...register('team')}>
              <option value={Team.ALL}>all</option>
              <option value={Team.DESIGN}>design</option>
              <option value={Team.BACKEND}>back-end</option>
              <option value={Team.FRONTEND}>front-end</option>
              <option value={Team.MANAGEMENT}>product management</option>
            </select>
          </label>

          <label className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Assign task to</div>
            <select className={styles.createTaskData2} name='type'>
              <option value='worker1'>Alex Anderson</option>
              <option value='worker2'>Kellie Sellers</option>
              <option value='worker3'>Annie Alston</option>
              <option value='worker4'>Javier Moss</option>
              <option value='worker5'>Sam Simmons</option>
              <option value='worker6'>Renae Chavez</option>
            </select>
          </label>
        </div>

        <div className={styles.itemsWrapper}>
          <div className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Deadline date</div>
            <input type='date' className={styles.createTaskData2} {...register('deadline', { valueAsDate: true })} />
          </div>
          <label className={styles.additionalGapInItems}>
            <div className={styles.createTaskDataName}>Status</div>
            <select className={styles.createTaskData2} {...register('status')}>
              <option value={ProgressStatus.NOT_STARTED}>not started</option>
              <option value={ProgressStatus.DONE}>done</option>
              <option value={ProgressStatus.IN_PROGRESS}>in progress</option>
            </select>
          </label>
        </div>
      </div>
      <div className={styles.createButtWrapper}>
        <Button text='Cancel' variant='secondary' href={`/projects/${projectId}/tasks`} />
        <Button text='Submit' variant='primary' />
      </div>
    </form>
  );
}

const CreateTask: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create task</title>
        <meta name='description' content='Create task' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.createTaskPageWrapper}>
        <Navbar />

        <div className={styles.createTaskWrapper}>
          <div className={styles.createTaskHeader}>
            <div className={styles.createTaskTextHeaderWrapper}>
              <div className={styles.createTaskText}>Create task</div>
              <Link className={styles.createTaskBackText} href=''>
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

export default CreateTask;
