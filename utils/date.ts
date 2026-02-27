const DATE_KEY_LENGTH = 10;
const DEFAULT_TIME_ZONE = "Asia/Tokyo";

export const toDateKey = (startAt: string): string => {
  if (!startAt || startAt.length < DATE_KEY_LENGTH) return "";
  return startAt.slice(0, DATE_KEY_LENGTH);
};

export const toMonthDay = (startAt: string): { month: string; day: string } => {
  const dateKey = toDateKey(startAt);
  const [year, month, day] = dateKey.split("-");

  if (!year || !month || !day) {
    return { month: "--", day: "--" };
  }

  return {
    month: String(Number(month)),
    day: String(Number(day)),
  };
};

export const getCurrentDateKey = (timeZone: string = DEFAULT_TIME_ZONE): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, DATE_KEY_LENGTH);
  }

  return `${year}-${month}-${day}`;
};

export const getLiveStatus = (
  startAt: string,
  todayKey: string
): { label: "已结束" | "进行中" | "即将开始"; color: string } => {
  const startDate = toDateKey(startAt);

  if (!startDate || !todayKey) {
    return { label: "即将开始", color: "bg-indigo-600" };
  }

  if (startDate < todayKey) return { label: "已结束", color: "bg-slate-500" };
  if (startDate === todayKey) return { label: "进行中", color: "bg-red-600" };
  return { label: "即将开始", color: "bg-indigo-600" };
};
