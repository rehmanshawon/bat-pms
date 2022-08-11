/* eslint-disable react-hooks/exhaustive-deps */
//https://ant.design/components/input/
import React, { useState, useEffect } from "react";
import { InputNumber, Input } from "antd";

export const FormInputNumber = ({
  value = "",
  onChange,
  getEvent,
  name,
  type,
  suffix,
  prefix,
  ...rest
}) => {
  // const [InputValue, setValue] = useState(props.value);

  const handleChange = (inputVal) => {
    // // setValue(itemValue);

    if (onChange) {
      onChange(inputVal);
    }

    if (getEvent) {
      const target = { name: name, value: inputVal };
      getEvent({ target });
    }
  };

  //data load on edit mode
  // useEffect(() => {
  //   setValue(props.value);
  // }, [props.value]);

  if (suffix || prefix) {
    return (
      <span className="ant-input-group-wrapper">
        <span className="ant-input-wrapper ant-input-group">
          {prefix && <span className="ant-input-group-addon">{prefix}</span>}
          <InputNumber
            name={name || `input_name`}
            type={type || `text`}
            value={value >= 0 ? value : ""}
            onChange={handleChange}
            //parser={(value) => Number(value.replace("%", ""))}
            autoComplete="Off"
            readOnly={rest.readOnly ? true : false}
            disabled={rest.disabled ? true : false}
            placeholder={rest.placeholder || ""}
            id={rest.id || `_uid${Math.random() * 10}`}
            className={rest.input_class ?? `form-control w-100`}
            {...rest}
          />
          {suffix && <span className="ant-input-group-addon">{suffix}</span>}
        </span>
      </span>
    );
  }

  return (
    <InputNumber
      name={name || `input_name`}
      type={type || `text`}
      value={value >= 0 ? value : ""}
      onChange={handleChange}
      //parser={(value) => Number(value.replace("%", ""))}
      autoComplete="off"
      readOnly={rest.readOnly ? true : false}
      disabled={rest.disabled ? true : false}
      placeholder={rest.placeholder || ""}
      id={rest.id || `_uid${Math.random() * 10}`}
      className={rest.input_class ?? `form-control w-100`}
      {...rest}
    />
  );
};
