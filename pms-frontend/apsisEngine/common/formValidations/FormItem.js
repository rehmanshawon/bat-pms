import React, { useState, useEffect } from "react";
import { Form, Col } from "antd";
import {
  FormInput,
  FormInputNumber,
  FormTextArea,
  FormDatePicker,
  FormTimePicker,
  FormRangePicker,
  FormSelect,
  FormMultiSelect,
  SuggestionSelect,
  DropdownGrid,
  FormTextEditor,
  FormCheckbox,
  FormRadio,
  FormCascader,
  FormTags,
  FormMonthYearRange,
} from "./index";

export const FormItem = ({
  rules,
  labelCol,
  wrapperCol,
  field,
  disabled,
  ...rest
}) => {
  const [validRules, setValidationRules] = useState([]);
//console.log(field);
  const generateRules = () => {
    if (rules) {
      setValidationRules(rules);
    } else if (field.rules) {
      let fieldRules = JSON.parse(field.rules);
      setValidationRules(fieldRules);
    } else if (field.required) {
      let fieldRules = [
        { required: true, message: `${field.label_name??'Field'} is required!` },
      ];
      if (field.input_type == "email") {
        fieldRules.push({
          type: "email",
          message: `${field.label_name} is not valid E-mail!`,
        });
      }
      if (field.input_type == "tel") {
        fieldRules.push({  
          message: `${field.label_name} is not valid Phone Number!`,
          pattern: new RegExp(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
        });
      }
      if (field.input_type == "number") {
        fieldRules.push({
          type: "number",
          message: `${field.label_name} is not a valid number!`,
        });
        if(field.input_expression===`^[0-9]*\\.?[0-9]{1,2}$`){
          fieldRules.push({
          message: `${field.label_name} should be two decimal places`,
          pattern: new RegExp(field.input_expression)
          });
        }
      }
      setValidationRules(fieldRules);
    } else {
      setValidationRules([]);
    }
  };
  useEffect(() => {
    generateRules();
  }, [field]);

  //render data
  const renderSwitch = (param) => {
    switch (param) {
      case "text":
      case "tel":
      case "email":
        return (
          <FormInput
            name={field.input_name}
            type={param}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "number":
        return (
          <FormInputNumber
            name={field.input_name}
            type={param}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "textarea":
        return (
          <FormTextArea
            name={field.input_name}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "editor":
        return (
          <FormTextEditor
            name={field.input_name}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "date":
      case "month":
      case "year":
        return (
          <FormDatePicker
            name={field.input_name}
            type={param}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "time":
        return (
          <FormTimePicker
            name={field.input_name}
            type={param}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "datetime":
        return (
          <FormDatePicker
            name={field.input_name}
            type="date"
            showTime={true}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "date_range":
        return (
          <FormRangePicker
            name={field.input_name}
            showTime={true}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "month_range":
      case "year_range":
        return (
          <FormMonthYearRange
            type={param}
            name={field.input_name}
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "select":
      case "dropdown":
        return (
          <FormSelect
            name={field?.input_name}
            slug={field?.dropdown_slug}
            dropdownOptions={field?.dropdown_options}
            placeholder={field.input_placeholder ?? ""}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
      case "cascader":
        return (
          <FormCascader
            name={field?.input_name}
            slug={field?.dropdown_slug}
            dropdownOptions={field?.dropdown_options}
            placeholder={field.input_placeholder ?? ""}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
      case "tags":
        return (
          <FormTags
            name={field?.input_name}
            slug={field?.dropdown_slug}
            dropdownOptions={field?.dropdown_options}
            placeholder={field.input_placeholder ?? ""}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "multi_select":
        return (
          <FormMultiSelect
            name={field?.input_name}
            slug={field?.dropdown_slug}
            dropdownOptions={field?.dropdown_options}
            placeholder={field.input_placeholder ?? ""}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "suggestion":
      case "autocomplete":
        return (
          <SuggestionSelect
            name={field?.input_name}
            slug={field?.dropdown_slug}
            placeholder={field.input_placeholder ?? ""}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );

      case "dropdown_grid":
        return (
          <DropdownGrid
            name={field?.input_name}
            slug={field?.dropdown_slug}
            label_name={field?.label_name}
            placeholder={field.input_placeholder ?? ""}
            is_multiple={field.multiple ? true : false}
            labelKey={field.input_label ?? false}
            valueKey={field.input_value ?? false}
            displaySelected={true}
            extra={field.extra ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
      case "checkbox":
        return (
          <FormCheckbox
            name={field.input_name ?? "field_name"}
            required={field.required ?? false}
            type={field.input_type}
            label={field.input_label}
            direction={field.direction ?? "horizontal"}
            slug={field?.dropdown_slug}
            checkBoxOptions={field.dropdown_options}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
      case "radio":
        return (
          <FormRadio
            name={field.input_name ?? "field_name"}
            required={field.required ?? false}
            type={field.input_type}
            label={field.input_label}
            direction={field.direction ?? "horizontal"}
            slug={field?.dropdown_slug}
            radioOptions={field.dropdown_options}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
      default:
        return (
          <FormInput
            name={field.input_name}
            type="text"
            placeholder={field.input_placeholder ?? ""}
            disabled={disabled ? disabled : field.disabled}
            {...rest}
          />
        );
    }
  };

  return (
    <Col span={field.element_column ?? 6}>
      <Form.Item
        name={field.input_name}
        label={field.label_name ?? false}
        rules={validRules}
        labelCol={labelCol ?? { span: 24 }}
        wrapperCol={wrapperCol ?? { span: 24 }}
      >
        {renderSwitch(field.input_type)}
      </Form.Item>
    </Col>
  );
};

export default FormItem;
