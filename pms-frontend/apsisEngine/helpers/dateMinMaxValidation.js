import moment from "moment";
export function dateMinMaxValidation(current, min, max) {
  if (min && max) {
    const dateStart = moment(`${min}`).startOf();
    const dateEnd = moment(`${max}`).endOf();
    return !(dateStart.isSameOrBefore(current) && dateEnd.isAfter(current));
  } else if (min) {
    const dateStart = moment(`${min}`).startOf();
    // const dateEnd = moment().endOf("years");
    return !dateStart.isSameOrBefore(current);
    // && dateEnd.isAfter(current)
  } else if (max) {
    // const dateStart = moment().subtract(20, "years").startOf();
    const dateEnd = moment(`${max}`).endOf();
    // dateStart.isSameOrBefore(current) &&
    return !dateEnd.isAfter(current);
  }
}
