import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Select, Button, Popconfirm, Form, Row, Col } from "antd";
import OtherProductSpec from "./OtherProductSpec";
import { FormItem } from "@/apsisEngine/common/formValidations";

//array to Object conversion
const stringToObjectArray = (string) => {
  const data = string.split(",");
  let result = [];
  for (let i = 0; i < data.length; ++i) {
    let obj = {};
    obj["label"] = data[i];
    obj["value"] = data[i];
    result.push(obj);
  }
  return JSON.stringify(result);
};

const RequisitionProductSpec = (props) => {
  const [data, setData] = useState([]);
  const { TextArea } = Input;

  const changeHandler = (e, record) => {
    const { name, value } = e.target;
    record[name] = value;
    handleSave(record);
  };

  useEffect(() => {
    const specs = props.specifications ?? [];
    if (!props.editMode) {
      const specsData = specs.map((item) => {
        return { ...item, editable: parseInt(0) };
      });
      setData(specsData);
    } else {
      const specsData = specs.map((item) => {
        return { ...item };
      });
      setData(specsData);
    }
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "spec_name",
      key: "spec_name",
      width: "25%",
      render: (text, record, _index) => (
        <Input
          readOnly={record.editable == 0 ? true : false}
          className={record.editable == 0 ? "ant-input-disabled" : ""}
          style={{ color: '#000' }}
          type="text"
          name="spec_name"
          value={text}
          autoComplete={"off"}
          onChange={(e) => changeHandler(e, record)}
        />
      ),
    },
    // {
    //   title: "Unit",
    //   width: "25%",
    //   dataIndex: "spec_unit",
    //   key: "spec_unit",

    //   render: (text, record, _index) => (
    //     <Input
    //       autoComplete="off"
    //       readOnly={record.editable == 0 ? true : false}
    //       className={record.editable == 0 ? "ant-input-disabled" : ""}
    //       type="text"
    //       min={0}
    //       name="spec_unit"
    //       value={record.spec_unit}
    //       onChange={(e) => changeHandler(e, record)}
    //     />
    //   ),
    // },
    {
      title: "Standard",
      width: "25%",
      dataIndex: "spec_standard",
      key: "spec_standard",
      render: (text, record, _index) => (
        <Input
          readOnly={record.editable == 0 ? true : false}
          className={record.editable == 0 ? "ant-input-disabled" : ""}
          autoComplete={"off"}
          type="text"
          name="spec_standard"
          value={text}
          addonAfter={record.spec_unit}
          onChange={(e) => changeHandler(e, record)}
        />
      ),
    },
    // {
    //   title: "Request Value",
    //   dataIndex: "spec_value",
    //   key: "spec_value",
    //   width: "25%",
    //   render: (text, record, _index) => {
    //     const [form] = Form.useForm();
    //     form.setFieldsValue({ spec_value: record.spec_value });
    //     return (
    //       <Form form={form}>
    //         <FormItem
    //           field={{
    //             input_name: "spec_value",
    //             input_type: record.spec_input_type,
    //             element_column: 24,
    //             dropdown_options:
    //               record.spec_input_type == "dropdown" &&
    //               record.dropdown_options
    //                 ? stringToObjectArray(record.dropdown_options)
    //                 : "",
    //           }}
    //           getEvent={(e) => changeHandler(e, record)}
    //         />
    //       </Form>
    //     );
    //   },
    // },
    // {
    //   title: "Action",
    //   width: "5%",
    //   dataIndex: "action",
    //   render: (_, record) =>
    //     data.length >= 1 ? (
    //       <Popconfirm
    //         title="Sure to delete?"
    //         onConfirm={() => handleDelete(record.key)}
    //       >
    //         <Button size="small" className="deleteButton">
    //           <a>
    //             <i className="fa fa-trash fs-5 text-white"></i>
    //           </a>
    //         </Button>
    //       </Popconfirm>
    //     ) : null,
    // },
  ];

  // if (!props.editMode) {
  //   fetchWrapper
  //     .post("productdata", {
  //       product_id: [props.id],
  //     })
  //     .then((response) => {
  //       if (!response.error) {
  //         const data = response.data[0];
  //         const specifications = data?.specification.map((spec) => {
  //           return {
  //             ...spec,
  //             key: spec.product_specification_id,
  //             spec_ref: spec.spec_ref,
  //             spec_ref_id: spec.spec_ref_id,
  //             spec_name: spec.spec_name,
  //             spec_unit: spec.spec_unit,
  //             spec_standard: spec.spec_standard,
  //             spec_value: spec.spec_value,
  //           };
  //         });
  //         setData(specifications ?? []);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    props.submitGeneralSpec(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: Math.random().toString(),
      spec_ref_id: props.spec_ref_id,
      spec_ref: props.spec_ref,
      reference_id: props.reference_id,
      spec_name: null,
      spec_unit: null,
      spec_standard: null,
      spec_value: null,
      editable: parseInt(1),
    };
    setData([...data, newData]);
  };

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setData(newData);

    props.submitGeneralSpec(newData);
  };
  return (
    <>
      <div>
        <Table
          className="smallTable"
          style={{ marginBottom: "10px" }}
          // title={() => (
          //   <>
          //     <Row>
          //       <Col span={24}>
          //         <Button
          //           className="mb-1 pull-right"
          //           onClick={handleAdd}
          //           type="primary"
          //           size="small"
          //         >
          //           Add New
          //         </Button>
          //       </Col>
          //     </Row>
          //   </>
          // )}
          rowClassName={() => "editable-row"}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        {/* <OtherProductSpec
          specificationsOthers={props.specificationsOthers}
          submitOtherSpec={props.submitOtherSpec}
          spec_ref_id={props.spec_ref_id}
          spec_ref={props.spec_ref}
          reference_id={props.reference_id}
          editMode={props.editMode}
        /> */}
      </div>
    </>
  );
};

export default RequisitionProductSpec;
