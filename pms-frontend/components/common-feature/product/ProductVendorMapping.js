/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Row, Col, Button } from "antd";
import ProductVendorForm from "./ProductVendorForm";
import ProductVendorList from "./ProductVendorList";
import router from "next/router";

export const ProductVendorMapping = (props) => {
  const prodVendorRef = React.createRef();
  const handleClick = (e, ids) => {
    if (e.target.name == "delete_mapping") {
      swalConfirm("Are you sure to delete?", "Confirm").then((result) => {
        if (result.isConfirmed) {
          fetchWrapper
            .patch("productvsvendor/delete", { ids: ids })
            .then((response) => {
              if (!response.error) {
                swalSuccess("Product vendors mapping Successfully");
                if (prodVendorRef.current) {
                  prodVendorRef.current.fetchInfo();
                }
              } else {
                swalError("Product vendors mapping couldn't delete");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    }
  };
  const backToList = () => {
    router.push({
      pathname: "/common-feature/product",
    });
  };
  return (
    <>
      <ProductVendorForm
        productId={props.productId}
        prodVendorRef={prodVendorRef}
      />
      <ProductVendorList
        productId={props.productId}
        handleClick={handleClick}
        prodVendorRef={prodVendorRef}
      />
      <Row className="mt-2">
        <Col span={21}></Col>
        <Col span={3}>
          <Button
            style={{
              float: "right",
              backgroundColor: "rgb(207, 19, 34)",
              color: "rgb(255, 255, 255)",
            }}
            onClick={backToList}
          >
            Back to List
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ProductVendorMapping;
