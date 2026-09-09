/** Formats a 0-23 hour to a 12-hour AM/PM string. E.g. 17 -> "5:00 PM" */
export const formatHour = (h: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
};

/** Formats hour + minute to a 12-hour AM/PM string. E.g. (17, 30) -> "5:30 PM" */
export const formatTime = (h: number, m: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
};

/** Returns today as a local YYYY-MM-DD string */
export const todayStr = (): string => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

/** Returns a local YYYY-MM-DD string for daysAgo days before today */
export const localDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};
