import dayjs from "dayjs";

export const formatDateTime = (date: string | Date) => {
  const formattedDate = dayjs(date).format("MMM DD YYYY HH:mm:ss");
  return formattedDate;
};
export const formatDate = (date: string | Date) => {
  const formattedDate = dayjs(date).format("MMM DD YYYY");
  return formattedDate;
};

export const format = {
  dateTime: formatDateTime,
  date: formatDate,
};
