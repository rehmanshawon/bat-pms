/* eslint-disable react-hooks/exhaustive-deps */
//https://reactdatepicker.com/
import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Form } from "antd";

export const FormDateTimePicker = (props) => {
  const placeholder = props.placeholder || "dd-mm-yyyy HH:mm:ss";
  const name = props.name || "datetime_picker";
  const format = props.format || "dd-MM-yyyy HH:mm:ss";

  const [value, setValue] = useState(new Date());

  const formateDate = (date, formate = "YYYY-MM-DD HH:mm:ss") => {
    if (date) {
      return moment(date).format(formate);
    }
    return moment().format(formate);
  };

  const styles = {
    datePicker: {
      width: "100%",
      position: "relative",
    },
    pickerIcon: {
      position: "absolute",
      right: 10,
      top: 10,
      color: "#000",
    },
    icon: {
      color: "#222",
    },
  };

  const handleChange = (date) => {
    setValue(date);
    let rsp_date = formateDate(date, "YYYY-MM-DD HH:mm:ss");
    let obj = {
      target: {
        name: name,
        value: rsp_date,
      },
    };
    //if(props.onChange) props.onChange(obj);
    if (props.onChange) {
      if (props.optional) props.onChange(obj, props.optional);
      else props.onChange(obj);
    }
  };

  //data load on edit mode
  useEffect(() => {
    if (props.value && props.value !== undefined)
      setValue(new Date(props.value));
  }, []);
  return (
    <>
      <div className="datepicker_component" style={styles.datePicker}>
        <Form.Item rules={[{ required: props.required ? true : false }]}>
          <DatePicker
            selected={value}
            onChange={handleChange}
            dateFormat={format}
            placeholderText={placeholder}
            className={`form-control`}
            name={name}
            autoComplete="off"
            showTimeSelect
            required={props.required ? true : false}
          />
        </Form.Item>
        <div style={styles.pickerIcon}>
          <i className="fa fa-calendar-alt" style={styles.icon} />
        </div>
      </div>
    </>
  );
};
