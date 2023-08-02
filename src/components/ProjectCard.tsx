/* eslint-disable @next/next/no-img-element */
import styles from "./projectCard.module.css";
import Link from "next/link";
import type { ProgressStatus, ProjectType } from "@prisma/client";
import { convertProgressStatus, convertProjectType, formatDate } from "~/utils/formatting";

export type Project = {
  id: string;
  name: string;
  status: ProgressStatus;
  deadline: Date;
  type: ProjectType;
};

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

export function ProjectCard(props: ProjectCardProps) {
  return (
    <button className={styles.card} onClick={props.onClick}>
      {/* <div className={styles.card}> */}
      <div className={styles.topPart}>
        <div>{props.project.name}</div>
        {props.project.status === "DONE" ? (
          <img className={styles.statusCircles} src="/circle-green.png" alt="done" />
        ) : props.project.status === "IN_PROGRESS" ? (
          <img className={styles.statusCircles} src="/circle-yellow.png" alt="in progress" />
        ) : (
          <img className={styles.statusCircles} src="/circle-blue.png" alt="not started" />
        )}
      </div>
      <div className={styles.cardInfoWrapper}>
        <div className={styles.cardInfo}>
          <div className={styles.cardInfoStatus}>
            status:{" "}
            <span
              className={
                props.project.status === "DONE"
                  ? styles.textGreen
                  : props.project.status === "IN_PROGRESS"
                  ? styles.textYellow
                  : styles.textBlue
              }
            >
              {convertProgressStatus(props.project.status)}
            </span>
          </div>
          <div>until: {formatDate(props.project.deadline)}</div>

          <div className={styles.cardInfoTypeWrapper}>
            type:
            <div
              className={props.project.type === "COMPANY" ? styles.cardInfoTypeCompany : styles.cardInfoTypePersonal}
            >
              {convertProjectType(props.project.type)}
            </div>
          </div>
        </div>
        <Link href={`/projects/${props.project.id}/edit`} onClick={(e) => e.stopPropagation()}>
          <img className={styles.cardEditIcon} src="/edit.png" alt="edit" />
        </Link>
      </div>
    </button>
  );
}
