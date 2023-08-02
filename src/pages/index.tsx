import { signIn } from 'next-auth/react';
import styles from './index.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '~/components/Button';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name='description' content='Home page' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles.pageWrapper}>
        <header>
          <div className={styles.headerWrapper}>
            <div className={styles.headerNavWrapper}>
              <div className={styles.headerLogo}>Track IT</div>
              <div className={styles.headerNav}>
                <Link className={styles.headerLinks} href='/tour'>
                  tour
                </Link>
                <Link className={styles.headerLinks} href='/about'>
                  about us
                </Link>
              </div>
            </div>
            <button className={styles.headerButton} onClick={() => void signIn()}>
              log in
            </button>
          </div>
        </header>
        <div className={styles.bodyWrapper}>
          <div className={styles.bodyTextWrapper}>
            <div className={styles.textWrapper}>
              <div className={styles.text1}>Track time,</div>
              <div className={styles.text2}>plan tasks, increase efficiency. All in one place.</div>
            </div>
            <Button text='get tour' variant='primary' href='/tour' />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.bodyImg} src='/img1.png' alt='work art' />
        </div>
        <footer>
          <div className={styles.footerWrapper}>
            <div className={styles.footerLogo}>Track IT</div>
            <div className={styles.footerNav}>
              <Link className={styles.footerLinks} href='/tour'>
                tour
              </Link>
              <Link className={styles.footerLinks} href='/about'>
                about us
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
