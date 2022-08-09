import fetch from "isomorphic-fetch";
import { sendDebug, sendMessageWithReplyMarkup } from "./botty.js";
import { areaId, baseUrl, numberOfPeople, restaurants } from "./config.js";

let notifications = [{ date: "2022-05-30", time: "18:00:00" }];

async function getDatesForRestaurant(restaurant) {
  const response = await fetch(
    `${baseUrl}/time_days/calendar_days/${restaurant.restaurantId}/${areaId}/${numberOfPeople}/2022-08-10/2022-09-11.json`
  );

  if (response.status !== 200) {
    sendDebug(
      `Klarte ikke å hente ledige datoer for ${restaurant.name}. HTTP${
        response.status
      }, ${await response.text()}`
    );
    return;
  }

  const dates = await response.json();

  for (const date of dates.days) {
    if (date.TimeDay.closed == 0) {
      if (date.Booking.availability_status == 1) {
        console.log("Getting available slots for " + date.TimeDay.day);
        await getTimesForDate(restaurant, date.TimeDay.day);
      } else {
        console.log(
          `Restaurant ${restaurant.name} har ingen ledige bord ${date.TimeDay.day}`
        );
      }
    } else {
      console.log(
        `Restaurant ${restaurant.name} er ikke åpen ${date.TimeDay.day}`
      );
    }
  }
}

async function getTimesForDate(restaurant, date) {
  const response = await fetch(
    `${baseUrl}/times/index/${restaurant.restaurantId}/${date}/${areaId}/${numberOfPeople}/0.json`
  );

  if (response.status !== 200) {
    sendDebug(
      `Klarte ikke å hente ledige tider for ${restaurant.name}. HTTP${
        response.status
      }, ${await response.text()}`
    );
    return;
  }

  const timeSlots = await response.json();
  const openTimes = timeSlots.openTimes;

  console.log(`${restaurant.name}: ${date} : ${JSON.stringify(openTimes)}`);

  for (const openTime of openTimes) {
    const time = openTime.Time.time;
    console.log("Currently at " + time);

    const existingNotification = notifications.find(
      (x) => x.date === date && x.time == time
    );

    if (!existingNotification) {
      notifications.push({ date: date, time: time });
      console.log(`Adding ${date} ${time} to notification cache`);
    } else {
      openTimes = openTimes.filter((x) => x.date == date && x.time == time);
      console.log(
        `Removing ${date} ${time} from time slots as we have seen it before`
      );
    }
  }

  if (openTimes.length > 0) {
    let days = [
      "Søndag",
      "Mandag",
      "Tirsdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lørdag",
    ];
    var timeSlotDate = new Date(date);

    sendMessageWithReplyMarkup(
      `
🏠 ${restaurant.name}
📅 ${days[timeSlotDate.getDay()]} ${timeSlotDate.toLocaleDateString("nb-NO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}
👪 ${numberOfPeople} personer
🕘 ${openTimes.map((a) => a.Time.time.slice(0, -3)).join(" ")}`,
      {
        linkText: "Reservere time",
        linkUrl: `https://book.dinnerbooking.com/no/nb-NO/book/table/day/${restaurant.restaurantId}/${numberOfPeople}`,
      }
    );
  }
}

export async function getAvailableDates() {
  for (const restaurant of restaurants) {
    await getDatesForRestaurant(restaurant);
  }
}
