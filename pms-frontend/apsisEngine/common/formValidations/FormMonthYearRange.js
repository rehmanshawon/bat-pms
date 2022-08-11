/* eslint-disable react-hooks/exhaustive-deps */
//https://ant.design/components/date-picker/
import React, { useState, useEffect } from "react";
import { DatePicker, Space } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

export const FormMonthYearRange = ({
  value = [],
  onChange,
  getEvent,
  name,
  type,
  ...rest
}) => {
  const format = type == "month_range" ? "YYYY-MM" : "YYYY";
  const [range, setrange] = useState([]);
  const handleChange = (data) => {
    const value = [
      moment(data[0]).format(format),
      moment(data[1]).format(format),
    ];
    setrange(value);
    if (onChange) {
      onChange(value);
    }

    if (getEvent) {
      const target = { name: name, value: value };
      getEvent({ target });
    }
  };

  //data load on edit mode
  useEffect(() => {
    if (value && value.length > 0) {
      let rangeValue = [value[0], value[1]];
      setrange(rangeValue);
    }
  }, [value]);

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        autoComplete="Off"
        picker={type == "month_range" ? "month" : "year"}
        format={format}
        onChange={handleChange}
        value={range.length > 1 && [moment(range[0]), moment(range[1])]}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </Space>
  );
};
export default FormMonthYearRange;
