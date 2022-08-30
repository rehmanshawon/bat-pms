import { useState, useRef, useCallback, useEffect } from "react";

import React from "react";
import MasterGrid from "apsisEngine/common/mastergrid";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Modal, Form } from "antd";
import { swalConfirm } from "apsisEngine/helpers/helperService";
import DesignationForm from "components/common-feature/masterdata/DesignationForm";
import { useRouter } from "next/router";

const DesignationList = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const gridRef = useRef();
  const formRef = useRef();
  const deleteDesignation = useCallback(
    (ids) => {
      //console.log(ids.map(str=>Number(str)));
      swalConfirm("Are you sure?").then((result) => {
        if (result) {
          fetchWrapper
          .patch("designation/delete", {
            ids: ids,
          })
            .then((res) => {
              if (!res.error) {
                props.current.fetchInfo();
              }
            })
            .catch((err) => console.log(err))
            .finally(() => {
              gridRef.current.fetchInfo();
            });
        }
      });
    },
    [props]
  );
  const handleClick = (e, ids) => {
    if (e.target.name == "createDesignation") {
      if (formRef.current) {
        formRef.current.resetForm();
      }

      setEditId(null);
      showModal();
    } else if (e.target.name == "editDesignation" && ids.length == 1) {
      setEditId(ids[0]);
      showModal();
    } else if (e.target.name == "deleteDesignation") {
      deleteDesignation(ids);
    }
  };
  const showModal = useCallback(() => {
    setModalVisible(true);
  });
  const handleOk = useCallback(() => {
    if (props.current) {
      props.current.resetForm();
    }

    setModalVisible(false);
    setEditId(null);
  });

  const handleCancel = useCallback(() => {
    if (props.current) {
      props.current.resetForm();
    }

    setModalVisible(false);
    setEditId(null);
  });

  return (
    <>
      <div>
        <div>
          <Modal
            width={700}
            title="Designation Form"
            visible={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <DesignationForm
              ref={formRef}
              editId={editId}
              gridRef={gridRef}
              handleCancel={handleCancel}
            />
          </Modal>
        </div>
        <div>
          <MasterGrid
            ref={gridRef}
            handleClick={handleClick}
            title="Designation List"
            slug="designation_list"
            primaryKey="hidden_designation_id"
          />
        </div>
      </div>
    </>
  );
};

export default DesignationList;
