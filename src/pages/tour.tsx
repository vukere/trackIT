/* eslint-disable @next/next/no-img-element */
import { signIn } from 'next-auth/react';
import styles from './tour.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Tour: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tour</title>
        <meta name='description' content='Tour' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <header>
        <div className={styles.headerWrapper}>
          <div className={styles.headerNavWrapper}>
            <div className={styles.headerLogo}>Track IT</div>
            <div className={styles.headerNav}>
              <Link className={styles.headerLinks} href='/'>
                home
              </Link>
              <Link className={styles.headerLinks} href='/about'>
                about us
              </Link>
            </div>
          </div>
          <button className={styles.headerButton} onClick={() => void signIn('google', { callbackUrl: '/projects' })}>
            log in
          </button>
        </div>
      </header>

      <div className={styles.bodyWrapper}>
        <div className={styles.textWrapper}>
          <div className={styles.text1}>Welcome!</div>
          <div className={styles.text2}>Here you can find out more about the features of our app.</div>
        </div>

        <div className={styles.tourWrapper}>
          <div className={styles.text3}>
            So, let&apos;s get started! First you&apos;ll be welcomed by our handy in-app authentication, with which you
            don&apos;t need to remember passwords.{' '}
          </div>
          <div className={styles.tourBlockWrapper}>
            <div className={styles.tourBlockWrapperText}>
              First you will be welcomed by a project page where you can create and manage your projects. They can be
              personal or company projects, and you can also see their status and deadlines for convenience.
            </div>
            <img src='/projects.png' alt='app' />
          </div>
          <div className={styles.tourBlockWrapper}>
            <img src='/tasks.png' alt='app' />
            <div className={styles.tourBlockWrapperText}>
              Then you can create tasks for your projects, where you can also see their status and deadlines and, for
              company projects, the team you are assigned to.
            </div>
          </div>
          <div className={styles.text3}></div>
          <div className={styles.tourBlockWrapper}>
            <div className={styles.tourBlockWrapperText}>
              Also, this page will show you your tasks, and you can log the time and see your logging history to
              increase your efficiency more easily.
            </div>
            <img src='/my_tasks.png' alt='app' />
          </div>
          <div className={styles.tourBlockWrapper}>
            <img src='/dashboard.png' alt='app' />
            <div className={styles.tourBlockWrapperText}>
              There&apos;s also a dashboard page where you can make notes, see time analytics, and there&apos;s also a
              calendar for convenience, as well as a mini version of it on each page.
            </div>
          </div>
          <div className={styles.text3}>So, we will be pleased to see you among our users!</div>
          <button className={styles.headerButton} onClick={() => void signIn('google', { callbackUrl: '/projects' })}>
            log in
          </button>
        </div>
      </div>

      <footer>
        <div className={styles.footerWrapper}>
          <div className={styles.footerLogo}>Track IT</div>
          <div className={styles.footerNav}>
            <Link className={styles.footerLinks} href='/'>
              home
            </Link>
            <Link className={styles.footerLinks} href='/about'>
              about us
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Tour;
