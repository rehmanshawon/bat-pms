import React, { Fragment, useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Form, Row, Button } from "antd";
import { FormItem } from "@/apsisEngine/common/formValidations";

import "@/apsisEngine/common/search/search.module.less";

const SearchComponent = ({
  slug,
  callFrom,
  searchConfig,
  setQuery,
  defaultSearchValues,
  ...props
}) => {
  const [inputFields, setInputFields] = useState([]);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [panels, setPanels] = useState();
  const [initialValues, setInitialValues] = useState();
  const [form] = Form.useForm();

  const handleFields = (select) => {
    //set state for this component
    setSelected(select);

    let valueArr = select.map(function (item) {
      return item.value.toString();
    });

    //update options and selected fields
    fieldFilter(panels, valueArr);
  };

  //filter for select option
  const fieldFilter = (data, selectItem) => {
    if (!data) return;

    let search_fields = data.search_fields ?? [];

    let optionArr = [];

    search_fields.forEach(function (item) {
      let optItem = {
        label: item.label_name,
        value: item.search_panel_detail_id.toString(),
      };

      optionArr.push(optItem);
    });

    //set option
    setOptions(optionArr);

    let selectedArr = [];
    search_fields.forEach(function (item) {
      let optItem = {
        label: item.label_name,
        value: item.search_panel_detail_id.toString(),
      };
      if (selectItem.includes(item.search_panel_detail_id.toString())) {
        selectedArr.push(optItem);
      }
    });

    //set selected
    setSelected(selectedArr);

    //show select fields
    showSelectFields(data, selectItem);
  };

  //show select fields
  const showSelectFields = (data, selectItem) => {
    let search_fields = data.search_fields;
    const renderSwitch = (param) => {
      switch (param) {
        case "WHERE LIKE":
          return "WH-LK-";
        case "WHERE EQUAL":
          return "WH-EQ-";
        case "WHERE TIME":
          return "WH-TM-";
        case "WHERE IN":
          return "WH-IN-";
        case "WHERE DATERANGE":
          return "WH-DR-";
        case "WHERE DATETIME":
          return "WH-DT-";
        case "WHERE RANGE":
          return "WH-RG-";
        case "HAVING LIKE":
          return "HV-LK-";
        case "HAVING EQUAL":
          return "HV-EQ-";
        case "HAVING IN":
          return "HV-IN-";
        case "HAVING DATERANGE":
          return "HV-DR-";
        case "HAVING DATETIME":
          return "HV-DT-";
        case "HAVING RANGE":
          return "HV-RG-";
        default:
          return "WH-LK-";
      }
    };

    //update fields
    let fields = [];
    for (const [i, cl] of search_fields.entries()) {
      let item = {
        input_type: cl?.input_type,
        label_name: cl?.label_name,
        input_name:
          data.prefix === true
            ? renderSwitch(cl?.input_operation_type) + cl?.input_name
            : cl?.input_name,
        value: cl?.input_default_val ?? "",
        element_column: String(cl?.column_space),
        input_class: cl?.input_class,
        input_id: cl?.input_id,
        dropdown_slug: cl?.dropdown_slug,
        multiple: String(cl?.multiple || 0),
        input_placeholder: cl?.input_placeholder,
        dropdown_options: cl?.dropdown_options,
        input_label: cl?.input_label,
        input_value: cl?.input_value,
        required: cl?.required,
        disabled: cl?.disabled,
      };

      const { input_name, value } = item;

      setInitialValues((prev) => {
        return { ...prev, [input_name]: value };
      });

      if (selectItem.includes(String(cl?.search_panel_detail_id))) {
        fields.push(item);
      }
    }

    setInputFields(fields);
  };

  /*
   * search fields and filter
   **************************************************************/
  // const [formState, setFormState] = useState({});

  //when click on filter button
  // const handleSearch = (e) => {
  //   if (inputFields && inputFields.length > 0) {
  //     let search_data = [];
  //     for (const key of Object.keys(inputFields)) {
  //       let item = {
  //         name: inputFields[key].input_field_name,
  //         value: formState[inputFields[key].input_field_name] || "",
  //       };
  //       search_data.push(item);
  //     }
  //     props.handleClick(search_data);
  //   } else {
  //     props.handleClick(false);
  //   }
  // };

  //when submit form
  const onFinish = (values) => {
    if (values) {
      let search_data = [];
      for (const [name, value] of Object.entries(values)) {
        search_data.push({ name: name, value: value ?? "" });
      }
      if (setQuery) setQuery(search_data);
    } else {
      if (setQuery) setQuery(false);
    }
  };

  //handle fields
  // const handleFormField = (field) => {
  //   const { name, value } = field[0];
  //   console.log("formField = " + name[0] + ":" + value);
  // };

  //handle event
  // const handleEvent = (event) => {
  //   const { name, value, selectedItem = "" } = event.target;
  //   console.log(name + "=" + value);
  //   console.log(selectedItem);
  // };

  //for external search
  const getSearchFields = async () => {
    const res = await fetchWrapper
      .post("search-panel", { slug: slug })
      .then((res) => {
        setPanels(res.data.data);
        let selectedValue =
          res.data.session_filter && res.data.session_filter !== ""
            ? res.data.session_filter.split(",").map((iNum) => iNum)
            : [];

        fieldFilter(res.data.data, selectedValue);
      })
      .catch((err) => console.log(err));
  };

  //when window load
  useEffect(() => {
    // form.setFieldsValue({ "WH-EQ-sc_product_in_stocks.warehouse_id": 39 });
    // onFinish(form.getFieldsValue());
    if (
      callFrom &&
      (callFrom == "grid" || callFrom == "master") &&
      searchConfig
    ) {
      let selectedValue =
        searchConfig.session_filter && searchConfig.session_filter !== ""
          ? searchConfig.session_filter.split(",").map((iNum) => iNum)
          : [];

      if (defaultSearchValues) {
        defaultSearchValues.forEach((defaultSearch) => {
          searchConfig.search_fields.forEach((field) => {
            if (field.input_name == Object.keys(defaultSearch)[0]) {
              field.input_default_val = Object.values(defaultSearch)[0];
            }
          });
        });
      }

      fieldFilter(searchConfig, selectedValue);
      setPanels(searchConfig);
    } else if (slug && slug != "") {
      getSearchFields();
    }
  }, []);

  // const validateMessages = {
  //   required: "${label} is required!",
  //   types: {
  //     email: "${label} is not a valid email!",
  //     number: "${label} is not a valid number!",
  //   },
  //   number: {
  //     range: "${label} must be between ${min} and ${max}",
  //   },
  // };

  useEffect(() => {
    if (defaultSearchValues) {
      form.submit();
    }
  }, [defaultSearchValues, selected]);

  return (
    <Fragment>
      <div className={`search-wrapper ${callFrom}`}>
        <div className="field-handler">
          <span className="options-label">
            <i className="fa fa-search"></i> Select filter:
          </span>

          <MultiSelect
            options={options}
            value={selected}
            onChange={handleFields}
            labelledBy="Select"
          />
        </div>

        {inputFields && inputFields.length > 0 && (
          <Form
            form={form}
            name="customized_form_controls"
            layout="horizontal"
            // validateMessages={validateMessages}
            onFinish={onFinish}
            // onFieldsChange={handleFormField}
            initialValues={initialValues}
          >
            <Row gutter={16}>
              {inputFields &&
                inputFields.map((field, index) => {
                  return (
                    <FormItem
                      key={`${field.input_name}_${index}`}
                      field={field}
                    />
                  );
                })}
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Filter Now
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </Fragment>
  );
};

export default SearchComponent;
