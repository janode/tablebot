import { getAvailableDates } from "../bookdinner.js";
import { sendDebug } from "../botty.js";
import { restaurants } from "../config.js";

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

await getAvailableDates();
