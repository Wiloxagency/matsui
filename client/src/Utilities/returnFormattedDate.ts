export function returnFormattedDate(receivedDate: Date) {
  // console.log(receivedDate);
  const newDate = new Date(receivedDate);
  const formattedDate = newDate.toLocaleString("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  // console.log("formattedDate: ", formattedDate);
  return formattedDate;
}
