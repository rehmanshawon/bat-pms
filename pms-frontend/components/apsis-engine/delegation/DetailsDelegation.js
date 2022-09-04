import { React, useEffect, useState } from "react";
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
    Spin
} from "antd";

const DetailsDelegation = (props) => {
    const obj = props.obj;
    const [data, setData] = useState({});
    const [chaka, setChaka] = useState(true);
    const [formTitle, setFormTitle] = useState();
    const [datam, setDatam] = useState([]);

    useEffect(async () => {
        if (obj.delegation_type == "WF") {
            await fetchWrapper
                .post("delegation-conf/delegation-details", obj)
                .then((res) => {
                    setChaka(false);
                    setData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            await fetchWrapper
                .post("delegation-conf/delegation-details", obj)
                .then((res) => {
                    setChaka(true);
                    setDatam(res.data);
                    setChaka(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);
    const columns = [
        {
            title: "User",
            dataIndex: "label",
            key: "User",
            align: "center",
        },
        {
            title: "Manage By",
            dataIndex: "manage_by",
            key: "By",
            align: "center",
        },
    ];

    const columns1 = [
        {
            title: "User",
            dataIndex: "label",
            key: "User",
            align: "center",
        },
        {
            title: "Manage By",
            dataIndex: "manage_by",
            key: "By",
            align: "center",
        },
        {
            title: "Limit Type",
            dataIndex: "limit_type",
            key: "Type",
            align: "center",
        },
        {
            title: "Approve Priority",
            dataIndex: "approve_priority",
            key: "approvePriority",
            align: "center",
        },
        {
            title: "Limit Type",
            dataIndex: "limit_type",
            key: "Type",
            align: "center",
        },

        {
            title: "Max Limit",
            dataIndex: "max_limit",
            key: "Mlimit",
            align: "center",
        },
        {
            title: "Same Sort?",
            dataIndex: "same_sort",
            key: "Ssort",
            align: "center",
        },
        {
            title: "Sort No",
            dataIndex: "same_sort",
            key: "Sno",
            align: "center",
        },
        {
            title: "Must Approve",
            dataIndex: "must_approve",
            key: "Sno",
            align: "center",
        },
    ];

    const column2 = [
        {
            title: "Dlm Step",
            dataIndex: "dlm_steps",
            key: "step",
            align: "center",
        },
        {
            title: "Limit",
            dataIndex: "max_limit",
            key: "lim",
            align: "center",
        },
        {
            title: "Limit Type",
            dataIndex: "limit_type",
            key: "User",
            align: "center",
        },
    ];
    // console.log(datam);

    // console.log("#########################");
    // console.log(data);
    return (
        <Spin spinning={chaka}>
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
                                    {`${obj.slug.split("_")[0]} ${
                                        obj.slug.split("_")[1]
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
                                <b>{obj.delegation_type}</b>
                            </p>
                        </Card>
                    </Col>
                </Row>
                <Col span={24}>
                    <Col style={{ marginTop: "1rem" }}>
                        {obj.delegation_type == "DLM" && datam ? (
                            <Table
                                columns={column2}
                                dataSource={datam}
                                className={"delegationTable"}
                            />
                        ) : null}
                    </Col>
                    <Col span={13} style={{ marginTop: "1rem" }}>
                        {obj.delegation_type == "MC" && datam ? (
                            <Table
                                columns={columns}
                                dataSource={datam}
                                className={"delegationTable"}
                            />
                        ) : null}
                    </Col>
                    <Col style={{ marginTop: "1rem" }}>
                        {obj.delegation_type == "WF" && data
                            ? Object.keys(data).map((item) => {
                                  return (
                                      <>
                                          <Col span={6}>
                                              <p>
                                                  <b
                                                      style={{ color: "red" }}
                                                  >{`Step: ${item}`}</b>
                                              </p>
                                          </Col>
                                          <Table
                                              columns={columns1}
                                              dataSource={data[item]}
                                              className={"delegationTable"}
                                          />
                                      </>
                                  );
                              })
                            : null}
                    </Col>
                </Col>
            </div>
        </Spin>
    );
};

export default DetailsDelegation;
