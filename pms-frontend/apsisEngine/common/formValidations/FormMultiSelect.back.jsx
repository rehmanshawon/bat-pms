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
  // const [options, setOptions] = useState(["Select One"]);
  const [selected, setSelected] = useState([]);

  const handleChange = (select) => {
    //set state for this component
    setSelected(select);

    //send to parent component
    let valueArr = select.map(function (item) {
      return item.value;
    });

    if (onChange) {
      onChange(valueArr);
    }

    if (getEvent) {
      const target = {
        name: name,
        value: valueArr,
        rules: { required: rest?.required },
        selectedItem: select,
      };
      getEvent({ target });
    }
  };

  const fetchOptions = async () => {
    // setLoading(true);
    let response = await fetchWrapper.post("dropdown/dropdowndata", {
      dropdown_slug: slug,
      external_data: extra,
    });

    let optionsItem = response.data ? response.data : [];
    let selected = [];
    optionsItem.forEach(function (item) {
      if (value && value.includes(item.value)) selected.push(item);
    });

    setSelected(selected);
    return optionsItem;
  };

  const options = React.useMemo(() => {
    return fetchOptions();
  }, [slug, extra]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // setLoading(true);
  //     let response = await fetchWrapper.post("dropdown/dropdowndata", {
  //       dropdown_slug: slug,
  //       external_data: extra,
  //     });

  //     let optionsItem = response.data ? response.data : [];
  //     setOptions(optionsItem);

  //     let selected = [];
  //     optionsItem.forEach(function (item) {
  //       if (value && value.includes(item.value)) selected.push(item);
  //     });
  //     setSelected(selected);
  //     // setLoading(false);
  //   };
  //   fetchData();

  //   return () => {
  //     setSelected([]);
  //   };
  // }, [slug, extra, value]);

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
export default FormMultiSelect;
