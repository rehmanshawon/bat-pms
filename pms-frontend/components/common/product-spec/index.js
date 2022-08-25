import React, { useState } from "react";
import { Modal, Button } from "antd";
import ProductSpec from "./ProductSpec";

const ProductSpecModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" size="small" onClick={showModal}>
        Spec
      </Button>
      <Modal
        title="Product Specifications"
        visible={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        okText="Close"
        width={"60%"}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <ProductSpec
          specifications={props.specifications}
          specificationsOthers={props.specificationsOthers}
          submitGeneralSpec={props.submitGeneralSpec}
          submitOtherSpec={props.submitOtherSpec}
          spec_ref_id={props.spec_ref_id}
          spec_ref={props.spec_ref}
          reference_id={props.reference_id}
          editMode={props.editMode}
        />
      </Modal>
    </>
  );
};



export default ProductSpecModal;
