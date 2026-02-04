export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  date.setMinutes(date.getMinutes() + 333)

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return "";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};


export const isExpired = (targetTime, now) => {
  return new Date(targetTime).getTime() <= now;
};