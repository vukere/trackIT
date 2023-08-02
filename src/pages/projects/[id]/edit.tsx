import { type NextPage } from 'next';
import { Navbar } from '~/components/Navbar';
import styles from './editProject.module.css';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ProgressStatus, ProjectType } from '@prisma/client';
import { CurrentDayCard } from '~/components/CurrentDayCard';

type EditProjectInput = {
  name: string;
  description: string;
  notes: string;
  deadline: Date;
  status: ProgressStatus;
  type: ProjectType;
};

const EditProject: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const { data: project } = api.project.get.useQuery({ id: projectId });
  const { register, handleSubmit } = useForm<EditProjectInput>();
  const updateProject = api.project.update.useMutation();
  const deleteProjectMut = api.project.delete.useMutation();

  if (!project) {
    return null;
  }

  const onSubmit: SubmitHandler<EditProjectInput> = data => {
    updateProject.mutate({ ...data, id: project.id }, { onSuccess: () => void router.back() });
  };

  function deleteProject(id: string) {
    deleteProjectMut.mutate({ id: id }, { onSuccess: () => void router.back() });
  }

  return (
    <>
      <Head>
        <title>Edit project</title>
        <meta name='description' content='Edit project' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.createProjectPageWrapper}>
        <Navbar />

        <div className={styles.createProjectWrapper}>
          <div className={styles.createProjectHeader}>
            <div className={styles.createProjectTextHeaderWrapper}>
              <div className={styles.createProjectText}>Edit project</div>
              <Link className={styles.createProjectBackText} href='/projects'>
                &#8592; back to projects
              </Link>
            </div>
            <CurrentDayCard />
          </div>

          <form
            className={styles.createProjectFormWrapper}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.createProjectDataWrapper}>
              <div className={styles.createProjectDataName}>Project name</div>
              <input
                type='text'
                defaultValue={project.name}
                className={styles.createProjectData}
                {...register('name')}
              />
              <div className={styles.createProjectDataName}>Project description</div>
              <textarea
                defaultValue={project.description}
                className={styles.createProjectData}
                {...register('description')}
              />
              <div className={styles.createProjectDataName}>Add notes</div>
              <textarea defaultValue={project.notes} className={styles.createProjectData} {...register('notes')} />

              <div className={styles.itemsWrapper}>
                <div className={styles.additionalGapInItems}>
                  <div className={styles.createProjectDataName}>Deadline date</div>
                  <input
                    type='date'
                    defaultValue={project.deadline.toISOString().split('T')[0]}
                    className={styles.createProjectData2}
                    {...register('deadline', { valueAsDate: true })}
                  />
                </div>
                <label className={styles.additionalGapInItems}>
                  <div className={styles.createProjectDataName}>Status</div>
                  <select defaultValue={project.status} className={styles.createProjectData2} {...register('status')}>
                    <option value={ProgressStatus.NOT_STARTED}>not started</option>
                    <option value={ProgressStatus.DONE}>done</option>
                    <option value={ProgressStatus.IN_PROGRESS}>in progress</option>
                  </select>
                </label>
              </div>

              <label className={styles.additionalGapInItems}>
                <div className={styles.createProjectDataName}>Type</div>
                <select defaultValue={project.type} className={styles.createProjectData2} {...register('type')}>
                  <option value={ProjectType.COMPANY}>company project</option>
                  <option value={ProjectType.PERSONAL}>personal project</option>
                </select>
              </label>
            </div>
            <div className={styles.createButtWrapper}>
              <Button text='Cancel' variant='secondary' href='/projects' />
              <Button text='Delete' variant='delete' onClick={() => deleteProject(project.id)} />
              <Button text='Submit' variant='primary' />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProject;
