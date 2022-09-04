import React, { useState, useEffect, Fragment } from "react";
import Select from "react-select";
import { Button, Form, Row, Col, Input, Checkbox, Radio, Card } from "antd";
import { FormSelect } from "@/apsisEngine/common/formValidations";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { useRouter } from "next/router";
import { swalSuccess, swalError } from "@/apsisEngine/helpers/helperService";

const CapprovalForm = (props) => {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState();
  const [sectionFields, setSectionFields] = useState();
  const [value, setValue] = useState("");
  const [arrSize, setArraySize] = useState(1);
  const [makerUser, setMakerUser] = useState(0);
  const [stepName, seStepName] = useState("");
  const [priority, setPriority] = useState([]);
  const [refEvent, setRefEvent] = useState({});
  const [selectUsers, setSelected] = useState([]);
  const [aboveChecked, setAboveChecked] = useState(false);

  const [Data1, setData1] = useState([]);
  const [array, setArray] = useState([
    {
      step_number: 1,
      users: [],
      step_name: "",
      manage_by: "",
      same_sort: 0,
      approve_priority: "",
      above_checked: false,
    },
  ]);
  const [manageBy, setManageBY] = useState([]);
  const [dlmData, setDlamData] = useState([]);
  const [delegation, setDelegation] = useState([]);

  //form value state
  const [formState, updateFormState] = useState();

  const getFields = async () => {
    let response = await fetchWrapper.post("masterform/getformdata", {
      form_slug: "approval_form",
    });

    if (response.data) {
      const { form_title, form_element } = response.data;
      setFormTitle(form_title);
      setSectionFields(form_element["sec_1"]);
    }
  };

  const stateChange = (event) => {
    //get data form event
    const { name, value } = event.target;
    updateFormState({ ...formState, [name]: value });
  };

  const makeObject = () => {
    if (delegation.delegation_type === "DLM") {
      var post = {
        delegation_for: delegation.slug,
        approve_type: "DLM",
        ref_event: refEvent,
        DLM: Data1,
      };

      return post;
    } else if (delegation.delegation_type === "MC") {
      var post = {
        delegation_for: delegation.slug,
        approve_type: "MC",
        ref_event: refEvent,
        maker_checker: {
          type: value,
          user_id: makerUser,
        },
      };
      return post;
    } else if (delegation.delegation_type === "WF") {
      var post = {
        delegation_for: delegation.slug,
        approve_type: "WF",
        ref_event: refEvent,
        process_flow: array,
      };
      return post;
    }
  };

  //submit Handler
  const submitHandler = async () => {
    const finalData = makeObject();
    console.log(finalData);
    await fetchWrapper
      .post("/delegation-conf/delegation-submission", finalData)
      .then((res) => {
        //alert(res.message);
        if (!res.error && res.message == "Submission Successfull!!!") {
          swalSuccess(`${res.message}`);
        } else if (res.message == "Data Already Exist!!!") {
          swalError(`${res.message}`);
        } else {
          swalError(`${res.message}`);
        }
        router.push("/apsis-engine/delegation/config");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const testChange = () => {
  //     console.log(formState);
  //     if (formState && formState.operational_type == "process_flow") {
  //         alert("process_flow");
  //     }
  // };

  useEffect(() => {
    getFields();
  }, []);

  // useEffect(() => {
  //     testChange();
  // }, [formState]);

  useEffect(async () => {
    await fetchWrapper
      .post("dropdown/dropdowndata", {
        dropdown_slug: "user_list",
        external_data: "",
      })
      .then((response) => {
        const temp = response.data.map((item) => {
          return {
            ...item,
            decline_logic: "",
            max_limit: 0,
            limit_type: "Maximum",
            must_approve: 0,
          };
        });
        setSelected(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const function1 = async () => {
    await fetchWrapper
      .get("delegation-conf/dlms")
      .then((res) => {
        //console.log(res.data);
        setDlamData(res.data);

        let retriveData = res.data;
        var tempArray = [];
        retriveData.forEach((element) => {
          let tempObject = {
            dlm_steps: element.dlm_steps,
            max_limit: 0,
            limit_type: "Maximum",
            order_no: element.order_no,
          };
          tempArray.push(tempObject);
        });
        setData1(tempArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const function2 = async () => {
    await fetchWrapper
      .get(`delegation-conf/delegation-set/${router.query.code}`)
      .then((res) => {
        //setDelegation({ ...res.data, delegation_type: "DLM" });
        let ref_event = {};
        res.data.ref_event_slug.forEach((item) => {
          ref_event[item.split("_")[0]] = "";
        });
        setRefEvent(ref_event);
        setDelegation(res.data);
        //console.log(ref_event);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    function1();
    function2();
  }, []);

  const declineLogicOptions = [
    { id: 1, value: "Initiator", label: "Initiator" },
    { id: 2, value: "Previous Approval", label: "Previous Approval" },
  ];

  const manageByOption = [
    { id: 1, value: "Hierarchy", label: "Hierarchy" },
    { id: 2, value: "Sorting", label: "Sorting " },
    { id: 3, value: "Limit", label: "Limit" },
  ];

  const minorityOption = [
    { id: 1, value: "Majority", label: "Majority" },
    { id: 2, value: "Minority", label: "Minority" },
    { id: 3, value: "All", label: "All" },
  ];

  const handelRadio = (e) => {
    setValue(e);
  };

  const addMoreStep = async () => {
    //setArraySize(arrSize + 1);
    const length = (await array.length) + 1;

    let object = {
      step_number: length,
      users: [],
      step_name: stepName,
      manage_by: manageBy.value,
      same_sort: 0,
      approve_priority: priority.value,
      above_checked: false,
    };

    setArray((prev) => [...prev, object]);
  };

  const handelRemove = (id) => {
    const updateArray = array.filter((item, index) => {
      return index !== id;
    });

    setArray(updateArray);
  };

  const selectChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    let data = refEvent;
    if (name in data) {
      setRefEvent((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  // console.log(refEvent);

  const setSpecificUser = (e) => {
    setMakerUser(e.target.value);
  };

  const inputChange = (e, item) => {
    item.max_limit = parseInt(e.target.value);

    const exist = Data1.find((x) => x.dlm_steps === item.dlm_steps);

    if (exist) {
      setData1(
        Data1.map((x) =>
          x.dlm_steps === item.dlm_steps
            ? { ...exist, max_limit: item.max_limit }
            : x
        )
      );
    } else {
      setData1(...Data1);
    }
  };

  const setAbove = (e, item) => {
    if (e.target.checked) {
      item.limit_type = "Above";
    } else {
      item.limit_type = item.limit_type;
    }

    const exist = Data1.find((x) => x.dlm_steps === item.dlm_steps);

    if (exist) {
      setData1(
        Data1.map((x) =>
          x.dlm_steps === item.dlm_steps
            ? { ...exist, limit_type: item.limit_type }
            : x
        )
      );
    } else {
      setData1(...Data1);
    }
  };

  const selectUser = (e, index) => {
    let temp = [...e];
    let data = [...array];
    const temp2 = temp.map((item) => {
      return {
        ...item,
        key: Math.floor(Math.random() * 100),
      };
    });
    data[index].users = temp2;
    setArray(data);
  };

  const stepNameChange = (e, item, index) => {
    item.step_name = e.target.value;

    const exist = array.find((x) => x.step_number === item.step_number);

    if (exist) {
      setArray(
        array.map((x) =>
          x.step_number === item.step_number
            ? { ...exist, step_name: item.step_name }
            : x
        )
      );
    } else {
      setArray(...array);
    }
  };
  const setManageByValue = (e, item) => {
    item.manage_by = e.value;

    const exist = array.find((x) => x.step_number === item.step_number);

    if (exist) {
      setArray(
        array.map((x) =>
          x.step_number === item.step_number
            ? { ...exist, manage_by: item.manage_by }
            : x
        )
      );
    } else {
      setArray(...array);
    }
  };
  const setIsSame = (e, item) => {
    //console.log(e.target.checked);
    if (e.target.checked) {
      item.same_sort = 1;
    } else {
      item.same_sort = 0;
    }

    const exist = array.find((x) => x.step_number === item.step_number);

    if (exist) {
      setArray(
        array.map((x) =>
          x.step_number === item.step_number
            ? { ...exist, same_sort: item.same_sort }
            : x
        )
      );
    } else {
      setArray(...array);
    }
  };

  const setPriorityValue = (e, item) => {
    item.approve_priority = e.value;

    const exist = array.find((x) => x.step_number === item.step_number);

    if (exist) {
      setArray(
        array.map((x) =>
          x.step_number === item.step_number
            ? { ...exist, approve_priority: item.approve_priority }
            : x
        )
      );
    } else {
      setArray(...array);
    }
  };

  const setDeclineLogic = (e, us) => {
    us.decline_logic = e.value;
    // us.map((v) => (v.declineLogic = us.declineLogic));
  };

  const setLimitValue = (e, us) => {
    us.max_limit = parseInt(e.target.value);
  };

  const handelMustAbove = (e, index, i) => {
    let exist = [...array];
    // console.log(item);
    console.log(e.target.name, index, i, exist);

    if (e.target.checked == true && index == e.target.name - 1) {
      // setAboveChecked(true);
      exist[index].above_checked = true;
      exist[index].users[i].limit_type = "Above";
      setArray(exist);
    } else if (e.target.checked == false && index == e.target.name - 1) {
      exist[index].above_checked = false;
      exist[index].users[i].limit_type = "Maximum";
      setArray(exist);
    }
  };

  const setMustAbove = (e, index, i) => {
    let exist = [...array];
    let value;
    if (e.target.checked) {
      value = 1;
    } else {
      value = 0;
    }
    exist[index].users[i].must_approve = value;
    setArray(exist);
  };
  // const selectMutiUser = async(e, index) => {
  //   console.log(e.target.selectedItem);
  //   console.log('##################')
  //   console.log(array);
  //   let temp = [...e.target.selectedItem];
  //    const temp2 = temp.map((item) => {
  //     return {
  //       ...item,
  //       decline_logic: "",
  //       max_limit: 0,
  //       must_approve: 0,
  //     };
  //   });
  //   let data = [...array];
  //   data[index].users = temp2;
  //   setArray(data);
  // };

  //console.log(array);
  return (
    <div className="main-wrap">
      <div className="card card-xl-stretch">
        <div className="card-header border-0 p-4 d-flex justify-content-between">
          <h3 className="card-title fw-bolder text-dark mb-0">
            {formTitle ?? ""}
          </h3>
        </div>
        <div className="card-body pt-2">
          <Form>
            <div className="form-section">
              <h5 className="section-title"> </h5>
              <div className="section-body">
                <div className="row">
                  <Row>
                    <Col span={6}>
                      <Card
                        size="small"
                        title="Deligation For"
                        style={{ width: 250 }}
                        className="approval-card"
                      >
                        <p>
                          <b>{delegation.id_for}</b>
                        </p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card
                        size="small"
                        title="Approval Type"
                        style={{
                          width: 250,
                          marginLeft: "1rem",
                        }}
                        className="approval-card"
                      >
                        <p>
                          <b>{delegation.delegation_type}</b>
                        </p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: "1rem" }}>
                    {delegation.ref_event_slug?.map((item,i) => (

                      <Col key={i} span={6} style={{}}>
                        <Col span={24}>
                          <label className={`form-label`}>
                            <b> {`Select ${item.split("_")[0]}`} </b>
                          </label>
                        </Col>
                        <Col span={24}>
                          <FormSelect
                            name={item.split("_")[0]}
                            slug={item}
                            className='form-control'
                            getEvent={selectChange}
                          />
                        </Col>
                        <Col span={24}>
                          {refEvent[item.split("_")[0]] == "" ? (
                            <label>
                              <b
                                style={{
                                  color: "red",
                                }}
                              >{`Please Select ${item.split("_")[0]}`}</b>
                            </label>
                          ) : null}
                        </Col>
                      </Col>

                    ))}
                  </Row>

                  <Row>
                    <Col span={24}>
                      {delegation.delegation_type === "DLM" ? (
                        <>
                          <Row
                            style={{
                              marginTop: "1rem",
                            }}
                          >
                            <Col
                              span={5}
                              style={{
                                marginLeft: "1rem",
                              }}
                            >
                              <b>Name</b>
                            </Col>
                            <Col
                              span={6}
                              style={{
                                marginLeft: "",
                                textAlign: "center",
                              }}
                            >
                              <b>Limit</b>
                            </Col>
                            <Col
                              style={{
                                textAlign: "",
                                marginLeft: "3.5rem",
                              }}
                            >
                              <b>Above?</b>
                            </Col>
                          </Row>
                          <Col span={15}>
                            <hr />
                          </Col>
                        </>
                      ) : null}
                      <Row>
                        {Data1.length !== 0 &&
                          delegation.delegation_type === "DLM"
                          ? Data1.map((item, index) => (
                            <>
                              <Col span={24}>
                                <Row
                                  style={{
                                    marginBottom: "1rem",
                                    marginLeft: "1rem",
                                  }}
                                >
                                  <Col span={5}>
                                    <b>{item.dlm_steps.toUpperCase()}</b>
                                  </Col>
                                  <Col
                                    cpan={6}
                                    style={{
                                      marginLeft: "2rem",
                                    }}
                                  >
                                    <Input
                                      placeholder="limit"
                                      onChange={(e) => inputChange(e, item)}
                                    ></Input>
                                  </Col>
                                  <Col
                                    span={2}
                                    style={{
                                      marginLeft: "3.5rem",
                                    }}
                                  >
                                    <Checkbox
                                      onChange={(e) => setAbove(e, item)}
                                    >
                                      Yes
                                    </Checkbox>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ))
                          : null}
                      </Row>
                      <Row
                        style={{
                          marginTop: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {delegation.delegation_type === "MC" ? (
                          <Col
                            span={10}
                            style={{
                              marginLeft: "",
                              marginTop: "1.5rem",
                            }}
                          >
                            <Radio.Group
                              value={value}
                              onChange={(e) => handelRadio(e.target.value)}
                            >
                              <Radio value={"Line Manager"}>Line Manager</Radio>
                              <Radio value={"Specefic user"}>
                                Specefic User
                              </Radio>
                            </Radio.Group>
                          </Col>
                        ) : null}

                        {value == "Specefic user" &&
                          delegation.delegation_type === "MC" ? (
                          <Col span={6}>
                            <label className={`form-label`}>
                              {" "}
                              <b> Select User</b>
                            </label>
                            <FormSelect
                              name="specefic_user"
                              slug="user_list"
                              className='form-control'
                              placeholder="Select"
                              getEvent={setSpecificUser}
                            />
                          </Col>
                        ) : null}
                      </Row>
                      <>
                        {delegation.delegation_type === "WF"
                          ? array &&
                          array.map((item, index) => {
                            return (
                              <>
                                <Row
                                  style={{
                                    marginTop: "",
                                  }}
                                >
                                  <>
                                    <Col
                                      span={24}
                                      style={{
                                        marginBottom: "1rem",
                                        marginLeft: "1.8rem",
                                      }}
                                    >
                                      <Row
                                        style={{
                                          marginTop: "1rem",
                                        }}
                                      >
                                        <label
                                          style={{
                                            marginRight: "1rem",
                                          }}
                                        >
                                          <b> {`Step${index + 1}`}</b>
                                        </label>
                                        <Button
                                          onClick={() => handelRemove(index)}
                                          type="danger"
                                          className="btn btn-danger"
                                        >
                                          Remove
                                        </Button>
                                      </Row>
                                    </Col>
                                    <Col
                                      span={6}
                                      style={{
                                        marginLeft: "2rem",
                                      }}
                                    >
                                      <label>
                                        <b>Select User</b>
                                      </label>
                                      <Select
                                        className="mb-1"
                                        options={selectUsers}
                                        placeholder="Select User"
                                        onChange={(e) => selectUser(e, index)}
                                        isSearchable
                                        isMulti
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        controlShouldRenderValue={false}
                                        menuPlacement="top"
                                      />
                                    </Col>
                                    <Col
                                      span={4}
                                      style={{
                                        marginLeft: "1.5rem",
                                      }}
                                    >
                                      <label>
                                        <b>Step Name</b>
                                      </label>
                                      <Input
                                        placeholder="Step Name"
                                        style={{
                                          height: "2.4rem",
                                        }}
                                        onChange={(e) =>
                                          stepNameChange(e, item)
                                        }
                                      ></Input>
                                    </Col>
                                    <Col
                                      span={4}
                                      style={{
                                        marginLeft: "1.5rem",
                                      }}
                                    >
                                      <label>
                                        <b>Manage By</b>
                                      </label>
                                      <Select
                                        className="mb-1"
                                        options={manageByOption}
                                        placeholder="Manage By"
                                        onChange={(e) =>
                                          setManageByValue(e, item)
                                        }
                                        isSearchable
                                        menuPlacement="top"
                                      />
                                    </Col>
                                    <Col
                                      span={0.5}
                                      style={{
                                        marginLeft: "1.5rem",
                                      }}
                                    >
                                      <Col span={0.5}>
                                        <label>
                                          <b>Is Same?</b>
                                        </label>
                                      </Col>
                                      <Checkbox
                                        style={{
                                          padding: ".5rem",
                                        }}
                                        onChange={(e) => setIsSame(e, item)}
                                      ></Checkbox>
                                    </Col>
                                    <Col
                                      span={4}
                                      style={{
                                        marginLeft: "1.5rem",
                                      }}
                                    >
                                      <label>
                                        <b>Priority</b>
                                      </label>
                                      <Select
                                        className="mb-1"
                                        options={minorityOption}
                                        placeholder="Priority"
                                        onChange={(e) =>
                                          setPriorityValue(e, item)
                                        }
                                        isSearchable
                                        menuPlacement="top"
                                      />
                                    </Col>
                                  </>
                                </Row>

                                {item.users.length !== 0 ? (
                                  <Row
                                    style={{
                                      marginTop: "1rem",
                                      marginLeft: "2rem",
                                      textAlign: "center",
                                    }}
                                  >
                                    <>
                                      <Col span={2}>
                                        <b>No</b>
                                      </Col>
                                      <Col span={5}>
                                        <b>User Name</b>
                                      </Col>
                                      <Col span={5}>
                                        <b>Decline Logic</b>
                                      </Col>

                                      {item.manage_by === "Limit" ? (
                                        <Col span={4}>
                                          <b>Limit</b>
                                        </Col>
                                      ) : null}

                                      {item.manage_by === "Limit" ? (
                                        <Col
                                          span={2}
                                          style={{
                                            marginLeft: "1.2rem",
                                          }}
                                        >
                                          <b>Above?</b>
                                        </Col>
                                      ) : null}

                                      <Col
                                        span={3}
                                        style={{
                                          marginLeft: "1rem",
                                        }}
                                      >
                                        <b>Must Approve</b>
                                      </Col>
                                    </>
                                  </Row>
                                ) : null}

                                {item.users &&
                                  item.users.map((us, i) => {
                                    return (
                                      <Row
                                        style={{
                                          marginTop: "1rem",
                                          marginLeft: "2rem",
                                          textAlign: "center",
                                        }}
                                        key={us.key}
                                      >
                                        <>
                                          <Col span={24}>
                                            <Row>
                                              <Col span={2}>
                                                <b>{i + 1} </b>
                                              </Col>
                                              <Col span={5}>
                                                <Input
                                                  readOnly="true"
                                                  value={us.label}
                                                  style={{
                                                    height: "2.4rem",
                                                    textAlign: "center",
                                                  }}
                                                />
                                              </Col>
                                              <Col
                                                span={5}
                                                style={{
                                                  marginLeft: "1rem",
                                                }}
                                              >
                                                <Select
                                                  className="mb-1"
                                                  options={
                                                    declineLogicOptions
                                                  }
                                                  placeholder="Decline Logic"
                                                  onChange={(e) =>
                                                    setDeclineLogic(e, us)
                                                  }
                                                  isSearchable
                                                  menuPlacement="top"
                                                />
                                              </Col>
                                              {item.manage_by === "Limit" ? (
                                                <>
                                                  <Col span={4}>
                                                    <Input
                                                      key={item.step_number}
                                                      placeholder="Limit"
                                                      disabled={
                                                        us.limit_type ===
                                                        "Above" &&
                                                        item.above_checked ==
                                                        true
                                                      }
                                                      style={{
                                                        height: "2.4rem",
                                                        marginLeft: "1rem",
                                                      }}
                                                      onChange={(e) =>
                                                        setLimitValue(e, us)
                                                      }
                                                    ></Input>
                                                  </Col>
                                                </>
                                              ) : null}
                                              {item.manage_by === "Limit" ? (
                                                <Col span={2}>
                                                  <Checkbox
                                                    key={i}
                                                    disabled={
                                                      us.limit_type ==
                                                      "Maximum" &&
                                                      item.above_checked ==
                                                      true
                                                    }
                                                    style={{
                                                      marginLeft: "2rem",
                                                    }}
                                                    name={`${item.step_number}`}
                                                    onChange={(e) =>
                                                      handelMustAbove(
                                                        e,
                                                        index,
                                                        i
                                                      )
                                                    }
                                                  ></Checkbox>
                                                </Col>
                                              ) : null}
                                              <Col span={2}>
                                                <Checkbox
                                                  style={{
                                                    marginLeft: "2rem",
                                                  }}
                                                  onChange={(e) =>
                                                    setMustAbove(e, index, i)
                                                  }
                                                ></Checkbox>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      </Row>
                                    );
                                  })}
                              </>
                            );
                          })
                          : null}
                        <></>
                      </>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="section-footer mt-2">
                <Button
                  size="small"
                  type="primary"
                  htmlType="submit"
                  className="btn btn-primary"
                  onClick={submitHandler}
                >
                  Submit
                </Button>
                {delegation.delegation_type === "WF" ? (
                  <Button
                    className="btn btn-primary"
                    size="middle"
                    onClick={() => addMoreStep()}
                    style={{
                      position: "relative",
                      marginLeft: "45rem",
                    }}
                    type="primary"
                  >
                    Add More Step
                  </Button>
                ) : null}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default CapprovalForm;
