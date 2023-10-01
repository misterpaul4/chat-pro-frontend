import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export const getMessageTime: (dateString: string) => string = (dateString) => {
  const date = dayjs(dateString);
  const currentDate = dayjs();
  const timeFormat = "h:mmA";

  if (date.isSame(currentDate.subtract(1, "day"), "day")) {
    return `yesterday at ${date.format(timeFormat)}`;
  } else if (date.isSame(currentDate, "day")) {
    return `today at ${date.format(timeFormat)}`;
  } else if (date.isAfter(currentDate.subtract(7, "day"))) {
    return `${date.format("dddd")} at ${date.format(timeFormat)}`;
  } else if (date.isAfter(currentDate.startOf("year"))) {
    return `${date.format("DD MMM")} at ${date.format(timeFormat)}`;
  } else {
    return `${date.format("DD MMM YY")} at ${date.format(timeFormat)}`;
  }
};

export const getLastMessageTime = (date: string) => dayjs(date).from(dayjs());

