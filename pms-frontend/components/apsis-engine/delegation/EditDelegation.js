import { React, useState, useEffect } from "react";
import Select from "react-select";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
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
import router from "next/router";
import { FormMultiSelect } from "@/apsisEngine/common/formValidations";
import { FormSelect } from "@/apsisEngine/common/formValidations";
import { swalSuccess } from "@/apsisEngine/helpers/helperService";

const EditDelegation = (props) => {
  const object = props.obj;
  const [form] = Form.useForm();
  //const [data, setData] = useState({});
  const [value, setValue] = useState("Line Manager");
  const [datam, setDatam] = useState([]);
  const [array, setArray] = useState([]);
  const [Ischecked, setIschecked] = useState(false);
  const [Ischecked1, setIsChecked1] = useState(false);
  const [makerUser, setMakerUser] = useState(0);
  const [stepName, seStepName] = useState("");
  const [priority, setPriority] = useState([]);
  const [manageBy, setManageBY] = useState([]);
  const [selectUsers, setSelected] = useState([]);
  useEffect(async () => {
    if (object.delegation_type == "WF") {
      await fetchWrapper
        .post("delegation-conf/delegation-details", object)
        .then((res) => {
          // setChaka(true);
          let tempArray = [];

          Object.keys(res.data).map((step, index) => {
            let temp = {
              manage_by: "",
              step_number: 0,
              step_name: "",
              same_sort: 0,
              approve_priority: "",
              above_checked: false,
              users: [],
            };
            temp.manage_by = res.data[step][0].manage_by;
            temp.step_number = parseInt(step);
            temp.step_name = res.data[step][0].step_name;
            temp.same_sort = res.data[step][0].same_sort;
            temp.approve_priority = res.data[step][0].approve_priority;

            res.data[step].map((user, index) => {
              if (user.limit_type == "Above") {
                temp["above_checked"] = true;
              }
              let temp2 = {
                key: Math.floor(Math.random() * 100),
                label: user.label,
                value: user.user_id,
                must_approve: user.must_approve,
                max_limit: user.max_limit,
                limit_type: user.limit_type,
                decline_logic: user.decline_logic,
              };
              temp.users.push(temp2);
            });
            tempArray.push(temp);
          });
          //  setData(res.data);
          setArray(tempArray);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await fetchWrapper
        .post("delegation-conf/delegation-details", object)
        .then((res) => {
          //setChaka(true);
          setDatam(res.data);
          if (object.delegation_type === "MC") {
            if (res.data[0].manage_by === "Hierarchy") {
              setValue(...value), setIsChecked1(true);
            } else {
              //console.log(res.data);
              setValue("Specefic user");
              setIschecked(true);
              setIsChecked1(false);
            }
          }
          //setChaka(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.obj]);

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

  const setSpecificUser = (e) => {
    setMakerUser(e.value);
  };

  const handelRadioLineManager = (e) => {
    setIsChecked1(true);
    setIschecked(false);
    setValue(e.target.name);
  };
  const handelRadioSpeceficUser = (e) => {
    setIschecked(true);
    setIsChecked1(false);
    setValue(e.target.name);
  };
  const inputChange = (e, item) => {
    item.max_limit = parseInt(e.target.value);

    const exist = datam.find((x) => x.dlm_steps === item.dlm_steps);

    if (exist) {
      setDatam(
        datam.map((x) =>
          x.dlm_steps === item.dlm_steps
            ? { ...exist, max_limit: item.max_limit }
            : x
        )
      );
    } else {
      setDatam(...datam);
    }
  };

  const setAbove = (e, item) => {
    if (e.target.checked) {
      item.limit_type = "Above";
    } else {
      item.limit_type = item.limit_type;
    }

    const exist = datam.find((x) => x.dlm_step === item.dlm_step);

    if (exist) {
      setDatam(
        datam.map((x) =>
          x.dlm_step === item.dlm_step
            ? { ...exist, limit_type: item.limit_type }
            : x
        )
      );
    } else {
      setDatam(...datam);
    }
  };

  const makeRefObject = () => {
    const a = object.ref_event_id;
    const b = object.ref_event_value;
    const c = b.split(/\:|,/);

    const obj = {};
    let count = 0;

    a.split(",").map((item, i) => {
      // console.log(i, item);

      obj[c[count].split("_")[0].trim()] = parseInt(item);
      count = count + 2;
    });

    return obj;
  };
  const makeObject = () => {
    const b = makeRefObject();
    if (object.delegation_type === "DLM") {
      var post = {
        delegation_for: object.slug,
        approve_type: "DLM",
        ref_event: b,
        DLM: datam,
      };

      return post;
    } else if (object.delegation_type === "MC") {
      var post = {
        delegation_for: object.slug,
        approve_type: "MC",
        ref_event: b,
        maker_checker: {
          type: value,
          user_id: makerUser,
        },
      };
      return post;
    } else if (object.delegation_type === "WF") {
      var post = {
        delegation_for: object.slug,
        approve_type: "WF",
        ref_event: b,
        process_flow: array,
      };
      return post;
    }
  };

  const submitHandler = () => {
    const finalData = makeObject();
    console.log(finalData);
    fetchWrapper
      .patch("delegation-conf/delegation-update", finalData)
      .then((res) => {
        //alert(res.message);
        swalSuccess(`${res.message}`);
        router.push("/apsis-engine/delegation/config");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(datam);
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

  const drop3 = [
    { id: 1, value: "Initiator", label: "Initiator" },
    { id: 2, value: "Previous Approval", label: "Previous Approval" },
  ];

  const handelRemove = (id) => {
    const updateArray = array.filter((item, index) => {
      return index !== id;
    });

    setArray(updateArray);
  };

  const stepNameChange = (e, item, index) => {
    item.step_name = e.target.value;
    console.log(item.step_name);

    const exist = array.find((x) => x.step_number === item.step_number);
    //console.log(exist);

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
  };

  const setLimitValue = (e, index, i) => {
    const value = parseInt(e.target.value);
    let Name = e.target.name;
    let exist = [...array];
    exist[index].users[i][`${Name}`] = value;
    setArray(exist);
    //console.log(exist);
  };

  const setMustAbove = (e, index, i) => {
    let value;
    if (e.target.checked) {
      //us.must_approve = 1;
      value = 1;
    } else {
      //us.must_approve = 0;
      value = 0;
    }
    let exist = [...array];
    exist[index].users[i].must_approve = value;
    setArray(exist);
  };

  const addMoreStep = () => {
    let object = {
      step_number: array.length + 1,
      users: [],
      step_name: stepName,
      manage_by: manageBy.value,
      same_sort: 0,
      approve_priority: priority.value,
      above_checked: false,
    };

    setArray((prev) => [...prev, object]);
  };

  // const selectMutiUser = async (e, index) => {
  //   let temp = [...e.target.selectedItem];
  //   const temp2 = temp.map((item) => {
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

  const selectUser = (e, index) => {
    console.log(e);
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

  const handelMustAbove = (e, index, i) => {
    let exist = [...array];
    // console.log(item);
    //console.log(e.target.name, index, i, exist);

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
  console.log(array);
  return (
    <div className="main-wrap">
      <div className="card card-xl-stretch">
        <div className="card-body pt-2">
          <Row>
            <Col span={6}>
              <Card
                size="small"
                title="Deligation For"
                style={{ width: 250 }}
                className="approval-card"
              >
                <p>
                  <b>
                    {`${object.slug.split("_")[0]} ${
                      object.slug.split("_")[1]
                    }`.toUpperCase()}
                  </b>
                </p>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                title="Approval Type"
                style={{ width: 250, marginLeft: "1rem" }}
                className="approval-card"
              >
                <p>
                  <b>{object.delegation_type}</b>
                </p>
              </Card>
            </Col>
          </Row>
          <Col span={24}>
            {object.delegation_type === "DLM" ? (
              <>
                <Row style={{ marginTop: "1rem", color: "black" }}>
                  <Col span={6} style={{ marginLeft: "1rem" }}>
                    <b>Name</b>
                  </Col>
                  <Col
                    span={6}
                    style={{
                      marginLeft: "1rem",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    <b>Limit</b>
                  </Col>
                  <Col
                    style={{
                      marginLeft: "1rem",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    <b>Above</b>
                  </Col>
                </Row>
                <Col span={15}>
                  <hr />
                </Col>
                <Row>
                  {object.delegation_type === "DLM" && datam
                    ? datam.map((item, index) => (
                        <>
                          <Col span={24}>
                            <Row
                              style={{
                                marginBottom: "1rem",
                                marginLeft: "1rem",
                              }}
                            >
                              <Col span={6}>
                                <b>{item.dlm_steps.toUpperCase()}</b>
                              </Col>
                              <Col cpan={6} style={{ marginLeft: "2rem" }}>
                                <Input
                                  placeholder="limit"
                                  value={item.max_limit}
                                  onChange={(e) => inputChange(e, item)}
                                ></Input>
                              </Col>
                              <Col span={2} style={{ marginLeft: "2rem" }}>
                                {item.limit_type == "Above" ? (
                                  <Checkbox
                                    checked={true}
                                    onChange={(e) => setAbove(e, item)}
                                  ></Checkbox>
                                ) : (
                                  <Checkbox
                                    checked={false}
                                    onChange={(e) => setAbove(e, item)}
                                  ></Checkbox>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </>
                      ))
                    : null}
                </Row>
              </>
            ) : null}
            <>
              {object.delegation_type === "WF"
                ? array &&
                  array.map((item, index) => {
                    return (
                      <>
                        <Row style={{ marginTop: "" }}>
                          <>
                            <Col
                              span={24}
                              style={{
                                marginBottom: "1rem",
                                marginLeft: "1.8rem",
                              }}
                            >
                              <Row style={{ marginTop: "1rem" }}>
                                <label style={{ marginRight: "1rem" }}>
                                  <b> {`Step${item.step_number}`}</b>
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
                            <Col span={6} style={{ marginLeft: "2rem" }}>
                              <label>
                                <b>Select User</b>
                              </label>
                              {/* {
                                item.users
                              } */}
                              {/* <Form form={form}>
                                <FormMultiSelect
                                  name="selectMultiUser"
                                  slug="user_list"
                                  placeholder="Select User"
                                  extra={""}
                                  //dropdownAlign= {{ offset: [-40, 4] }}
                                  getEvent={(e) => selectMutiUser(e, index)}
                                  v
                                />
                              </Form> */}
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
                                defaultValue={item.users.map((us, i) => {
                                  return item.users[i];
                                })}
                              />
                            </Col>
                            <Col span={4} style={{ marginLeft: "1.5rem" }}>
                              <label>
                                <b>Step Name</b>
                              </label>
                              <Input
                                placeholder="Step Name"
                                style={{ height: "2.4rem" }}
                                name="step_name"
                                value={item.step_name}
                                onChange={(e) => stepNameChange(e, item)}
                              ></Input>
                            </Col>
                            <Col span={4} style={{ marginLeft: "1.5rem" }}>
                              <label>
                                <b>Manage By</b>
                              </label>
                              <Select
                                className="mb-1"
                                options={manageByOption}
                                placeholder="Manage By"
                                name="manage_by"
                                defaultValue={{
                                  label: item.manage_by,
                                  value: item.manage_by,
                                }}
                                onChange={(e) => setManageByValue(e, item)}
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
                              {item.same_sort === 1 ? (
                                <Checkbox
                                  style={{ padding: ".5rem" }}
                                  name="same_sort"
                                  checked={true}
                                  onChange={(e) => setIsSame(e, item)}
                                ></Checkbox>
                              ) : (
                                <Checkbox
                                  style={{ padding: ".5rem" }}
                                  name="same_sort"
                                  checked={false}
                                  onChange={(e) => setIsSame(e, item)}
                                ></Checkbox>
                              )}
                            </Col>
                            <Col span={4} style={{ marginLeft: "1.5rem" }}>
                              <label>
                                <b>Priority</b>
                              </label>
                              <Select
                                className="mb-1"
                                options={minorityOption}
                                placeholder="Priority"
                                name="approve_priority"
                                defaultValue={{
                                  label: item.approve_priority,
                                  value: item.approve_priority,
                                }}
                                onChange={(e) => setPriorityValue(e, item)}
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

                              <Col span={3} style={{ marginLeft: "1rem" }}>
                                <b>Must Approve</b>
                              </Col>
                            </>
                          </Row>
                        ) : null}

                        {item.users &&
                          item.users.map((us, i) => {
                            return (
                              <Row
                              key={i}
                                style={{
                                  marginTop: "1rem",
                                  marginLeft: "2rem",
                                  textAlign: "center",
                                }}
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
                                          options={drop3}
                                          placeholder="Decline Logic"
                                          defaultValue={{
                                            label: us.decline_logic,
                                            value: us.decline_logic,
                                          }}
                                          onChange={(e) =>
                                            setDeclineLogic(e, us)
                                          }
                                          isSearchable
                                          menuPlacement="top"
                                        />
                                      </Col>

                                      {item.manage_by === "Limit" ? (
                                        <Col span={4}>
                                          <Input
                                            placeholder="Limit"
                                            name="max_limit"
                                            disabled={
                                              us.limit_type === "Above" &&
                                              item.above_checked == true
                                            }
                                            style={{
                                              height: "2.4rem",
                                              marginLeft: "1rem",
                                            }}
                                            value={us.max_limit || 0}
                                            onChange={(e) =>
                                              setLimitValue(e, index, i)
                                            }
                                          ></Input>
                                        </Col>
                                      ) : null}
                                      {item.manage_by === "Limit" ? (
                                        <Col span={2}>
                                          {us.limit_type == "Above" ? (
                                            <Checkbox
                                              key={i}
                                              checked={true}
                                              disabled={
                                                us.limit_type == "Maximum" &&
                                                item.above_checked == true
                                              }
                                              style={{
                                                marginLeft: "2rem",
                                              }}
                                              name={`${item.step_number}`}
                                              onChange={(e) =>
                                                handelMustAbove(e, index, i)
                                              }
                                            ></Checkbox>
                                          ) : (
                                            <Checkbox
                                              key={i}
                                              checked={false}
                                              disabled={
                                                us.limit_type == "Maximum" &&
                                                item.above_checked == true
                                              }
                                              style={{
                                                marginLeft: "2rem",
                                              }}
                                              name={`${item.step_number}`}
                                              onChange={(e) =>
                                                handelMustAbove(e, index, i)
                                              }
                                            ></Checkbox>
                                          )}
                                        </Col>
                                      ) : null}

                                      <Col span={3}>
                                        {us.must_approve === 1 ? (
                                          <Checkbox
                                            checked={true}
                                            onChange={(e) =>
                                              setMustAbove(e, index, i)
                                            }
                                          ></Checkbox>
                                        ) : (
                                          <Checkbox
                                            checked={false}
                                            onChange={(e) =>
                                              setMustAbove(e, index, i)
                                            }
                                          ></Checkbox>
                                        )}
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
            <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              {object.delegation_type === "MC" ? (
                <Col span={10} style={{ marginLeft: "", marginTop: "1.5rem" }}>
                  {
                    /* {
                    <Radio.Group  value={value} onChange={(e) => handelRadio(e)}>
                      <Radio checked={true} value={"Line Manager"}>
                        Line Manager
                      </Radio>
                      <Radio checked={false} value={"Specefic user"}>
                        Specefic User
                      </Radio>
                    </Radio.Group>
                  } */
                    console.log(selectUsers)
                  }
                  <Radio
                    checked={datam.manage_by != "Hierarchy" && Ischecked1}
                    name="Line Manager"
                    onChange={(e) => handelRadioLineManager(e)}
                  >
                    Line Manager
                  </Radio>
                  <Radio
                    checked={Ischecked}
                    name="Specefic user"
                    onChange={(e) => handelRadioSpeceficUser(e)}
                  >
                    Specefic User
                  </Radio>
                </Col>
              ) : null}

              {value == "Specefic user" && object.delegation_type === "MC" ? (
                <Col span={6}>
                  <label className={`form-label`}>
                    <b> Select User</b>
                  </label>
                  {/* <FormSelect
                    name="specefic_user"
                    slug="user_list"
                    // selectedValue={
                    //   formState.requisition[
                    //     "requisition_branch_id"
                    //   ] ?? ""
                    // }

                    //={{value:datam[0].value, label: datam[0].label}}
                    placeholder="Select"
                    onChange={(e) => setSpecificUser(e)}
                  /> */}
                  <Select
                    className="mb-1"
                    options={selectUsers}
                    placeholder="Select User"
                    name=""
                    defaultValue={{
                      label: datam[0].label,
                      value: datam[0].value,
                    }}
                    onChange={(e) => setSpecificUser(e)}
                    isSearchable
                    menuPlacement="top"
                  />
                </Col>
              ) : null}
            </Row>
          </Col>
        </div>
        <div className="section-footer mt-2">
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            className="btn btn-primary"
            onClick={submitHandler}
            style={{ marginLeft: "2rem", marginBottom: "1rem" }}
          >
            Update
          </Button>
          {object.delegation_type === "WF" ? (
            <Button
              className="btn btn-primary"
              size="middle"
              onClick={() => addMoreStep()}
              style={{
                position: "relative",
                marginLeft: "45rem",
                marginBottom: "1rem",
              }}
              type="primary"
            >
              Add More Step
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditDelegation;
