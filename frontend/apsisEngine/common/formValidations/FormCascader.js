import React, { Fragment, useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Cascader } from "antd";

export const FormCascader = ({
  value = "",
  onChange,
  getEvent,
  name,
  slug,
  dropdownOptions,
  extra,
  ...rest
}) => {
  const [options, setOptions] = useState();
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
      const target = {
        name: name,
        value: value,
      };
      getEvent({ target });
    }
  }

  //fetch data
  const fetchData = async () => {
    let response = await fetchWrapper.post("tree/treedata", {
      tree_slug: slug,
      external_data: extra,
    });

    if (!response.error && response.data) {
      setOptions(response.data);
    }
  };

  useEffect(() => {
    if (slug && slug != "") {
      fetchData();
    } else if (
      dropdownOptions.constructor === Array &&
      Object.keys(dropdownOptions).length > 0
    ) {
      setOptions(dropdownOptions);
    }

    return () => {
      setSelectedValue([]);
    };
  }, [slug, extra]);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <Fragment>
      <Cascader
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        name={name || "option_name"}
        value={selectedValue}
        options={options}
        onChange={handleChange}
        maxtagcount="responsive"
        placeholder={rest.placeholder ?? "Please select"}
        changeOnSelect
      />
    </Fragment>
  );
};
export default FormCascader;
