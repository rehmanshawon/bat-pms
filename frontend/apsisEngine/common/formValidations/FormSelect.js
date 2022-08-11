import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Select } from "antd";

export const FormSelect = ({
  value = "",
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
    //set selected item
    setSelectedValue(value);

    //set form value
    if (onChange) {
      onChange(value);
    }

    //return event values
    if (getEvent) {
      const selectedItem = options
        ? options.filter((item) => item.value == value)
        : [];
      const target = {
        name: name,
        value: value,
        rules: { required: rest?.required },
        selectedItem,
      };

      getEvent({ target });
    }
  }

  //array to Object conversion
  const toObject = (data) => {
    let result = [];
    for (let i = 0; i < data.length; ++i) {
      let obj = {};
      obj["label"] = data[i];
      obj["value"] = data[i];
      result.push(obj);
    }
    return result;
  };

  //fetch data
  const fetchData = async () => {
    setLoading(true);
    if (slug.indexOf(",") > -1) {
      let options = toObject(slug.split(","));
      setOptions(options);
    } else {
      let response = await fetchWrapper.post("dropdown/dropdowndata", {
        dropdown_slug: slug,
        external_data: extra,
      });

      if (!response.error && response.data) {
        setOptions(response.data);
        if (response.data.length === 1) {
          handleChange(response.data[0].value);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (slug && slug != "") {
      fetchData();
    } else if (dropdownOptions && dropdownOptions != "") {
      const options = JSON.parse(dropdownOptions);
      setOptions(options);
    }
  }, [extra, dropdownOptions]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <Select
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      showSearch
      allowClear
      placeholder={rest.placeholder ?? "Please select"}
      optionFilterProp="children"
      name={name || "option_name"}
      onChange={handleChange}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      // defaultValue={selectedValue}
      value={selectedValue}
      loading={loading ?? false}
      {...rest}
    >
      {options &&
        options.map((opt, i) => (
          <Option key={i.toString(36) + i} value={opt.value}>
            {opt.label || ""}
          </Option>
        ))}
    </Select>
  );
};
export default FormSelect;
