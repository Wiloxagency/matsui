import { CronJob } from "cron";

export const wakeUpServerCron = CronJob.from({
  //   cronTime: "*/10 * * * * *", // 10 seconds
  cronTime: "0 */15 * * * *",
  runOnInit: true,
  onTick: function () {
    wakeUpServer();
    console.log(new Date().toLocaleTimeString());
    console.log("You will see this message every 15 minutes.");
  },
});

export async function wakeUpServer() {
  const fetchRequest = await fetch(
    "https://matsui-sandbox.onrender.com/wakeUpServer"
  );
  const fetchResponse = await fetchRequest.json();
  if (fetchResponse === "ok") {
    console.log("SERVER WOKEN UP");
  }
}
