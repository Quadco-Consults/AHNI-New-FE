/**
 *
 * @param {string} str
 * @returns
 */
export function cast(str) {
  return str === "null"
    ? null
    : str === "undefined"
    ? undefined
    : str === "'null'" || str === '"null"'
    ? "null"
    : str === "true"
    ? true
    : str === "false"
    ? false
    : !isNaN(Number(str))
    ? Number(str)
    : str;
}

/**
 *
 * @param {string} str
 * @returns
 */
export function isJson(str) {
  if (str && typeof str === "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {}
  }
  return false;
}

/**
 *
 * @param {string} str
 * @returns
 */
export function escapeRegExp(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
