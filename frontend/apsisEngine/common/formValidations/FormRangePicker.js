/* eslint-disable react-hooks/exhaustive-deps */
//https://ant.design/components/date-picker/
import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const ranges = {
  Today: [moment(), moment()],
  Yesterday: [moment().add(-1, "days"), moment().add(-1, "days")],
  "Last 7 Days": [moment().add(-7, "days"), moment()],
  "Last 30 Days": [moment().add(-30, "days"), moment()],
  "This Month": [moment().startOf("month"), moment().endOf("month")],
  "Last Month": [
    moment().add(-1, "month").startOf("month"),
    moment().add(-1, "month").endOf("month"),
  ],
};

export const FormRangePicker = ({
  value = [],
  onChange,
  getEvent,
  name,
  showTime,
  showRanges,
  ...rest
}) => {
  const dateFormat = rest.format ?? "YYYY-MM-DD";
  const [dateRange, setDateRange] = useState([]);

  const handleChange = (date, dateString) => {
    let value = [];
    if (date && date.length == 2) {
      value = [
        moment(date[0]).format(dateFormat),
        moment(date[1]).format(dateFormat),
      ];
    } else {
      value = [];
    }
    setDateRange(value);
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
    if (value && value.length == 2) {
      let rangeValue = [value[0], value[1]];
      setDateRange(rangeValue);
    }
  }, [value]);

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        onChange={handleChange}
        autoComplete="Off"
        format={["DD-MM-YYYY", dateFormat]}
        value={
          dateRange.length == 2 && [moment(dateRange[0]), moment(dateRange[1])]
        }
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        ranges={showRanges && ranges}
      />
    </Space>
  );
};
export default FormRangePicker;
