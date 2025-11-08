export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const dateObject = new Date(dateString);

  // Check if date is valid
  if (isNaN(dateObject.getTime())) {
    return "";
  }

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

export const formatDateTime = (dateString: string | Date) => {
  if (!dateString) return "";

  const dateObject = new Date(dateString);

  // Check if date is valid
  if (isNaN(dateObject.getTime())) {
    return "";
  }

  // Format as "MMM DD, YYYY at HH:MM AM/PM"
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const day = dateObject.getDate();
  const month = monthNames[dateObject.getMonth()];
  const year = dateObject.getFullYear();

  let hours = dateObject.getHours();
  const minutes = dateObject.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};
