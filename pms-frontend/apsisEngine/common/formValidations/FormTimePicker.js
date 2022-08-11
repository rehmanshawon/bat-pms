/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { TimePicker } from "antd";
import moment from "moment";

export const FormTimePicker = ({
  value = "",
  onChange,
  getEvent,
  name,
  type,
  ...rest
}) => {
  const dateFormat = rest.format ?? "HH:mm:ss";
  const placeholder = rest.placeholder || false;

  const [InputValue, setValue] = useState(new Date());

  const handleChange = (date, dateString) => {
    if (onChange) {
      onChange(dateString);
    }

    if (getEvent) {
      const target = { name, value: dateString, date };
      getEvent({ target });
    }
  };

  //data load on edit mode
  useEffect(() => {
    setValue(value);
  }, [name, value]);

  return (
    <TimePicker
      picker={type ?? `date`}
      name={name || `date_field`}
      value={InputValue ? moment(InputValue, dateFormat) : ""}
      placeholder={rest.placeholder ?? "HH:mm:ss"}
      onChange={handleChange}
      autoComplete="Off"
      readOnly={rest.readOnly ? true : false}
      disabled={rest.disabled ? true : false}
      id={rest.id || `_uid${Math.random() * 10}`}
      className={rest.input_class ?? `form-control`}
      disabledTime={rest.disabledTime ? rest.disabledTime : ""}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    />
  );
};
export default FormTimePicker;
