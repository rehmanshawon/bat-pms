import FormArea from "apsisEngine/common/formArea";
import { Col, Row } from "antd";
import React from "react";
import DelegationHistory from "./DelegationHistory";
import QueryLog from "./QueryLog";

const data = [
  { author: 1, message: "a", align: "left", img: "" },
  { author: 2, message: "b", align: "right", img: "" },
  { author: 3, message: "c", align: "left", img: "" },
];

const CommonDelegationHistory = () => {
  return (
    <>
      <FormArea mainTitle="Delegation History">
        <Row gutter={12} className="p-3">
          <Col span={12}>
            <h6>Delegation Log</h6>
            <DelegationHistory />
          </Col>
          <Col span={12}>
            <h6>Query Log</h6>
            <QueryLog data={data} />
          </Col>
        </Row>
      </FormArea>
    </>
  );
};

export default CommonDelegationHistory;
