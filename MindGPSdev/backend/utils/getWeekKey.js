export function getWeekKey(date = new Date()) {
  const year = date.getFullYear();

  const firstJan = new Date(year, 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));

  const week = Math.ceil((date.getDay() + 1 + days) / 7);

  const paddedWeek = String(week).padStart(2, "0");
  return `${year}-W${paddedWeek}`;
}