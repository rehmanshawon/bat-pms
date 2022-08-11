import moment from "moment";

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort = (dateA, dateB) => moment(dateA).diff(moment(dateB));

/**
 *
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort = (a, b) => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
};

const checkNumber = (x) => {
  if (typeof x == "number" && !isNaN(x)) {
    if (Number.isInteger(x)) {
      return true;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export const columnShorter = (a, b, cdata) => {
  let test = Date.parse(a[cdata.dataIndex]);

  //when column is date
  if (test) {
    let returnData = 0;
    if (Date.parse(a[cdata.dataIndex]) < Date.parse(b[cdata.dataIndex])) {
      returnData = -1;
    } else if (
      Date.parse(b[cdata.dataIndex]) < Date.parse(a[cdata.dataIndex])
    ) {
      returnData = 1;
    } else {
      returnData = 0;
    }
    return returnData;
  } else if (a[cdata.dataIndex]&&b[cdata.dataIndex]&&a[cdata.dataIndex].length < b[cdata.dataIndex].length) {
    return -1;
  } else if (a[cdata.dataIndex]&&b[cdata.dataIndex]&&b[cdata.dataIndex].length < a[cdata.dataIndex].length) {
    return 1;
  } else {
    return 0;
  }
};
