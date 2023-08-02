import Link from "next/link";
import styles from "./navbar.module.css";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { convertTeam } from "~/utils/formatting";

export function Navbar() {
  // const profile = getData();
  const { data: session } = useSession();
  const { data: profile } = api.profile.getProfile.useQuery();

  if (!session || !session.user || !profile) {
    return null;
  }

  const user = session.user;

  return (
    <nav className={styles.NavBar}>
      <div className={styles.NavBarWarpper}>
        <div className={styles.navLogo}>Track IT</div>
        <div className={styles.navUserWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.userImg}
            src={user.image ?? "/octicon_person-24.png"}
            alt="person icon"
            // height={24}
            // width={24}
          />
          <div className={styles.userWrapper}>
            <div className={styles.userNav}>
              {profile.name} {profile.surname}
            </div>
            {profile.team !== "NONE" && <div className={styles.userNavTeam}>{convertTeam(profile.team)}</div>}
          </div>
        </div>

        <div className={styles.navPagesWrapper}>
          <Link className={styles.navPages} href="/dashboard">
            dashboard
          </Link>
          <Link className={styles.navPages} href="/projects">
            projects
          </Link>
          <Link className={styles.navPages} href="/myTasks">
            my tasks
          </Link>
          <Link className={styles.navPagesActive} href="/profile">
            profile
          </Link>
        </div>
      </div>
      <button className={styles.navLogOut} onClick={() => void signOut({ callbackUrl: "/" })}>
        log out
      </button>
    </nav>
  );
}
