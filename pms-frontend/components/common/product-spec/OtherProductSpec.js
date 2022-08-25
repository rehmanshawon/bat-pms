import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form, Row, Col } from "antd";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class OtherProductSpec extends React.Component {
  changeHandler = (e, record) => {
    const { name, value } = e.target;
    record[name] = value;
    this.handleSave(record);
  };

  constructor(props) {
    const specsOtherData = props.specificationsOthers.map((item) => {
      if (!props.editMode) {
        return { ...item, editable: parseInt(0)};
      } else {
        return { ...item};
      }
      
    });
    const data = specsOtherData ?? [];
    

    super(props);
    this.columns = [
      {
        title: "Label",
        dataIndex: "spec_name",
        render: (text, record, index) => (
          <Input
          readOnly={record.editable === 1 ? false: true}
            type="text"
            name="spec_name"
            value={record.spec_name}
            autoComplete={"off"}
            onChange={(e) => this.changeHandler(e, record)}
          />
        ),
      },
      {
        title: "Value",
        dataIndex: "spec_value",
        render: (text, record, index) => (
          <Input
          readOnly={record.editable === 1 ? false: true}
            type="text"
            name="spec_value"
            value={record.spec_value}
            autoComplete={"off"}
            onChange={(e) => this.changeHandler(e, record)}
          />
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <Button size="small" className="deleteButton">
                <a>
                  <i className="fa fa-trash fs-5 text-white"></i>
                </a>
              </Button>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: data,
      count: data ? data.length : 0,
    };

    // if (!props.editMode) {
    //   fetchWrapper
    //     .post("productdata", {
    //       product_id: [props.id],
    //     })
    //     .then((response) => {
    //       if (!response.error) {
    //         const data = response.data[0];
    //         const specificationOther = data?.specificationOther.map((spec) => {
    //           return {
    //             ...spec,
    //             key: spec.product_spec_other_id,
    //             spec_ref: spec.spec_ref,
    //             spec_ref_id: spec.spec_ref_id,
    //             spec_name: spec.spec_name,
    //             spec_value: spec.spec_value,
    //           };
    //         });
    //         this.setState({
    //           dataSource: specificationOther ?? [],
    //           count: specificationOther ? specificationOther.length : 0,
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter((item) => item.key !== key);
    this.setState({
      dataSource: newData,
    });
    this.props.submitOtherSpec(newData);
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: Math.random().toString(),
      spec_ref_id: this.props.spec_ref_id,
      spec_ref: this.props.spec_ref,
      reference_id: this.props.reference_id,
      spec_name: null,
      spec_value: null,
      editable: parseInt(1)
    };

    const data = dataSource ? dataSource : [];
    this.setState({
      dataSource: [...data, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });

    this.props.submitOtherSpec(newData);
  };

  render() {
    const { dataSource } = this.state;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
        <Table
          className="smallTable"
          title={() => (
            <>
              <Row>
                <Col span={12}>
                  <p style={{ float: "left" }}>Other Specifications</p>
                </Col>
                <Col span={12}>
                  <Button
                    className="mb-1"
                    onClick={this.handleAdd}
                    type="primary"
                    size="small"
                  >
                    Add New
                  </Button>
                </Col>
              </Row>
            </>
          )}
          components={components}
          rowClassName={() => "editable-row"}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default OtherProductSpec;
