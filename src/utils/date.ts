export const formatDate = (dateString: string) => {
  const dateObject = new Date(dateString);
  const YYYYMMDD = dateObject.toISOString().split("T")[0];
  return YYYYMMDD;
};

export function convertDateFormat(
  isoDateString: string,
  targetDay?: number,
  targetMonth?: number,
  targetYear?: number
): string {
  // Parse the ISO date string
  const date = new Date(isoDateString);

  // Override date parts if provided
  if (targetDay !== undefined) {
    date.setDate(targetDay);
  }

  if (targetMonth !== undefined) {
    date.setMonth(targetMonth);
  }

  if (targetYear !== undefined) {
    date.setFullYear(targetYear);
  }

  // Create array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the date as "MMM DD, YYYY"
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
