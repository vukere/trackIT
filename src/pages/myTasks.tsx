import type { NextPage } from 'next';
import Head from 'next/head';
import { Navbar } from '~/components/Navbar';
import styles from './myTasks.module.css';
import { Button } from '~/components/Button';
import { TaskCard } from '~/components/TaskCard';
import { api } from '~/utils/api';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CurrentDayCard } from '~/components/CurrentDayCard';

function parseTimeAsToday(time: string) {
  const [hourString, minuteString] = time.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  if (isNaN(hour) || isNaN(minute)) {
    throw new Error(`Parsing error, time string="${time}"`);
  }
  const now = dayjs();
  return now.set('hour', hour).set('minute', minute).toDate();
}

type AddRecordOverlayProps = {
  onClose: () => void;
  taskId: string;
  projectId: string;
};

function getTimeSpent(record: { from: Date; to: Date }) {
  const hourDiff = dayjs(record.to).diff(record.from, 'hour');
  const minuteDiff = dayjs(record.to).diff(record.from, 'minute');
  const clockMinuteDiff = minuteDiff - hourDiff * 60;
  return `${hourDiff.toString().padStart(2, '0')}:${clockMinuteDiff.toString().padStart(2, '0')}`;
}

function AddRecordOverlay(props: AddRecordOverlayProps) {
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  // const [error, setError] = useState(false);
  const apiContext = api.useContext();
  const createRecord = api.timeRecord.create.useMutation();

  function submit() {
    if (!to || !from) {
      return;
    }
    const toTimestamp = parseTimeAsToday(to);
    const fromTimestamp = parseTimeAsToday(from);
    if (toTimestamp <= fromTimestamp) {
      // setError(true);
      return;
    }
    createRecord.mutate(
      {
        to: toTimestamp,
        from: fromTimestamp,
        taskId: props.taskId,
        projectId: props.projectId,
      },
      {
        onSuccess: () => {
          void apiContext.timeRecord.invalidate();
          props.onClose();
        },
      }
    );
  }

  return (
    <div className={styles.overlayWrapper}>
      <div className={styles.overlay}>
        <div className={styles.timePickerHeader}>Select time</div>
        <div className={styles.timePickerWrapper}>
          <div className={styles.itemWrapper}>
            <div className={styles.textStyles}>From:</div>
            <input className={styles.testTime} type='time' onChange={e => setFrom(e.target.value)} />
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.textStyles}>To:</div>
            <input className={styles.testTime} type='time' onChange={e => setTo(e.target.value)} />
          </div>
        </div>
        <div className={styles.btnWrapper}>
          {/* <Button text="Back" variant="secondary" href="/myTasks" /> */}
          <Button text='Submit' variant='primary' onClick={submit} />
        </div>
      </div>
    </div>
  );
}

function TimeRecordList() {
  const { data: timeRecords } = api.timeRecord.getAll.useQuery(undefined, { initialData: [] });

  return (
    <div className={styles.trackingWrapper}>
      <div className={styles.header}>
        <div className={styles.headerOptions}>task name</div>
        <div className={styles.headerOptions}>project</div>
        <div className={styles.headerOptions}>work time</div>
      </div>
      {timeRecords.map(record => (
        <div className={styles.trackBlockWrapper} key={record.id}>
          <div className={styles.options}>{record.task.name}</div>
          <div className={styles.options}>{record.project.name}</div>
          <div className={styles.optionsTime}>{getTimeSpent(record)}</div>
        </div>
      ))}
    </div>
  );
}

const Tasks: NextPage = () => {
  const { data: tasks } = api.task.getMy.useQuery(undefined, {
    initialData: [],
  });
  const { data: projects } = api.project.getBriefWithTasks.useQuery(undefined, {
    initialData: [],
  });
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [taskOptions, setTaskOptions] = useState<{ id: string; name: string }[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [timeRecordOverlayOpen, setTimeRecordOverlayOpen] = useState(false);

  useEffect(() => {
    const project = projects.find(project => project.id === selectedProjectId);
    if (project === undefined) {
      setTaskOptions([]);
      return;
    }
    setTaskOptions(
      project.tasks as {
        id: string;
        name: string;
      }[]
    );
  }, [selectedProjectId, projects]);

  function openAddTimeOverlay() {
    if (selectedProjectId !== '' && selectedTaskId !== '') {
      setTimeRecordOverlayOpen(true);
    }
  }

  const { data: timeSpentToday } = api.timeRecord.getTimeToday.useQuery();

  return (
    <>
      <Head>
        <title>My tasks</title>
        <meta name='description' content='My tasks page' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.tasksPageWrapper}>
        <Navbar />

        <div className={styles.tasksWrapper}>
          <div className={styles.tasksHeader}>
            <div className={styles.tasksText}>My tasks</div>
            <div className={styles.tasksHeaderBlocksWrapper}>
              <div className={styles.workTimeCard}>Your work time: {timeSpentToday}</div>
              <CurrentDayCard />
            </div>
          </div>

          <div className={styles.sortBarWrapper}>
            <div className={styles.sortWrapper}>
              <label className={styles.sort}>
                <select name='projects' onChange={e => setSelectedProjectId(e.target.value)}>
                  <option
                    // className={styles.sectsStyles}
                    // disabled={true}
                    value=''
                  >
                    select project
                  </option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.sort}>
                <select name='tasks' onChange={e => setSelectedTaskId(e.target.value)}>
                  <option
                    // className={styles.sectsStyles}
                    //   disabled={true}
                    value=''
                  >
                    select task
                  </option>
                  {taskOptions.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.trackButtWrapper}>
              {/* <div className={styles.trackButt}>
                <Button text="Start" variant="primary2" />
              </div> */}
              <div className={styles.trackButt}>
                <Button text='Add time' variant='delete' onClick={openAddTimeOverlay} />
              </div>
            </div>
          </div>

          <div className={styles.blocksWrapper}>
            <div className={styles.myTasksHeaderBlockWrapper}>
              <div className={styles.tasksText}>Tasks:</div>
              <div className={styles.myTasksSortBlockWrapper}>
                <div className={styles.sortWrapper}>
                  <label className={styles.sort}>
                    sort by:{' '}
                    <select name='sort'>
                      <option value='any'>any</option>
                      <option value='name'>name</option>
                      <option value='date'>date</option>
                    </select>
                  </label>
                  <label className={styles.sort}>
                    status:{' '}
                    <select name='status'>
                      <option value='any'>any</option>
                      <option value='done'>done</option>
                      <option value='in progress'>in progress</option>
                      <option value='not started'>not started</option>
                    </select>
                  </label>
                  <label className={styles.sort}>
                    projects:{' '}
                    <select name='projects'>
                      <option value='any'>any</option>
                      <option value='project1'>Mobile application development</option>
                      <option value='project2'>Design for web-application </option>
                      <option value='project3'>Design for mobile application</option>
                      <option value='project4'>Web-application development</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.taskCardsWrapper}>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} projectType={task.project.type} />
              ))}
            </div>
          </div>

          <div className={styles.blocksWrapper}>
            <div className={styles.myTasksHeaderBlockWrapper}>
              <div className={styles.tasksText}>Time tracking history:</div>
              <div className={styles.myTasksSortBlockWrapper}>
                <div className={styles.sortWrapper}>
                  <label className={styles.sort}>
                    sort by:{' '}
                    <select name='sort'>
                      <option value='any'>any</option>
                      <option value='name'>name</option>
                      <option value='date'>date</option>
                    </select>
                  </label>
                  <label className={styles.sort}>
                    status:{' '}
                    <select name='status'>
                      <option value='any'>any</option>
                      <option value='done'>done</option>
                      <option value='in progress'>in progress</option>
                      <option value='not started'>not started</option>
                    </select>
                  </label>
                  <label className={styles.sort}>
                    projects:{' '}
                    <select name='projects'>
                      <option value='any'>any</option>
                      <option value='project1'>Mobile application development</option>
                      <option value='project2'>Design for web-application </option>
                      <option value='project3'>Design for mobile application</option>
                      <option value='project4'>Web-application development</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <TimeRecordList />
          </div>
        </div>
      </div>
      {timeRecordOverlayOpen && (
        <AddRecordOverlay
          projectId={selectedProjectId}
          taskId={selectedTaskId}
          onClose={() => setTimeRecordOverlayOpen(false)}
        />
      )}
    </>
  );
};

export default Tasks;
