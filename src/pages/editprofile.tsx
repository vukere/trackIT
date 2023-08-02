import { type NextPage } from "next";
import Head from "next/head";
import { Navbar } from "~/components/Navbar";
import styles from "./editprofile.module.css";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import { CurrentDayCard } from "~/components/CurrentDayCard";
import { useRouter } from "next/router";
import { Team } from "@prisma/client";

type ProfileInput = {
  name: string;
  surname: string;
  email: string;
  team: Team;
};

const ProfileEdit: NextPage = () => {
  // const profile = getData();
  const { data: profile } = api.profile.getProfile.useQuery();
  const updateProfile = api.profile.updateProfile.useMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>();

  const onSubmit: SubmitHandler<ProfileInput> = (data) => {
    updateProfile.mutate(data, { onSuccess: () => router.back() });
  };

  if (profile === undefined) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Edit profile</title>
        <meta name="description" content="Edit profile" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles.profilePageWrapper}>
        <Navbar />
        <div className={styles.profileWrapper}>
          <div className={styles.profileHeader}>
            <div className={styles.profileText}>Edit profile</div>
            <CurrentDayCard />
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className={styles.profileBodyWrapper} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.imgButtWrapper}>
              <div className={styles.profileImg}></div>
              <button className={styles.uploadPhotoButton}>Upload photo</button>
            </div>

            <div className={styles.editDataWrapper}>
              <div className={styles.profileDataWrapper}>
                <div className={styles.profileData}>Name</div>
                <input
                  type="text"
                  defaultValue={profile.name}
                  className={styles.profileDataPerson}
                  {...register("name", { required: true })}
                />
                {errors.name && <span>This field is required</span>}
                <div className={styles.profileData}>Surname</div>
                <input
                  type="text"
                  defaultValue={profile.surname}
                  className={styles.profileDataPerson}
                  {...register("surname", { required: true })}
                />
                {errors.surname && <span>This field is required</span>}
                <div className={styles.profileData}>E-mail</div>
                <input
                  type="email"
                  defaultValue={profile.email}
                  className={styles.profileDataPerson}
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  })}
                />
                {errors.email?.type === "required" && <span>This field is required</span>}
                {errors.email?.type === "pattern" && <span>Please input email</span>}
                <div className={styles.profileData}>Team</div>
                <select className={styles.profileDataPerson} defaultValue={profile.team} {...register("team")}>
                  <option value={Team.NONE}>none</option>
                  <option value={Team.DESIGN}>design</option>
                  <option value={Team.BACKEND}>back-end</option>
                  <option value={Team.FRONTEND}>front-end</option>
                  <option value={Team.MANAGEMENT}>product management</option>
                </select>
              </div>

              <div className={styles.editButtWrapper}>
                <Button text="Cancel" variant="secondary" href="/profile" />
                <Button text="Submit" variant="primary" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileEdit;
