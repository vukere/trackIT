/* eslint-disable @next/next/no-img-element */
import styles from "./analyticsProjectCard.module.css";

export type Project = {
  id: number;
  title: string;
  status: "not started" | "in progress" | "done";
  until: Date;
  type: "company project" | "personal project";
  time: number;
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard(props: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topPart}>
        <div>{props.project.title}</div>
        {props.project.status === "done" ? (
          <img className={styles.statusCircles} src="/circle-green.png" alt="done" />
        ) : props.project.status === "in progress" ? (
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
                props.project.status === "done"
                  ? styles.textGreen
                  : props.project.status === "in progress"
                  ? styles.textYellow
                  : styles.textBlue
              }
            >
              {props.project.status}
            </span>
          </div>
          <div>until: {props.project.until.toDateString()}</div>

          <div className={styles.cardInfoTypeWrapper}>
            type:
            <div
              className={
                props.project.type === "company project" ? styles.cardInfoTypeCompany : styles.cardInfoTypePersonal
              }
            >
              {props.project.type}
            </div>
          </div>
          <div>total time: {props.project.time}</div>
        </div>
      </div>
    </div>
  );
}
