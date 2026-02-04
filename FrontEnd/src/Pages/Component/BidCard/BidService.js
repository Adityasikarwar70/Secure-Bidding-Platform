export function getTimeDifference(startTimeStr, endTimeStr) {

  const startTime = new Date(startTimeStr);


  startTime.setMinutes(startTime.getMinutes() + 335); // 5 * 60 + 35

  const endTime = new Date(endTimeStr);

  // console.log("startTime (IST adjusted):", startTime, "endTime:", endTime);

  let diffInSeconds = Math.abs((endTime - startTime) / 1000);

  const days = Math.floor(diffInSeconds / (24 * 3600));
  diffInSeconds %= (24 * 3600);

  const hours = Math.floor(diffInSeconds / 3600);
  diffInSeconds %= 3600;

  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds
  };
}
