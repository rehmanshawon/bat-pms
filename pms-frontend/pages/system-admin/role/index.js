import { useState, useRef, useCallback, useEffect } from "react";

import React from "react";
import MasterGrid from "apsisEngine/common/mastergrid";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Modal, Form } from "antd";
import { swalConfirm } from "apsisEngine/helpers/helperService";
import RoleForm from "components/common-feature/masterdata/RoleForm";
import { useRouter } from "next/router";

const RoleList = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const gridRef = useRef();
  const formRef = useRef();
  const deleteRole = useCallback(
    (ids) => {
      swalConfirm("Are you sure?").then((result) => {
        if (result) {
          fetchWrapper
          .patch("role/delete", {
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
    if (e.target.name == "createRole") {
      console.log('shawon');
      if (formRef.current) {
        formRef.current.resetForm();
      }

      setEditId(null);
      showModal();
    } else if (e.target.name == "editRole" && ids.length == 1) {
      setEditId(ids[0]);
      showModal();
    } else if (e.target.name == "deleteRole") {
      deleteRole(ids);
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
            title="Role Form"
            visible={modalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <RoleForm
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
            title="Role List"
            slug="role_list"
            primaryKey="hidden_role_id"
          />
        </div>
      </div>
    </>
  );
};

export default RoleList;
