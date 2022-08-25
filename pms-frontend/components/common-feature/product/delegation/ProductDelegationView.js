import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { Card, Row, Button } from "antd";
import { useRouter } from "next/router";
import { FormTextArea } from "@/apsisEngine/common/formValidations";
import {
  swalError,
  swalSuccess,
  swalConfirm,
} from "@/apsisEngine/helpers/helperService";
import ProductView from "../ProductView";

export const ProductDelegationView = (props) => {
  const id = props.id;
  const router = useRouter();

  const [formState, updateFormState] = useState({});

  const stateChange = (event) => {
    //get data form event
    const { name, value } = event.target;
    updateFormState({ ...formState, [name]: value });
  };

  const onApprove = async (e) => {
    e.preventDefault();

    if (formState.comment) {
      swalConfirm(
        "you want to approve",
        "Are you sure  ?",
        "Yes, Approve"
      ).then((result, agree) => {
        if (result.isConfirmed) {
          let data = {
            slug: "product_code",
            code: [id],
            delegation_type: "approval",
            comments: formState.comment,
            additional_data: "",
          };
          fetchWrapper
            .post("delegation/delegation-process", data)
            .then((response) => {
              if (!response.error) {
                swalSuccess("", "", response.data).then(function () {
                  router.push({
                    pathname:
                      "/delegation/waiting-approve-list/product-approval",
                    query: {
                      id_logic_slug: "product_code",
                    },
                  });
                });
              } else {
                swalError(response.message);
              }
            });
        }
      });
    } else {
      swalError("Please write some comment");
    }
  };

  const onDecline = async (e) => {
    e.preventDefault();

    if (formState.comment) {
      swalConfirm(
        "you want to decline",
        "Are you sure  ?",
        "Yes, Decline"
      ).then((result, agree) => {
        if (result.isConfirmed) {
          let data = {
            slug: "product_code",
            code: [id],
            delegation_type: "decline",
            comments: formState.comment,
            additional_data: "",
          };
          fetchWrapper
            .post("delegation/delegation-process", data)
            .then((response) => {
              if (!response.error) {
                swalSuccess("", "", response.data).then(function () {
                  router.push({
                    pathname:
                      "/delegation/waiting-approve-list/product-approval",
                    query: {
                      id_logic_slug: "product_code",
                    },
                  });
                });
              } else {
                swalError("Something wrong! please try with appropriate data");
              }
            });
        }
      });
    } else {
      swalError("Please write some comment");
    }
  };

  return (
    <>
      <div className="main-wrap">
        <div className="site-card-wrapper">
          <Card className="apsisCard" bordered={true}>
            <ProductView ids={id} />
            {!router.query.history&&<><div className="pt-2">
              <h6 className="section-title">
                Comment <span style={{ color: "red" }}>*</span>
              </h6>
              <FormTextArea
                value={formState?.comment}
                name="comment"
                getEvent={stateChange}
              />
            </div>
            <div className="section-footer mt-2 mb-2 pb-4">
              <Row style={{ float: "right", paddingBottom: 4 }}>
                <div style={{ paddingRight: 2 }}>
                  <Button
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary"
                    onClick={onDecline}
                    danger
                  >
                    <i style={{ paddingRight: 5 }} className="fa fa-ban"></i>
                    Decline
                  </Button>
                </div>

                <div>
                  <Button
                    size="middle"
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary"
                    name="Approve"
                    onClick={onApprove}
                  >
                    <i
                      style={{ paddingRight: 5 }}
                      className="fa fa-check-circle"
                    ></i>
                    Approve
                  </Button>
                </div>
              </Row>
            </div></>}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProductDelegationView;
