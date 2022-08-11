import React, { useState, useEffect, Fragment } from "react";
import { MultiSelect } from "react-multi-select-component";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
export const FormMultiSelect = ({
  value,
  onChange,
  getEvent,
  name,
  slug,
  dropdownOptions,
  placeholder,
  extra,
  ...rest
}) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleChange = (select) => {
    //set state for this component
    setSelected(select);

    //send to parent component
    if (onChange) {
      onChange(select.map((item) => item.value));
    }

    if (getEvent) {
      const target = {
        name: name,
        value: select.map((item) => item.value),
        selectedItem: select,
        rules: { required: rest?.required },
      };

      getEvent({ target });
    }
  };

  const getOptionsField = async () => {
    await fetchWrapper
      .post("dropdown/dropdowndata", {
        dropdown_slug: slug,
        external_data: extra,
      })
      .then((response) => {
        let optionsItem = response.data ? response.data : [];
        setOptions(optionsItem);
        //set selected
        let selected = [];
        optionsItem.forEach(function (item) {
          if (value && Array.isArray(value) && value.includes(item.value))
            selected.push(item);
        });
        setSelected(selected);
      });
  };

  useEffect(() => {
    if (slug && slug != "") {
      getOptionsField();
    } else if (dropdownOptions && dropdownOptions != "") {
      const optionItems = JSON.parse(dropdownOptions);
      setOptions(optionItems);
      //set selected
      let selected = [];
      optionItems.forEach(function (item) {
        if (value && value.includes(item.value)) selected.push(item);
      });
      setSelected(selected);
    }
    return () => {
      setSelected([]);
    };
  }, [extra, dropdownOptions,value]);

  return (
    <Fragment>
      <MultiSelect
        options={options}
        value={selected}
        onChange={handleChange}
        labelledBy={placeholder ?? "Select"}
      />
    </Fragment>
  );
};

export default React.memo(FormMultiSelect);
