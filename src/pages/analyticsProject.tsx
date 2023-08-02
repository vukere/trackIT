import { type NextPage } from "next";
import Head from "next/head";
import { Navbar } from "~/components/Navbar";
import styles from "./analyticsProject.module.css";
import { type Project, ProjectCard } from "~/components/AnalyticsProjectCard";
import { CurrentDayCard } from "~/components/CurrentDayCard";

function getAnalyticsProjects() {
  return [
    {
      id: 1,
      title: "Mobile application development",
      status: "in progress",
      until: new Date(),
      type: "company project",
      time: 323,
    },
    {
      id: 2,
      title: "Web application development",
      status: "not started",
      until: new Date(),
      type: "personal project",
      time: 323,
    },
    {
      id: 3,
      title: "PC application development",
      status: "done",
      until: new Date(),
      type: "company project",
      time: 323,
    },
    {
      id: 4,
      title: "Design for mobile application",
      status: "done",
      until: new Date(),
      type: "personal project",
      time: 323,
    },
  ] satisfies Project[];
}

const Projects: NextPage = () => {
  const projects = getAnalyticsProjects();

  return (
    <>
      <Head>
        <title>Projects analytics</title>
        <meta name="description" content="Projects analytics" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.projectPageWrapper}>
        <Navbar />

        <div className={styles.projectsWrapper}>
          <div className={styles.projectsHeader}>
            <div className={styles.projectsText}>Projects analytics</div>
            <div className={styles.tasksHeaderBlocksWrapper}>
              <div className={styles.workTimeCard}>Your work time: 540:20</div>
              <CurrentDayCard />
            </div>
          </div>

          <div className={styles.sortBarWrapper}>
            <div className={styles.sortWrapper}>
              <label className={styles.sort}>
                sort by:{" "}
                <select name="sort">
                  <option value="any">any</option>
                  <option value="name">name</option>
                  <option value="date">date</option>
                </select>
              </label>
              <label className={styles.sort}>
                status:{" "}
                <select name="status">
                  <option value="any">any</option>
                  <option value="done">done</option>
                  <option value="in progress">in progress</option>
                  <option value="not started">not started</option>
                </select>
              </label>
              <label className={styles.sort}>
                type:{" "}
                <select name="type">
                  <option value="any">any</option>
                  <option value="cproject">company project</option>
                  <option value="pproject">personal project</option>
                </select>
              </label>
            </div>
          </div>

          <div className={styles.projectCardsWrapper}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
