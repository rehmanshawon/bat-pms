/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input } from "antd";

export const FormTextArea = ({
  value = "",
  onChange,
  getEvent,
  name,
  type,
  ...rest
}) => {
  const { TextArea } = Input;
  // const [InputValue, setValue] = useState(props.value);

  const handleChange = (event) => {
    const itemValue = event.target.value;
    // setValue(itemValue);

    if (onChange) {
      onChange(itemValue);
    }

    if (getEvent) {
      getEvent(event);
    }
  };

  //data load on edit mode
  // useEffect(() => {
  //   setValue(props.value);
  // }, [props.value]);

  return (
    <TextArea
      name={name || `input_name`}
      type={type || `text`}
      value={value || ""}
      onChange={handleChange}
      autoComplete="Off"
      readOnly={rest.readOnly ? true : false}
      placeholder={rest.placeholder || "write here..."}
      disabled={rest.disabled ? true : false}
      id={rest.id || `_uid${Math.random() * 10}`}
      className={rest.input_class ?? `input_textarea`}
      rows={rest.rows || 3}
    />
  );
};

export default FormTextArea;
