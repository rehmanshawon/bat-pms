/* eslint-disable react-hooks/exhaustive-deps */
//https://ant.design/components/date-picker/
import { dateMinMaxValidation } from "apsisEngine/helpers/dateMinMaxValidation";
import { DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const FormDatePicker = ({
  value,
  onChange,
  getEvent,
  name,
  type,
  showTime,
  min,
  max,
  ...rest
}) => {
  const dateFormat =
    rest.format ?? (showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
  const dateFormatHuman =
    rest.format ?? (showTime ? "DD-MM-YYYY HH:mm:ss" : "DD-MM-YYYY");

  const placeholder = rest.placeholder || false;

  const [InputValue, setValue] = useState(null);

  const handleChange = (date, dateString) => {
    if (!date) {
      setValue(null);
      if (onChange) {
        onChange(null);
      }

      if (getEvent) {
        const target = { name: name, value: null };
        getEvent({ target });
      }
    } else {
      const value = moment(date).format(dateFormat);
      setValue(value);
      if (onChange) {
        onChange(value);
      }

      if (getEvent) {
        const target = { name: name, value: value, date };
        getEvent({ target });
      }
    }
  };

  //data load on edit mode
  useEffect(() => {
    if (value) {
      if (moment(value, dateFormat, true).isValid()) {
        setValue(value);
      } else {
        setValue(moment(value).format(dateFormat));
      }
    } else {
      setValue(null);
    }
  }, [name, value]);

  // useEffect(() => {
  //   if (!value && onChange) {
  //     onChange(moment().format(dateFormat));
  //   }
  // }, []);

  return (
    <>
      <DatePicker
        showTime={showTime ?? false}
        picker={type ?? `date`}
        name={name || `date_field`}
        disabledDate={(current) => dateMinMaxValidation(current, min, max)}
        value={InputValue ? moment(InputValue, dateFormat) : null}
        format={rest.format ?? dateFormatHuman}
        placeholder={rest.placeholder ?? dateFormat}
        onChange={handleChange}
        autoComplete="Off"
        readOnly={rest.readOnly ? true : false}
        disabled={rest.disabled ? true : false}
        id={rest.id || `_uid${Math.random() * 10}`}
        className={rest.input_class ?? `form-control`}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </>
  );
};
export default FormDatePicker;
