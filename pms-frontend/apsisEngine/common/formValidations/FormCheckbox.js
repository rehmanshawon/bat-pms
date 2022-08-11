import React, { useState, useEffect, Fragment } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Checkbox } from "antd";

export const FormCheckbox = ({
  value,
  onChange,
  getEvent,
  name,
  slug,
  checkBoxOptions,
  extra,
  ...rest
}) => {
  const [options, setOptions] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [checked, setChecked] = useState(false);

  //handle Multiple
  const handleChange = (checkedValues) => {
    //set form values
    if (onChange) {
      onChange(checkedValues);
    }

    //set state values
    setSelectedValue(checkedValues);

    //return data
    if (getEvent) {
      getEvent({ target: { name, value: checkedValues } });
    }
  };

  //handle single
  const handleSingle = (e) => {
    //set single checkbox checked
    setChecked(e.target.checked);

    // //set form values
    if (onChange) {
      if (e.target.checked) {
        onChange(options[0].value);
      } else {
        onChange("");
      }
    }

    //return data
    if (getEvent) {
      if (e.target.checked) {
        onChange(options[0].value);
        getEvent({ target: { name, value: options[0]?.value } });
      } else {
        getEvent({ target: { name, value: "" } });
      }
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
    } else if (checkBoxOptions && checkBoxOptions != "") {
      if (checkBoxOptions.constructor === String) {
        setOptions(JSON.parse(checkBoxOptions));
      } else {
        setOptions(checkBoxOptions);
      }
    }
  }, [checkBoxOptions, name, slug]);

  //data load on edit mode
  useEffect(async () => {
    if (options && options.length > 1) {
      await setSelectedValue(value);
    } else if (options && value == options[0].value) {
      setChecked(true);
    }
  }, [options, value]);

  if (options && options.length > 1) {
    return (
      <Checkbox.Group
        name={name || `input_name`}
        options={options}
        // defaultValue={["Pear"]}
        value={selectedValue}
        onChange={handleChange}
        disabled={rest.disabled ? true : false}
        id={rest.id || `_uid${Math.random() * 10}`}
        className={`${rest.direction ? rest.direction : "horizontal"}`}
      />
    );
  } else {
    return (
      <Fragment>
        {options && (
          <Checkbox
            name={name || `input_name`}
            onChange={handleSingle}
            checked={checked}
            disabled={rest.disabled ? true : false}
          >
            {options[0]?.label}
          </Checkbox>
        )}
      </Fragment>
    );
  }
};
