import { React, useState, useEffect, createRef } from "react";
import { useRouter } from "next/router";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { FileUpload } from "@/apsisEngine/common/formValidations";
import { swalSuccess, swalError } from "@/apsisEngine/helpers/helperService";
import { FormItem } from "@/apsisEngine/common/formValidations";
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Checkbox,
  Radio,
  Card,
  Table,
} from "antd";
import Item from "antd/lib/list/Item";

const CreateVendor = () => {
  const router = useRouter();
  const [createVendorForm] = Form.useForm();
  const [attachMentForm] = Form.useForm();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields, setSectionFields] = useState();
  const [sectionFieldsOwner, setSectionFieldsOwner] = useState();
  const [sectionFieldsBank, setSectionFieldsBank] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [fileNames, setFileNames] = useState();
  const [checkBoxData, setCheckBoxData] = useState([]);
  const [vendor_id, setVendorID] = useState(0);
  const [vendorType, setVendorType] = useState();
  const [vendorTypeDropDown, setVendorTypeDropDown] = useState();
  const [bank_id, setBankId] = useState(0);
  const [warning, setWarning] = useState(true);
  const [bankInfo, setBankinfo] = useState([
    {
      bank_id: 0,
      branch_id: "",
      account_no: "",
      account_type: "",
    },
  ]);
  const ref = createRef();

  const getFields = async (slug) => {
    await fetchWrapper
      .post("masterform/getformdata", {
        form_slug: slug,
      })
      .then((response) => {
        const { form_title, form_element } = response.data;
        setFormTitle(form_title);
        setSectionFields(form_element["sec_1"]);
        setSectionFieldsOwner(form_element["sec_2"]);
        setSectionFieldsBank(form_element["sec_3"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(async () => {
    getFields("create_vendor");
    await fetchWrapper
      .get("/productvsvendor/decisionlist")
      .then((res) => {
        setCheckBoxData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fileChange = (names, files) => {
    setSelectedFile(files);
    setFileNames(Object.values(names));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const params = new FormData();
    params.append("attach_config_slug", "create_vendor");
    params.append("reference_id", vendor_id);

    for (const key of Object.keys(selectedFile)) {
      params.append(`file_name[${key}]`, fileNames[key]);
      params.append("file", selectedFile[key]);
    }

    await fetchWrapper
      .post("attachment/upload", params, {
        "Content-Type": "multipart/form-data",
      })
      .then(function (response) {
        if (!response.error) {
          swalSuccess("File Uploaded Successfully!!!");
          formReset();
        } else {
          swalError("Something Wrong!!!");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const formReset = () => {
    if (ref.current) {
      ref.current.formReset();
    }
  };

  const makeObject = (item) => {
    const vendor_type = `${vendorTypeDropDown},${vendorType}`;
    const obj = {
      vendor_name: item.vendor_name,
      vendor_contact: item.vendor_contact,
      vendor_address: item.vendor_address,
      vendor_email: item.vendor_email,
      vendor_type: vendor_type,
      tin_number: item.tin_number,
      bin_number: item.bin_number,
      owner_name: item.owner_name,
      owner_contact: item.owner_contact,
      default_currency_code: "BDT",
      vendor_country: item.vendor_country,
      vendor_remarks: item.vendor_remarks,
      license_number: item.license_number,
      license_issue_date: item.license_issue_date,
      license_expiry_date: item.license_expiry_date,
      license_issue_place: item.license_issue_place,
      bank_data: bankInfo,
    };
    return obj;
  };

  const storeData = async (values) => {
    //console.log(values);
    const finalObject = makeObject(values);
    console.log(finalObject);

    await fetchWrapper
      .post("/vendor", finalObject)
      .then((res) => {
        if (!res.error) {
          swalSuccess("Vendor Created Successfully!!!");
          setVendorID(res.data);
          setWarning(false);
          handelReset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelCheckBox = (values) => {
    const vendor_type = values
      .map((element) => {
        return element;
      })
      .join(",");

    // vendor_type = `${vendorType},${vendor_type}`
    setVendorType(vendor_type);
  };
  const data = [
    {
      vendor_type_id: 1,
      vendor_type_name: "name1",
    },
    {
      vendor_type_id: 2,
      vendor_type_name: "name2",
    },
    {
      vendor_type_id: 3,
      vendor_type_name: "name3",
    },
    {
      vendor_type_id: 4,
      vendor_type_name: "name4",
    },
    {
      vendor_type_id: 5,
      vendor_type_name: "name5",
    },
    {
      vendor_type_id: 6,
      vendor_type_name: "name6",
    },
    {
      vendor_type_id: 7,
      vendor_type_name: "name7",
    },
    {
      vendor_type_id: 8,
      vendor_type_name: "namesvfsdfg",
    },
    {
      vendor_type_id: 9,
      vendor_type_name: "namesvfsdfg",
    },
    {
      vendor_type_id: 10,
      vendor_type_name: "namesvfsdfge",
    },
  ];

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let bankData = [...bankInfo];

    if (name == `bank_id[${index}]`) {
      bankData[index].bank_id = value;
      setBankinfo(bankData);
      setBankId(value);
    } else if (name == `branch_id[${index}]`) {
      bankData[index].branch_id = value;
      setBankinfo(bankData);
    } else if (name == `account_type[${index}]`) {
      bankData[index].account_type = value;
      setBankinfo(bankData);
    } else if (name == `account_no[${index}]`) {
      bankData[index].account_no = value;
      setBankinfo(bankData);
    } else if (e.target.name == "vendor_type") {
      setVendorTypeDropDown(value.toString());
    }
  };

  const addMoreBank = async () => {
    // const size = (await bankInfo.length) + 1;

    let object = {
      bank_id: 0,
      branch_id: "",
      account_no: "",
      account_type: "",
    };

    //console.log(bankInfo);
    setBankinfo((prev) => [...prev, object]);
  };
  const removeBank = (id) => {
    const updateArray = bankInfo.filter((item, index) => {
      return index !== id;
    });
    setBankinfo(updateArray);
  };

  const handelReset = () => {
    createVendorForm.resetFields();
  };

  console.log(vendor_id);

  return (
    <div className="main-wrap">
      <div className="card card-xl-stretch">
        <div className="card-header border-0 p-4 d-flex justify-content-between">
          <h3 className="card-title fw-bolder text-dark mb-0">
            {formTitle ?? ""}
          </h3>
        </div>
        <div className="card-body pt-2">
          <h4>Vendor Basic Info</h4>
          <Form form={createVendorForm} onFinish={storeData}>
            <Row gutter={16}>
              {sectionFields &&
                sectionFields.map((field) => {
                  return (
                    <FormItem
                      key={field.input_name}
                      field={field}
                      getEvent={(e) => handleChange(e)}
                    />
                  );
                })}
              <Col span={12}>
                <Checkbox.Group
                  style={{ width: "100%" }}
                  onChange={handelCheckBox}
                >
                  <Row>
                    {checkBoxData?.map((item, index) => {
                      return (
                        <Col key={index} span={8} style={{}}>
                          <Checkbox
                            value={`${item.vendor_type_id}`}
                            key={item.vendor_type_id}
                          >
                            {item.vendor_type_name}
                          </Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </Col>
            </Row>

            <div>
              <hr />
            </div>
            <div>
              <h4>Owner Info</h4>
              <Row gutter={16}>
                {sectionFieldsOwner &&
                  sectionFieldsOwner.map((field) => {
                    return (
                      <FormItem
                        key={field.input_name}
                        field={field}
                        // getEvent={(e) =>
                        //     handleChange(e)
                        // }
                      />
                    );
                  })}
              </Row>
            </div>

            <div>
              <hr />
            </div>

            <div>
              <h4>Bank Info</h4>

              {bankInfo &&
                bankInfo.map((item, index) => {
                  return (
                    <>
                      <Row>
                        <h6 style={{ marginTop: "0.5rem" }}>
                          Bank No: {index + 1}
                        </h6>
                        <Button
                          onClick={() => removeBank(index)}
                          style={{ marginLeft: "1rem" }}
                          type="primary"
                          size="small"
                          danger
                        >
                          Remove
                        </Button>
                      </Row>
                      <Row gutter={16}>
                        {sectionFieldsBank &&
                          sectionFieldsBank.map((field) => {
                            const customField = { ...field };

                            customField.input_name =
                              field.input_name + `[${index}]`;
                            // if (customField.input_name[index] == 'bank_id') {
                            //     //customField.input_value = item.bank_id;
                            //     console.log('MD Mesbahul Momin Sohan')
                            //     return (<FormItem
                            //         key={customField.input_name}
                            //         field={customField} />);
                            // }
                            if (
                              customField.input_name == `branch_id[${index}]`
                            ) {
                              //console.log(item.bank_id + `*********`);

                              customField.extra =
                                "config_bank_branchs.bank_id=" + item.bank_id;
                              return (
                                <FormItem
                                  key={customField.input_name}
                                  field={customField}
                                  getEvent={(e) => handleChange(e, index)}
                                />
                              );
                            } else {
                              return (
                                <FormItem
                                  key={customField.input_name}
                                  field={customField}
                                  getEvent={(e) => handleChange(e, index)}
                                />
                              );
                            }
                          })}
                      </Row>
                      <div>
                        <hr />
                      </div>
                    </>
                  );
                })}

              <div
                className="section-footer mt-2"
                style={{ marginBottom: "1rem" }}
              >
                <Button
                  type="primary"
                  size="small"
                  style={{}}
                  onClick={() => addMoreBank()}
                >
                  Add More Bank
                </Button>
              </div>
            </div>
            <div>
              <hr />
            </div>
            <div
              className="section-footer mt-2"
              style={{ marginBottom: "1rem" }}
            >
              <Button type="primary" htmlType="submit" size="small" style={{}}>
                Submit
              </Button>
            </div>
            {warning === true ? (
              <p style={{ color: "red" }}>
                ***Please Submit Before uploading files***
              </p>
            ) : null}
          </Form>
          <div style={{ minHeight: "400px", position: "relative", zIndex: 1 }}>
            <div className="container">
              <form form={attachMentForm} name="attachForm" onSubmit={onSubmit}>
                <FileUpload
                  ref={ref}
                  onChange={fileChange}
                  upload_btn={false}
                  reference="create_vendor"
                  reference_id={vendor_id}
                />

                <div className="form-group mt-2">
                  <button className="btn btn-sm btn-primary mr-2" type="submit">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVendor;
