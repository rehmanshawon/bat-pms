import React, { useState, useEffect } from "react";
import ProductSpecifications from "./ProductSpecifications";
import OtherSpecifications from "./OtherSpecifications";
import { Button, Row } from "antd";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalSuccess } from "@/apsisEngine/helpers/helperService";

export default function Specifications(props) {
  const [formState, setformState] = useState({
    product_id: props.productId,
    specifications: [],
    specificationsOthers: [],
  });
  const productSpecHandler = (data) => {
    setformState({ ...formState, specifications: data });
  };
  const otherSpecHandler = (data) => {
    setformState({ ...formState, specificationsOthers: data });
  };
  const onSubmit = () => {
    fetchWrapper
      .post("productspecification", formState)
      .then((response) => {
        if (!response.error) {
          swalSuccess("Product Specifications created successfully");
          props.setactiveKey("3");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchWrapper
      .post("productdata/dependStatus", {
        product_id: [props.productId],
      })
      .then((response) => {
        if (!response.error) {
          const data = response.data[0];
          setformState({
            ...formState,
            specifications: data.specifications,
            specificationsOthers: [],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.productId]);

  return (
    <div>
      <ProductSpecifications
        productSpecHandler={productSpecHandler}
        specifications={formState.specifications}
      />
      {/* <OtherSpecifications
        otherSpecHandler={otherSpecHandler}
        specificationsOthers={formState.specificationsOthers}
      /> */}
      <Row className="justify-content-end mt-2">
        <Button type="primary" className="btn btn-primary" onClick={onSubmit}>
          Submit
        </Button>
      </Row>
    </div>
  );
}
