import { signIn } from "next-auth/react";
import styles from "./about.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/Button";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About us</title>
        <meta name="description" content="About us" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <header>
        <div className={styles.headerWrapper}>
          <div className={styles.headerNavWrapper}>
            <div className={styles.headerLogo}>Track IT</div>
            <div className={styles.headerNav}>
              <Link className={styles.headerLinks} href="/tour">
                tour
              </Link>
              <Link className={styles.headerLinks} href="/">
                home
              </Link>
            </div>
          </div>
          <button className={styles.headerButton} onClick={() => void signIn("google", { callbackUrl: "/projects" })}>
            log in
          </button>
        </div>
      </header>

      <div className={styles.bodyWrapper}>
        <div className={styles.textWrapper}>
          <div className={styles.text1}>Welcome!</div>
          <div className={styles.text2}>
            We are a team of young developers who decided to create an app that can help with various projects and that
            is suitable for personal use as well as for companies.
          </div>
        </div>

        <div className={styles.bodyFormWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.bodyImg} src="/img2.png" alt="work art" />

          <div className={styles.aboutMailWrapper}>
            {/* <div className={styles.text2}>
              We always appreciate your feedback or suggestions,
            </div>
            <div className={styles.text2}>we look forward to your email!</div> */}
            <div className={styles.text2}>
              We always appreciate your feedback or suggestions, we look forward to your email!
            </div>
            <form className={styles.aboutFormMailWrapper}>
              <div className={styles.aboutTextgMailWrapper}>
                <div className={styles.mailWrapper}>
                  <label className={styles.aboutMailText}>Name</label>
                  <input type="text" className={styles.formText} />
                </div>
                <div className={styles.mailWrapper}>
                  <label className={styles.aboutMailText}>Email</label>
                  <input
                    type="mail"
                    className={styles.formText}
                    // {...register("email", {
                    //   required: true,
                    //   pattern:
                    //     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    // })}
                  />
                </div>
              </div>
            </form>
            <Button text="Submit" variant="primary" />
          </div>
        </div>
      </div>

      <footer>
        <div className={styles.footerWrapper}>
          <div className={styles.footerLogo}>Track IT</div>
          <div className={styles.footerNav}>
            <Link className={styles.footerLinks} href="/tour">
              tour
            </Link>
            <Link className={styles.footerLinks} href="/">
              home
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
