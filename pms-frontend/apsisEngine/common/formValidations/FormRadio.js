import React, { useState, useEffect } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Radio, Space } from "antd";

export const FormRadio = ({
  value,
  onChange,
  getEvent,
  name,
  slug,
  radioOptions,
  extra,
  ...rest
}) => {
  const [options, setOptions] = useState();
  const [checkedValue, setCheckedValue] = useState();

  const handleChecked = (e) => {
    // console.log("radio checked", e.target.value);
    //set form values
    if (onChange) {
      onChange(e.target.value);
    }
  };

  //fetch data
  const fetchData = async () => {
    let response = await fetchWrapper.post("dropdown/dropdowndata", {
      dropdown_slug: slug,
      external_data: extra,
    });
    if (!response.error && response.data) {
      setOptions(response.data);
    }
  };

  //setOptions
  useEffect(async () => {
    if (slug && slug != "") {
      await fetchData();
    } else if (radioOptions && radioOptions != "") {
      if (radioOptions.constructor === String) {
        setOptions(JSON.parse(radioOptions));
      } else {
        setOptions(radioOptions);
      }
    }
  }, [radioOptions, name, slug]);

  //data load on edit mode
  useEffect(() => {
    setCheckedValue(value);
  }, [options, value]);

  return (
    <Radio.Group
      onChange={handleChecked}
      value={checkedValue}
      name={name || `input_name`}
      disabled={rest.disabled ? true : false}
      id={rest.id || `_uid${Math.random() * 10}`}
    >
      <Space direction={`${rest.direction ? rest.direction : "horizontal"}`}>
        {options &&
          options.length > 0 &&
          options.map((item, index) => {
            return (
              <Radio value={item?.value} key={`radio_${index}_${item?.value}`}>
                {item?.label}
              </Radio>
            );
          })}
      </Space>
    </Radio.Group>
  );
};
