import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./dashboard.module.css";
import { api } from "~/utils/api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Head from "next/head";
import { Navbar } from "~/components/Navbar";
import { CurrentDayCard } from "~/components/CurrentDayCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Weekly working hours",
    },
  },
};

const lables = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WorkTimeChart() {
  // const data = [6, 2.2, 8, 7, 5.5, 6.4, 1];
  const { data } = api.timeRecord.getReport.useQuery(undefined, { initialData: [0, 0, 0, 0, 0, 0, 0] });

  return (
    <div className={styles.chartWrapper} style={{ width: "578px" }}>
      <Bar
        options={options}
        data={{
          labels: lables,
          datasets: [{ label: "work time", data: data, borderWidth: 1, backgroundColor: "#B2D3B9" }],
        }}
      />
    </div>
  );
}

type NotesProps = {
  initialText: string;
};

function Notes({ initialText }: NotesProps) {
  const [text, setText] = useState(initialText);
  const updateNote = api.note.update.useMutation();
  const apiContext = api.useContext();
  function onNoteChanged() {
    updateNote.mutate({ text: text }, { onSuccess: () => void apiContext.note.get.invalidate() });
  }

  return (
    <textarea
      className={styles.notesWrapper}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={onNoteChanged}
    />
  );
}

export default function Dashboard() {
  const [selected, setSelected] = useState<Date>();
  const { data: note } = api.note.get.useQuery();
  const { data: timeSpentToday } = api.timeRecord.getTimeToday.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles.dashPageWrapper}>
        <Navbar />
        <div className={styles.dashWrapper}>
          <div className={styles.dashHeader}>
            <div className={styles.dashText}>Dashboard</div>
            <CurrentDayCard />
          </div>
          <div>
            <div className={styles.positionTest}>
              <div className={styles.spentTimeWrapper}>Your work time for today: {timeSpentToday}</div>
              <div className={styles.calendarWrapper}>
                <DayPicker mode="single" selected={selected} onSelect={setSelected} />
              </div>
              <div className={styles.test}> Notes {note && <Notes initialText={note.text} />}</div>
            </div>
            <WorkTimeChart />
          </div>
        </div>
      </div>
    </>
  );
}
