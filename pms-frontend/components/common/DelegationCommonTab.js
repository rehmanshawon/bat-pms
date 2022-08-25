import { FormTextArea } from "apsisEngine/common/formValidations";
import { Row, Button, Tabs, Card } from "antd";
import React, { useState, lazy, Suspense, useEffect, Fragment } from "react";
const { TabPane } = Tabs;
import { InfoCircleOutlined, HistoryOutlined } from "@ant-design/icons";
import DelegationHistory from "components/common/DelegationHistory";
import dynamic from "next/dynamic";
import ApproveOrDecline from "./ApproveOrDecline";
import { useRouter } from "next/router";

const DelegationCommonTab = ({ title, slug, code, componentPath, data }) => {
  const [activeKey, setActiveKey] = useState("1");
  const [activeModule, setActiveModule] = useState(componentPath);
  const [componentData, setComponentData] = useState(data);
  const router = useRouter();

  const DynamicDelegationComponent =
    activeModule && activeModule != ""
      ? lazy(() => import("../" + componentPath))
      : undefined;

  useEffect(() => {
    setActiveModule(componentPath);
    setComponentData(data);
  }, [data]);

  return (
    <>
      <Fragment>
        <div className="master_grid">
          <div className="title_area">
            <div className="gridTitle">
              <h6>
                <span className="fa fa-file-text mr-2"></span> {title}
              </h6>
            </div>
          </div>
          <div className="main-wrap">
            <div className="site-card-wrapper">
              <Card className="apsisCard" bordered={true}>
                <Tabs
                  defaultActiveKey="1"
                  activeKey={activeKey}
                  onChange={(key) => setActiveKey(key)}
                >
                  <TabPane
                    tab={
                      <span>
                        <InfoCircleOutlined />
                        Basic Info
                      </span>
                    }
                    key="1"
                  >
                    <Suspense fallback={<div> Loading...</div>}>
                      {DynamicDelegationComponent != undefined &&
                        componentData && (
                          <DynamicDelegationComponent data={componentData} />
                        )}
                    </Suspense>
                    <ApproveOrDecline
                      slug={slug}
                      codes={[code]}
                      delegationVersion={[]}
                      afterDelegation={router.back}
                    />
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
                    <DelegationHistory slug={slug} code={code} />
                  </TabPane>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </Fragment>
    </>
  );
};

export default DelegationCommonTab;
