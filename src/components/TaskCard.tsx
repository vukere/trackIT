/* eslint-disable @next/next/no-img-element */
import { type ProjectType, type Task } from '@prisma/client';
import styles from './taskCard.module.css';
import Link from 'next/link';
import { convertProgressStatus, convertTeam, formatDate } from '~/utils/formatting';

type TaskCardProps = {
  task: Task;
  projectType: ProjectType;
  onClick?: () => void;
};

export function TaskCard(props: TaskCardProps) {
  return (
    <button className={styles.card} onClick={props.onClick}>
      <div className={styles.topPart}>
        <div>{props.task.name}</div>
        {props.task.status === 'DONE' ? (
          <img className={styles.statusCircles} src='/circle-green.png' alt='done' />
        ) : props.task.status === 'IN_PROGRESS' ? (
          <img className={styles.statusCircles} src='/circle-yellow.png' alt='in progress' />
        ) : (
          <img className={styles.statusCircles} src='/circle-blue.png' alt='not started' />
        )}
      </div>
      <div className={styles.cardInfoWrapper}>
        <div className={styles.cardInfo}>
          <div className={styles.cardInfoStatus}>
            status:{' '}
            <span
              className={
                props.task.status === 'DONE'
                  ? styles.textGreen
                  : props.task.status === 'IN_PROGRESS'
                  ? styles.textYellow
                  : styles.textBlue
              }
            >
              {convertProgressStatus(props.task.status)}
            </span>
          </div>
          <div>until: {formatDate(props.task.deadline)}</div>

          <div className={styles.cardInfoTypeWrapper}>
            team:
            <div
              className={
                props.task.team === 'DESIGN'
                  ? styles.cardInfoTeamDesign
                  : props.task.team === 'BACKEND'
                  ? styles.cardInfoTeamBack
                  : props.task.team === 'MANAGEMENT'
                  ? styles.cardInfoTeamPRM
                  : props.task.team === 'FRONTEND'
                  ? styles.cardInfoTeamFront
                  : styles.cardInfoTeamAll
              }
            >
              {convertTeam(props.task.team)}
            </div>
          </div>
        </div>
        <Link
          href={`/projects/${props.task.projectId}/tasks/${props.task.id}/${
            props.projectType === 'COMPANY' ? 'editTaskCP' : 'editTaskPP'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <img className={styles.cardEditIcon} src='/edit.png' alt='edit' />
        </Link>
      </div>
    </button>
  );
}
