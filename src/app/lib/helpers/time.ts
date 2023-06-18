import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);
const format = "(DD/MMM/YYYY) dddd h:mm A";

export const getMessageTime = (date: string) => {
  // Parse the input date string
  const parsedDate = dayjs(date);

  // Calculate the relative time from now
  const relTime = parsedDate.fromNow();

  // Format the date with the desired output format
  const formattedDate = parsedDate.format(format);

  // Combine the formatted date and relative time to create the final output
  return `${formattedDate} ${relTime}`;
};

export const getLastMessageTime = (date: string) => dayjs(date).from(dayjs());

