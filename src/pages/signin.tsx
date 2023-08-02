/* eslint-disable @next/next/no-img-element */
import { getProviders, signIn } from 'next-auth/react';
import styles from './log-in.module.css';
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';
import { Button } from '~/components/Button';
import { useForm } from 'react-hook-form';

type Inputs = {
  email: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/projects' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

export default function LogIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { register, handleSubmit } = useForm<Inputs>();

  function logInWithEmail(data: Inputs) {
    void signIn('email', { email: data.email });
  }

  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name='description' content='Log in' />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className={styles.pageWrapper}>
        <div className={styles.pageHeader}>Track IT</div>
        <div className={styles.bodyWrapper}>
          <img className={styles.img3} src='/img3.png' alt='work art' />
          <div className={styles.bodyBlockWrapper}>
            <div className={styles.bodyTextWrapper}>
              <div className={styles.mainText}>Welcome back!</div>
              <div className={styles.text}>Become more productive with Time tracker</div>
              <div className={styles.blockWrapper}>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form className={styles.mailWrapper} onSubmit={handleSubmit(logInWithEmail)}>
                  <input
                    className={styles.inputMail}
                    type='email'
                    placeholder='email'
                    {...register('email', {
                      required: true,
                      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    })}
                  />
                  <div>
                    <Button text='log in' variant='primary' />
                  </div>
                </form>
                <div className={styles.text2}>or log in with</div>
                <>
                  {Object.values(providers)
                    .filter(provider => provider.type !== 'email')
                    .map(provider => (
                      <div key={provider.name}>
                        <Button variant='secondary' text={provider.name} onClick={() => void signIn(provider.id)} />
                      </div>
                    ))}
                </>
                {/* <div className={styles.testButtons}></div> */}
                <div className={styles.btnLower}>
                  <Button text='Back' variant='secondary' href='/' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
