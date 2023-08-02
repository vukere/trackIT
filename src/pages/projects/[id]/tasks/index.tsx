/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import { Navbar } from '~/components/Navbar';
import styles from './tasks.module.css';
import { Button } from '~/components/Button';
import { TaskCard } from '~/components/TaskCard';
import Link from 'next/link';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { CurrentDayCard } from '~/components/CurrentDayCard';
import commonStyles from '~/styles/common.module.css';
import { ProgressStatus, Team, type ProjectType, type Task } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { convertProgressStatus, convertTeam, formatDate } from '~/utils/formatting';

type TaskOverviewProps = {
  task: Task;
  projectType: ProjectType;
  onClose: () => void;
};

function TaskOverview(props: TaskOverviewProps) {
  return (
    <div className={styles.overviewWrapper}>
      <div className={styles.overview}>
        <div className={styles.overviewHeaderWrapper}>
          <div className={styles.overviewHeader}>
            Task details{' '}
            <Link
              href={`/projects/${props.task.projectId}/tasks/${props.task.id}/${
                props.projectType === 'COMPANY' ? 'editTaskCP' : 'editTaskPP'
              }`}
            >
              <img className={styles.cardEditIcon} src='/edit.png' alt='edit' />
            </Link>
          </div>
          <button className={commonStyles.reset} onClick={props.onClose}>
            <img className={styles.cardCancelIcon} src='/cancel.svg' alt='cancel' />
          </button>
        </div>
        <div className={styles.overviewBodyWrapper}>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Task name</div>
            <div className={styles.mainItem}>{props.task.name}</div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Task description</div>
            <div className={styles.textItem}>{props.task.description}</div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Notes</div>
            <div className={styles.textItem}>{props.task.notes}</div>
          </div>
          <div className={styles.multiItemsWrapper}>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>Deadline date</div>
              <div className={styles.text2Item}>{formatDate(props.task.deadline)}</div>
            </div>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>Status</div>
              <div className={styles.text2Item}>{convertProgressStatus(props.task.status)}</div>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Team</div>
            <div className={styles.tex2Item}>{convertTeam(props.task.team)}</div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button text='Back' variant='secondary' onClick={props.onClose} />
        </div>
      </div>
    </div>
  );
}

const Tasks: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const { data: project } = api.project.get.useQuery({ id: projectId });
  const { data: tasks } = api.task.getAll.useQuery({ projectId: projectId }, { initialData: [] });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProgressStatus>();
  const [filterTeam, setFilterTeam] = useState<Team>(Team.ALL);
  const [sortBy, setSortBy] = useState<string>('NONE');
  const filteredTasks = useMemo(() => {
    const filteredTasks = tasks
      .filter(task => (filterStatus === undefined ? true : task.status === filterStatus))
      .filter(task => (filterTeam === Team.ALL ? true : task.team === filterTeam));

    return filteredTasks;
  }, [tasks, filterStatus, filterTeam]);

  const [sortedTasks, setSortedTasks] = useState(filteredTasks);

  useEffect(() => {
    if (sortBy === 'DATE') {
      setSortedTasks([...filteredTasks].sort((a, b) => (a.deadline.getDate() <= b.deadline.getDate() ? -1 : 1)));
    } else if (sortBy === 'NAME') {
      setSortedTasks([...filteredTasks].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setSortedTasks(filteredTasks);
    }
  }, [sortBy, filteredTasks]);
  const createInviteLinkMut = api.inviteLink.create.useMutation();

  function createInviteLink() {
    console.log(projectId);

    createInviteLinkMut.mutate(
      { projectId: projectId },
      {
        onSuccess: data => console.log(`${window.location.origin}/invite/${data.id}`),
      }
    );
  }

  if (!tasks || !project) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Tasks</title>
        <meta name='description' content='Tasks' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.tasksPageWrapper}>
        <Navbar />

        <div className={styles.tasksWrapper}>
          <div className={styles.tasksHeader}>
            <div className={styles.tasksTextHeaderWrapper}>
              <div className={styles.tasksText}>{project.name}</div>
              <Link className={styles.tasksBackText} href='/projects'>
                &#8592; back to projects
              </Link>
            </div>
            <div className={styles.tasksHeaderBlocksWrapper}>
              <button className={styles.inviteButt} onClick={createInviteLink}>
                Invite to project <img src='/plus-black.svg' alt='add' />
              </button>
              <CurrentDayCard />
            </div>
          </div>

          <div className={styles.sortBarWrapper}>
            <div className={styles.sortWrapper}>
              <label className={styles.sort}>
                sort by:{' '}
                <select onChange={e => setSortBy(e.target.value)}>
                  <option value='NONE'>none</option>
                  <option value='NAME'>name</option>
                  <option value='DATE'>date</option>
                </select>
              </label>
              <label className={styles.sort}>
                status:{' '}
                <select
                  onChange={e =>
                    setFilterStatus(
                      e.target.value === undefined
                        ? undefined
                        : ProgressStatus[e.target.value as keyof typeof ProgressStatus]
                    )
                  }
                >
                  <option value={undefined}>any</option>
                  <option value={ProgressStatus.DONE}>done</option>
                  <option value={ProgressStatus.IN_PROGRESS}>in progress</option>
                  <option value={ProgressStatus.NOT_STARTED}>not started</option>
                </select>
              </label>
              <label className={styles.sort}>
                team:{' '}
                <select onChange={e => setFilterTeam(Team[e.target.value as keyof typeof Team])}>
                  <option value={Team.ALL}>all</option>
                  <option value={Team.DESIGN}>design</option>
                  <option value={Team.BACKEND}>back-end</option>
                  <option value={Team.FRONTEND}>front-end</option>
                  <option value={Team.MANAGEMENT}>product management</option>
                  <option value={Team.NONE}>none</option>
                </select>
              </label>
            </div>
            <div className={styles.createButt}>
              <Button
                text='Create task'
                variant='primary2'
                icon={<img src='/plus.svg' alt='add' />}
                href={`/projects/${projectId}/tasks/${project.type === 'COMPANY' ? 'createTaskCP' : 'createTaskPP'}`}
              />
            </div>
          </div>

          <div className={styles.taskCardsWrapper}>
            {sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} projectType={project.type} onClick={() => setSelectedTask(task)} />
            ))}
            <Link
              className={styles.createCardWrapper}
              href={`/projects/${projectId}/tasks/${project.type === 'COMPANY' ? 'createTaskCP' : 'createTaskPP'}`}
            >
              <div className={styles.createCard}>Create task</div>
              <img src='/create_plus.png' alt='create' />
            </Link>
          </div>
        </div>
        {selectedTask && (
          <TaskOverview task={selectedTask} projectType={project.type} onClose={() => setSelectedTask(null)} />
        )}
      </div>
    </>
  );
};

export default Tasks;
