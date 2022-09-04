import { React, useEffect, useState } from "react";
import router from "next/router";
import { Spin } from "antd";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { EditOutlined } from "@ant-design/icons";
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
import EditDelegation from "./EditDelegation";

const ViewEditDelegation = () => {
  const [chaka, setChaka] = useState(false);
  const [data, setData] = useState([]);
  const [obj, setObj] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchWrapper
      .get(`delegation-conf/delegation-view/${router.query.code}`)
      .then((res) => {
        setChaka(true);
        let d = [];
        res.data.forEach((element, index) => {
          let p = {
            ...element,
            key: index,
          };
          d.push(p);
        });
        setData(d);
        setChaka(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handelEdit = async (record) => {
    let obj = {
      slug: record.slug,
      delegation_type: record.delegation_type,
      delegation_version: record.delegation_version,
      ref_event_id: record.ref_event_id,
      ref_event_value: record.ref_event_value,
    };
    console.log(obj);
    await setObj(obj);

    setIsEdit(true);
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
      align: "center",
    },
    {
      title: "Action",
      key: "key",
      dataIndex: "key",
      render: (text, record) => (
        <button onClick={() => handelEdit(record)}>
          <EditOutlined />
          Edit
        </button>
      ),
    },
  ];
  console.log(data);
  return (
    <Spin spinning={chaka}>
      <div className="main-wrap">
        <div className="card card-xl-stretch">
          <div className="card-header border-0 p-4 d-flex justify-content-between">
            <h3 className="card-title fw-bolder text-dark mb-0">
              Edit Delegation
            </h3>
          </div>
          <div className="card-body pt-2">
            {isEdit === true ? (
              <EditDelegation obj={obj} />
            ) : data && data.length != 0 ? (
              <Table
                columns={columns}
                dataSource={data}
                className={"delegationTable"}
              ></Table>
            ) : null}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ViewEditDelegation;
