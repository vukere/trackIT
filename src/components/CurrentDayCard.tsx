import dayjs from "dayjs";
import styles from "./currentDay.module.css";

export function CurrentDayCard() {
  return (
    <div className={styles.tasksHeaderDate}>
      {new Date().toLocaleDateString("en-US", { weekday: "long" })}
      <br />
      {dayjs().format("DD.MM.YYYY")}
    </div>
  );
}
