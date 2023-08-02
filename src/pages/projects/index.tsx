/* eslint-disable @next/next/no-img-element */
import { type NextPage } from 'next';
import Head from 'next/head';
import { Navbar } from '~/components/Navbar';
import styles from './projects.module.css';
import commonStyles from '~/styles/common.module.css';
import { Button } from '~/components/Button';
import { ProjectCard } from '~/components/ProjectCard';
import Link from 'next/link';
import { api } from '~/utils/api';
import { ProgressStatus, type Project, ProjectType } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { CurrentDayCard } from '~/components/CurrentDayCard';
import { convertProgressStatus, convertProjectType, formatDate } from '~/utils/formatting';

type ProjectOverviewProps = {
  project: Project;
  onClose: () => void;
};

function ProjectOverview(props: ProjectOverviewProps) {
  return (
    <div className={styles.overviewWrapper}>
      <div className={styles.overview}>
        <div className={styles.overviewHeaderWrapper}>
          <div className={styles.overviewHeader}>
            Project details{' '}
            <Link href={`/projects/${props.project.id}/edit`}>
              <img className={styles.cardEditIcon} src='/edit.png' alt='edit' />
            </Link>
          </div>
          <button className={commonStyles.reset} onClick={props.onClose}>
            <img className={styles.cardCancelIcon} src='/cancel.svg' alt='cancel' />
          </button>
        </div>
        <div className={styles.overviewBodyWrapper}>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Project name</div>
            <div className={styles.mainItem}>{props.project.name}</div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Project description</div>
            <div className={styles.textItem}>{props.project.description}</div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Notes</div>
            <div className={styles.textItem}>{props.project.notes}</div>
          </div>
          <div className={styles.multiItemsWrapper}>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>Deadline date</div>
              <div className={styles.text2Item}>{formatDate(props.project.deadline)}</div>
            </div>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>Status</div>
              <div className={styles.text2Item}>{convertProgressStatus(props.project.status)}</div>
            </div>
          </div>
          <div className={styles.itemWrapper}>
            <div className={styles.item}>Type</div>
            <div className={styles.tex2Item}>{convertProjectType(props.project.type)}</div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <div onClick={props.onClose}>
            <Button text='Back' variant='secondary' />
          </div>
          <Button href={`/projects/${props.project.id}/tasks`} text='Tasks' variant='primary' />
        </div>
      </div>
    </div>
  );
}

const Projects: NextPage = () => {
  const [filterStatus, setFilterStatus] = useState<ProgressStatus>();
  const [sortBy, setSortBy] = useState<string>('NONE');
  const [filterType, setFilterType] = useState<ProjectType>();
  const { data: projects } = api.project.getAll.useQuery(undefined, {
    initialData: [],
  });
  const [overviewProject, setOverviewProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    const filteredProjects = projects
      .filter(project => (filterStatus === undefined ? true : project.status === filterStatus))
      .filter(project => (filterType === undefined ? true : project.type === filterType));

    return filteredProjects;
  }, [projects, filterStatus, filterType]);

  const [sortedProjects, setSortedProjects] = useState(filteredProjects);

  useEffect(() => {
    console.log(sortBy);

    if (sortBy === 'DATE') {
      setSortedProjects([...filteredProjects].sort((a, b) => (a.deadline.getDate() <= b.deadline.getDate() ? -1 : 1)));
    } else if (sortBy === 'NAME') {
      setSortedProjects([...filteredProjects].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setSortedProjects(filteredProjects);
    }
  }, [filteredProjects, sortBy]);

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta name='description' content='Projects page' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.projectPageWrapper}>
        <Navbar />

        <div className={styles.projectsWrapper}>
          <div className={styles.projectsHeader}>
            <div className={styles.projectsText}>Projects</div>
            <CurrentDayCard />
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
                type:{' '}
                <select
                  onChange={e =>
                    setFilterType(
                      e.target.value === undefined ? undefined : ProjectType[e.target.value as keyof typeof ProjectType]
                    )
                  }
                >
                  <option value={undefined}>any</option>
                  <option value={ProjectType.COMPANY}>company project</option>
                  <option value={ProjectType.PERSONAL}>personal project</option>
                </select>
              </label>
            </div>
            <div className={styles.createButt}>
              <Button
                text='Create project'
                variant='primary2'
                href='/createProject'
                icon={<img src='/plus.svg' alt='add' />}
              />
            </div>
          </div>

          <div className={styles.projectCardsWrapper}>
            {sortedProjects.map(project => (
              <ProjectCard key={project.id} project={project} onClick={() => setOverviewProject(project)} />
            ))}
            <Link href='/createProject' className={styles.createCardWrapper}>
              <div className={styles.createCard}>Create project</div>
              <img src='/create_plus.png' alt='create' />
            </Link>
          </div>
          {overviewProject && <ProjectOverview onClose={() => setOverviewProject(null)} project={overviewProject} />}
        </div>
      </div>
    </>
  );
};

export default Projects;
