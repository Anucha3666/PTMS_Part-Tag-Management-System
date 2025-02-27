import dayjs from "dayjs";

export const formatDateTime = (date: string | Date) => {
  const formattedDate = dayjs(date).format("MMM DD YYYY HH:mm:ss");
  return formattedDate;
};

export const formatDate = {
  dateTime: formatDateTime,
};
