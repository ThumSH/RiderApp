/**
 * Formats a number by adding commas as thousands separators.
 * e.g., 2450 -> "2,450"
 */
export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};