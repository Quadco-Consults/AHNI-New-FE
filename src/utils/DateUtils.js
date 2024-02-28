/**
 *
 * @param {Date | string | number} from
 * @param {Date | string | number} to
 */
export function getCountdown(from, to) {
  const oneSecondInMilli = 1000,
    oneMinuteInMilli = oneSecondInMilli * 60,
    oneHourInMilli = oneMinuteInMilli * 60,
    oneDayInMilli = oneHourInMilli * 24;

  const _from = new Date(from),
    _to = new Date(to),
    _fromTime = _from.getTime(),
    _toTime = _to.getTime(),
    distance = _toTime - _fromTime;

  const days = Math.floor(distance / oneDayInMilli),
    hours = Math.floor((distance % oneDayInMilli) / oneHourInMilli),
    minutes = Math.floor((distance % oneHourInMilli) / oneMinuteInMilli),
    seconds = Math.floor((distance % oneMinuteInMilli) / oneSecondInMilli);

  return { days, hours, minutes, seconds };
}

export const dateMonths = [
  undefined,
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * format stringified number which length is less than 10 to DD e.g 02.
 * @param {number} number
 * @returns
 */
function formatNumberToDD(number) {
  let suffix = "0";
  let numberStr = number.toString();
  if (numberStr.length === 1) {
    numberStr = suffix.concat(numberStr);
  }
  return numberStr;
}

/**
 *
 * @param {Array} date
 * @returns
 */
export const parseDateToString = (date) => {
  const year = date?.[0] || "";
  const month = dateMonths[date?.[1]] || "";
  const day = date?.[2] || "";

  let separator = Array.isArray(date) && date.length ? " " : "";
  let newDate =
    formatNumberToDD(day) +
    separator +
    formatNumberToDD(month) +
    separator +
    year;

  return newDate || null;
};

import { parseISO, isValid, format } from "date-fns";

/**
 * Check for date validity
 * @param {Date} date // Date in iso
 * @returns
 */
export const isValidDate = (date) => {
  const parsed = parseISO(date);
  if (isValid(parsed)) {
    return format(parsed, "dd/MM/yyyy");
  }
  return null;
};
