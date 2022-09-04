import { React, useState, useEffect } from "react";
import router from "next/router";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import DetailsDelegation from "./DetailsDelegation";

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
    Spin,
} from "antd";

const ViewDelegation = () => {
    console.log(router.query.code);
    const [data, setData] = useState([]);
    const [formTitle, setFormTitle] = useState();
    const [value, setSlectedValue] = useState([]);
    const [chaka, setChaka] = useState(true);
    const [isDetails, setIsDetails] = useState(false);
    const [object, setObject] = useState({});

    useEffect(async () => {
        await fetchWrapper
            .get(`/delegation-conf/delegation-view/${router.query.code}`)
            .then((res) => {
                setChaka(false);
                let tempArray = [];
                res.data.forEach((element, index) => {
                    let tempObject = {
                        ...element,
                        key: index,
                    };
                    tempArray.push(tempObject);
                });
                setData(tempArray);
                //setChaka(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    //   const getFields = async () => {
    //     let response = await fetchWrapper.post("masterform/getformdata", {
    //       form_slug: "",
    //     });

    //     if (response.data) {
    //       const { form_title, form_element } = response.data;
    //       setFormTitle(form_title);
    //       setSectionFields(form_element["sec_1"]);
    //     }
    //   };

    const handelDetails = async () => {
        //console.log(value);
        let obj = {
            slug: value[0].slug,
            delegation_version: value[0].delegation_version,
            delegation_type: value[0].delegation_type,
            ref_event_id: value[0].ref_event_id,
            ref_event_value: value[0].ref_event_value,
        };
        console.log(obj);
        await setObject(obj);

        setIsDetails(true);
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSlectedValue(selectedRows);
        },
    };

    const columns = [
        {
            title: "Delegation For",
            dataIndex: "id_for",
            key: "delegation_for",
            align: "center",
        },
        {
            title: "Delegation Type",
            dataIndex: "delegation_type",
            key: "type",
            align: "center",
        },
        {
            title: "Delegation Version",
            dataIndex: "delegation_version",
            key: "version",
            align: "center",
        },
        {
            title: "Refrence Event Value",
            dataIndex: "ref_event_value",
            key: "event_id",
            width: 300,
            align: "center",
        },
    ];
    console.log(data);
    return (
        <Spin spinning={chaka}>
            <div className="main-wrap">
                <div className="card card-xl-stretch">
                    <div className="card-header border-0 p-4 d-flex justify-content-between">
                        {isDetails === true ? (
                            <h4 className="card-title fw-bolder text-dark mb-0">
                                {"Delegation Details"}
                            </h4>
                        ) : (
                            <h4 className="card-title fw-bolder text-dark mb-0">
                                {"View Delegation"}
                            </h4>
                        )}
                    </div>
                    <div className="card-body pt-2">
                        {isDetails === true ? (
                            <DetailsDelegation obj={object} />
                        ) : (
                            <>
                                <div className="">
                                    {value.length === 1 ? (
                                        <Button
                                            size="middle"
                                            type="primary"
                                            htmlType="submit"
                                            className="btn btn-primary"
                                            onClick={() => handelDetails()}
                                            style={{
                                                position: "relative",
                                                marginLeft: "54rem",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    ) : (
                                        <Button
                                            size="middle"
                                            type="primary"
                                            htmlType="submit"
                                            className="btn btn-primary"
                                            disabled={true}
                                            onClick={() => handelDetails()}
                                            style={{
                                                position: "relative",
                                                marginLeft: "54rem",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    )}
                                </div>
                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={data}
                                    className={"delegationTable"}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default ViewDelegation;
