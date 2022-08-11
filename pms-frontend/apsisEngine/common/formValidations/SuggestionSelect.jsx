/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";

export const SuggestionSelect = ({
  value,
  onChange,
  getEvent,
  name,
  slug,
  placeholder,
  extra,
  ...rest
}) => {
  //state declaration
  const [selectedValue, setSelectedValue] = useState();

  //custom component Debounce Select
  const DebounceSelect = ({
    fetchOptions,
    debounceTimeout = 800,
    ...props
  }) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = React.useRef(0);
    const debounceFetcher = React.useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      };

      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
    );
  }; // Usage of DebounceSelect

  //Fetch Data from API
  const fetchOptionsList = async (key) => {
    return await fetchWrapper
      .post("autocomplete/autocompletedata", {
        dropdown_slug: slug,
        requested_text: key ?? "",
        // extra: extra ?? "",
      })
      .then((response) =>
        response.data.map((item) => ({
          label: `${item.label}`,
          value: item.value,
        }))
      );
  };

  //when change input
  const handleChange = (newValue) => {
    //set selected value
    setSelectedValue(newValue);

    if (onChange) {
      onChange(newValue?.value ?? "");
    }

    if (getEvent) {
      const target = {
        name: name,
        value: newValue,
        rules: { required: rest?.required },
      };
      getEvent({ target });
    }
  };

  //initial state update
  useEffect(async () => {
    if (value && (!selectedValue || Object.keys(selectedValue).length === 0)) {
      await fetchOptionsList(value).then((response) => {
        const selectedLabelInValue = response.filter((item) => {
          if (typeof value === "object") {
            return item.value in value || item.label in value;
          } else {
            return (
              item.value.toString().toLowerCase() ==
                value.toString().toLowerCase() ||
              item.label.toString().toLowerCase() ==
                value.toString().toLowerCase()
            );
          }
        });
        setSelectedValue(selectedLabelInValue);
      });
    }
  }, [value]);

  return (
    <DebounceSelect
      showSearch
      allowClear
      value={selectedValue}
      placeholder={placeholder ?? "Select"}
      fetchOptions={fetchOptionsList}
      onChange={handleChange}
      style={{
        width: "100%",
      }}
    />
  );
};

export default SuggestionSelect;
