import React, { useEffect, useState } from "react";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Select } from "antd";

export const FormTags = ({
  value,
  onChange,
  getEvent,
  name,
  slug,
  dropdownOptions,
  extra,
  ...rest
}) => {
  const { Option } = Select;
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  function handleChange(value) {
    console.log(value);
    //set selected item
    setSelectedValue(value);

    //set form value
    if (onChange) {
      onChange(value);
    }

    //return event values
    if (getEvent) {
      const target = {
        name: name,
        value: value,
        rules: { required: rest?.required },
      };
      getEvent({ target });
    }
  }

  //fetch data
  const fetchData = async () => {
    setLoading(true);
    let response = await fetchWrapper.get(slug);

    if (!response.error && response.data) {
      setOptions(response.data);
      // console.log(response.data);
    }

    // const children = [];
    // for (let i = 10; i < 36; i++) {
    //   children.push(i.toString(36) + i);
    // }
    // setOptions(children);
    setLoading(false);
  };

  useEffect(() => {
    if (slug && slug != "") {
      fetchData();
    }
  }, [extra]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <Select
      mode="tags"
      placeholder={rest.placeholder ?? "Please select"}
      name={name || "option_name"}
      style={{ width: "100%" }}
      onChange={handleChange}
      tokenSeparators={[","]}
      value={selectedValue}
      loading={loading ?? false}
    >
      {options &&
        options.map((opt, i) => (
          <Option key={i.toString(36) + i} value={opt}>
            {opt}
          </Option>
        ))}
    </Select>
  );
};
export default FormTags;
