import { type NextPage } from "next";
import { Navbar } from "~/components/Navbar";
import styles from "./profile.module.css";
import Head from "next/head";
import { api } from "~/utils/api";
import Link from "next/link";
import { CurrentDayCard } from "~/components/CurrentDayCard";
import { convertTeam } from "~/utils/formatting";

const Profile: NextPage = () => {
  const { data: profile } = api.profile.getProfile.useQuery();

  if (profile === undefined) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles.profilePageWrapper}>
        <Navbar />
        <div className={styles.profileWrapper}>
          <div className={styles.profileHeader}>
            <div className={styles.profileText}>Profile</div>
            <CurrentDayCard />
          </div>

          <div className={styles.profileBodyWrapper}>
            <div className={styles.imgButtWrapper}>
              <div className={styles.profileImg}></div>
              <Link href="/editprofile" className={styles.editProfileButton}>
                Edit profile
              </Link>
            </div>
            <div className={styles.profileDataWrapper}>
              <div className={styles.profileData}>Name</div>
              <div className={styles.profileDataPerson}>{profile.name}</div>
              <div className={styles.profileData}>Surname</div>
              <div className={styles.profileDataPerson}>{profile.surname}</div>
              <div className={styles.profileData}>E-mail</div>
              <div className={styles.profileDataPerson}>{profile.email}</div>
              <div className={styles.profileData}>Team</div>
              <div className={styles.profileDataPerson}>{convertTeam(profile.team)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
