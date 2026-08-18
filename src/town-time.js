export function townTimePhase(date, timeZone = "Asia/Shanghai") {
  const hourPart = new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date).find((part) => part.type === "hour")?.value;
  let hour = Number.parseInt(hourPart || "0", 10);
  if (hour === 24) hour = 0;
  if (hour < 5) return "late-night";
  if (hour < 8) return "dawn";
  if (hour < 17) return "day";
  if (hour < 19) return "dusk";
  return "night";
}
