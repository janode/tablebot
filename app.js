import cron from "node-cron";
import { getAvailableDates } from "./bookdinner.js";
import { sendDebug } from "./botty.js";
import { restaurants } from "./config.js";

sendDebug(
  `Finner ledig bord for følgende restauranter: ${restaurants
    .map(
      (x) =>
        `${
          x.name
            ? `
🍔 ${x.name}`
            : ""
        }`
    )
    .join(" ")}`
);

async function go() {
  await getAvailableDates();
}

go();
// cron.schedule(`*/${process.env.POLL_INTERVAL} * * * *`, go);
