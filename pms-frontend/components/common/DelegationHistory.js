import React, { useEffect, useState } from "react";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Col, Row, Table } from "antd";
import moment from "moment";
import FormArea from "apsisEngine/common/formArea";
import QueryLogComment from "./QueryLogComment";

const DelegationHistory = ({
  slug,
  code,
  alwaysShow = false,
  forceShow = false,
}) => {
  const [delegationData, setDelegationData] = useState([]);
  const columns = [
    {
      title: "Approval Person",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Action Type",
      dataIndex: "act_status",
      key: "act_status",
    },
    {
      title: "Action Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (data) =>
        //apsisDate(data,"dd-mm-YYYY H:i:s")
        moment(data).format("DD/MM/YYYY hh:mm:ss a"),
    },
    {
      title: "Comments",
      dataIndex: "act_comments",
      key: "act_comments",
    },
  ];

  const getDelegationData = async () => {
    let response = await fetchWrapper.get(
      `/delegation/delegation-history/${slug}/${code}`
    );
    if (!response.error) {
      const newData = response.data.map((data) => {
        return {
          key: data.delegation_person,
          ...data,
        };
      });
      setDelegationData(newData);
    }
  };

  // form default
  useEffect(() => {
    if (slug && code) {
      getDelegationData(slug, code);
    }
  }, [slug, code]);

  return (
    // <div>
    //   <Table
    //     bordered
    //     pagination={false}
    //     dataSource={delegationData}
    //     columns={columns}
    //   />
    // </div>
    <>
      <FormArea mainTitle="Delegation History">
        <Row gutter={12} className="p-3">
          <Col span={12}>
            <h6>Delegation Log</h6>
            <Table
              bordered
              pagination={false}
              dataSource={delegationData}
              columns={columns}
            />
          </Col>
          <Col span={12}>
            <h6>Query Log</h6>
            {/* <QueryLog data={data} /> */}
            <QueryLogComment
              slug={slug}
              code={code}
              alwaysShow={alwaysShow}
              forceShow={forceShow}
            />
          </Col>
        </Row>
      </FormArea>
    </>
  );
};

export default DelegationHistory;
