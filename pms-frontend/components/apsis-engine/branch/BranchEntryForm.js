import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import FormFooter from "@/components/common/FormFooter";
import {
  AssetImage,
  BreakLine,
  ShowInfo,
} from "@/components/styles/FixedAsset";
import {
  FormInput,
  FormItem,
  FormSelect,
  swalError,
  swalSuccess,
} from "@/apsisEngine/common/formValidations";
import { Form, Row, Col, Input, Card, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
const { Title } = Typography;

const BranchEntryForm = ({ editMode, id }) => {
  const [form] = Form.useForm();
  const [defaultValues, setDefaultValues] = useState();
  const router = useRouter();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields, setSectionFields] = useState();
  const [formState, setFormState] = useState({});
  const [geoLocationData, setGeoLocationData] = useState({});

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "branch_form",
    });
    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields(form_element["sec_1"]);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const stateChange = (event) => {
    const { name, value } = event.target;
    if (name == "geo_location_id") {
      getGeoLocation(value);
    }
  };

  const getGeoLocation = async (id) => {
    let response = await fetchWrapper.get(
      "/dispatch/parcel/geo-location/" + id
    );
    if (!response.error) {
      console.log(response.data);
      setGeoLocationData(response.data[0]);
    }
  };

  const handleSubmit = (values) => {
    if (editMode) {
      updateData(values);
    } else {
      storeData(values);
    }
  };

  const storeData = (values) => {
    let payLoad = { ...values };

    if (is_zone) {
      payLoad.is_zone = 1;
      payLoad.zone_id = null;
    } else {
      if (formState.zone_id) {
        payLoad.is_zone = 0;
        payLoad.zone_id = formState.zone_id;
      } else {
        swalError("Please Insert Zone!");
      }
    }

    fetchWrapper
      .post("branch", payLoad)
      .then((response) => {
        if (!response.error) {
          swalSuccess(response.message);
          router.push({
            pathname: `/apsis-engine/branch`,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateData = (values) => {
    let payLoad = { ...values };
    let id = defaultValues.branch_id;

    if (is_zone) {
      payLoad.is_zone = 1;
      payLoad.zone_id = null;
      fetchWrapper
        .patch("branch/" + id, payLoad)
        .then((response) => {
          if (!response.error) {
            swalSuccess(response.message);
            router.push({
              pathname: `/apsis-engine/branch`,
            });
          } else {
            swalError(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (formState.zone_id) {
        payLoad.is_zone = 0;
        payLoad.zone_id = formState.zone_id;
        fetchWrapper
          .patch("branch/" + id, payLoad)
          .then((response) => {
            if (!response.error) {
              swalSuccess(response.message);
              router.push({
                pathname: `/apsis-engine/branch`,
              });
            } else {
              swalError(response.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        swalError("Please Insert Zone!");
      }
    }
  };

  const getBranchData = async (id) => {
    let response = await fetchWrapper.get("/branch/" + id);
    if (!response.error) {
      console.log(response.data);
      setDefaultValues(response.data);
      setDefaultValues({
        ...defaultValues,
        // status: response.data.status == 1 ? "Active" : "Inactive",
        branch_id: response.data.branch_id,
        branch_code: response.data.branch_code,
      });
      setFormState({
        is_zone: response.data.is_zone == 0 ? false : true,
        zone_id: response.data.zone_id,
      });
      if (response.data.geo_location_id) {
        getGeoLocation(response.data.geo_location_id);
      }
    }
  };

  const [is_zone, setIsZone] = useState(false);

  const isZone = () => {
    setIsZone(!is_zone);
  };

  //get on load data
  useEffect(() => {
    getFields();
  }, []);

  //get on load data
  useEffect(() => {
    if (id && editMode) {
      getBranchData(id);
    }
  }, [id, editMode]);

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    } else {
      form.resetFields();
    }
  }, [form, defaultValues]);

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch">
          <div className="master_grid">
            <div className="title_area">
              <div className="gridTitle">
                <h6>
                  <span className="fa fa-file-text mr-2"></span>{" "}
                  {editMode ? "Branch Edit Form" : "Branch Entry Form"}
                </h6>
              </div>
              <div className="gridTitle">
                <h6 className="d-flex justify-content-between">
                  <>
                    {editMode && defaultValues ? (
                      <span> Code : {defaultValues.branch_code} </span>
                    ) : (
                      <></>
                    )}
                  </>
                </h6>
              </div>
            </div>

            <Form form={form} onFinish={handleSubmit}>
              <div className="form-section">
                <div className="section-body">
                  <div className="section-body p-3">
                    <Row gutter={16}>
                      {sectionFields &&
                        sectionFields.map((field, i) => (
                          <FormItem
                            key={field.input_name}
                            field={field}
                            getEvent={stateChange}
                          />
                        ))}

                      {/* <div className="pl-5 pt-3">
                        <Card title="Geo Location Info" style={{ width: 500 }}>
                          <p>Card content</p>
                          <p>Card content</p>
                          <p>Card content</p>
                        </Card>
                      </div> */}

                      <div className="main-wrap mt-3 pl-5">
                        <div className="card card-xl-stretch">
                          <div className="master_grid">
                            <div className="title_area">
                              <div className="gridTitle">
                                <h6 style={{ fontWeight: "bold" }}>
                                  Geo Location Info
                                </h6>
                              </div>
                            </div>
                            <Card
                              bordered={false}
                              style={{
                                border: "0px solid #dbdada",
                                minHeight: "122px",
                                width: "500px",
                              }}
                              className="pl-2"
                            >
                              <div className="row justify-content-start pl-2">
                                <table width={"100%"} border="0">
                                  <tr>
                                    <td
                                      width="50%"
                                      style={{ border: "0px solid" }}
                                    >
                                      <Title
                                        level={5}
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Division
                                      </Title>
                                      <p style={{ fontSize: "12px" }}>
                                        {geoLocationData.division}
                                      </p>
                                    </td>
                                    <td
                                      width="50%"
                                      style={{ border: "0px solid" }}
                                    >
                                      <Title
                                        level={5}
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        District
                                      </Title>
                                      <p style={{ fontSize: "12px" }}>
                                        {geoLocationData.district}
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      width="50%"
                                      style={{ border: "0px solid" }}
                                    >
                                      <Title
                                        level={5}
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Thana
                                      </Title>
                                      <p style={{ fontSize: "12px" }}>
                                        {geoLocationData.thana}
                                      </p>
                                    </td>
                                    <td
                                      width="50%"
                                      style={{ border: "0px solid" }}
                                    >
                                      <Title
                                        level={5}
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Union
                                      </Title>
                                      <p style={{ fontSize: "12px" }}>
                                        {geoLocationData.union}
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>

                      <Col className="col-lg-12">
                        <Col className="col-lg-4">
                          <>
                            <span style={{ color: "red" }}>*</span>
                            <input
                              style={{ marginLeft: 7, marginRight: 7 }}
                              type="checkbox"
                              checked={is_zone}
                              name="is_zone"
                              onChange={isZone}
                            />

                            <label className="col-form-label inputForm">
                              Is Zonal Branch
                            </label>
                          </>
                        </Col>

                        {!is_zone ? (
                          <Col className="col-lg-4">
                            <label
                              className="col-form-label inputForm"
                              style={{ marginRight: 20 }}
                            >
                              <span style={{ color: "red" }}>*</span> Zone
                            </label>

                            <FormSelect
                              key="zone_id"
                              name="zone_id"
                              value={formState.zone_id}
                              slug="zone_list"
                              //onChange={stateChange}
                              getEvent={handleChange}
                              style={{ width: "100%" }}
                            />
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-2">
                <FormFooter
                  backLink="/apsis-engine/users"
                  submitText={editMode ? "Update" : "Save"}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchEntryForm;
