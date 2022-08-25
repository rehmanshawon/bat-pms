import React, { useEffect, useState } from "react";
import { Row, Col, Card, Space, Table, Tabs } from "antd";

import { useRouter } from "next/router";
// import ApproveOrDecline from "@/components/common/ApproveOrDecline";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { InfoCircleOutlined, HistoryOutlined } from "@ant-design/icons";
import DelegationHistory from "@/components/common/DelegationHistory";
const specColumns = [
  {
    title: "Title",
    dataIndex: "spec_name",
    key: "spec_name",
  },
  {
    title: "Unit",
    dataIndex: "spec_unit",
    key: "spec_unit",
  },
  {
    title: "Standard",
    dataIndex: "spec_standard",
    key: "spec_standard",
  },
  {
    title: "Request Value",
    dataIndex: "spec_value",
    key: "spec_value",
  },
];

export function ProductView(props) {
  const [data, setData] = useState({});
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("1");
  const { TabPane } = Tabs;
  useEffect(() => {
    const newValue = {
      product_id: [props.ids],
    };
    fetchWrapper
      .post("productdata/dependStatus", newValue)
      .then((response) => {
        if (!response.error) {
          const goodsReceiveData = response.data[0];
          setData(goodsReceiveData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.ids]);
  return (
    <div className="site-card-wrapper">
      <Tabs
        defaultActiveKey="1"
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
      >
        <TabPane
          tab={
            <span>
              <InfoCircleOutlined />
              Product Info.
            </span>
          }
          key="1"
        >
          <div>
            <Row gutter={24} className="mb-3 mt-2">
              <Col span={24}>
                <Card
                  className="apsisCard mx-2"
                  title="Details"
                  bordered={true}
                >
                  <Row>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Product name: </span>
                      {data.product_name ? data.product_name : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Category Name: </span>
                      {data.category_name ? data.category_name : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Product Code: </span>
                      {data.product_code ? data.product_code : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Brand Name: </span>
                      {data.brand_name ? data.brand_name : "N/A"}
                    </Col>

                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">
                        Operational Type:
                      </span>
                      {data.operational_type ? data.operational_type : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">
                        Operational Group:{" "}
                      </span>
                      {data.operational_group ? data.operational_group : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Record Qty: </span>
                      {data?.reorder_qty} {data?.default_uom}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">UOM: </span>
                      {data.default_uom ? data.default_uom : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">
                        Vat Service Code:
                      </span>
                      {data.vat_service_code ? data.vat_service_code : "N/A"}
                    </Col>
                    <Col span={8} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">Product Type: </span>
                      {data.product_types_name
                        ? data.product_types_name
                        : "N/A"}
                    </Col>
                    <Col span={14} className={"mb-2 pr-1"}>
                      <span className="font-weight-bold">
                        Product Description:{" "}
                      </span>
                      {data.product_description
                        ? data.product_description
                        : "N/A"}
                    </Col>
                    <Col span={24} className="pr-2">
                      <span className="font-weight-bold">
                        Product Specification:
                      </span>
                      <Table
                        columns={specColumns}
                        dataSource={data.specifications}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </Card>
                <Space />
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Approval History
            </span>
          }
          key="2"
        >
          <DelegationHistory slug="product_code" code={props.ids} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProductView;
