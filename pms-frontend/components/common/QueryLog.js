import { Col, Row, Timeline } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Avatar, Comment } from "antd";
import { apsisDateTime } from "apsisEngine/helpers/helpers";

const QueryLog = ({ data }) => {
  const QueryLogData = ({ children, data }) => {
    const { name, allignment, image, comments, time } = data;
    return (
      <Comment
        className={allignment === "right" ? "left-img-align" : null}
        style={{ float: allignment }}
        author={
          <a>
            {allignment === "right" ? (
              <>
                {apsisDateTime(time)}
                <strong className="ml-1">{name}</strong>
              </>
            ) : (
              <>
                <strong className="mr-1">{name}</strong> {apsisDateTime(time)}
              </>
            )}
          </a>
        }
        avatar={
          <Avatar
            src={image ?? "http://localhost:5000/images/user.png"}
            alt={name}
          />
        }
        content={<p>{comments}</p>}
      >
        {children}
      </Comment>
    );
  };

  return (
    <>
      <div className=" rounded p-2" style={{ border: "1px solid #e0dee0" }}>
        <Row>
          {data &&
            data.length > 0 &&
            data.map((item, i) => (
              <Col key={i} span={24}>
                <QueryLogData data={item} />
              </Col>
            ))}
          {data && data.length == 0 && (
            <div className="p-3">No Log Available</div>
          )}
        </Row>
      </div>
    </>
  );
};

export default QueryLog;
