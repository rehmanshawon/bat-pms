/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FileUpload } from "apsisEngine/common/formValidations";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import router from "next/router";
import { sendForApproval } from "apsisEngine/helpers/commonFunction";
import { Col, Row, Button } from "antd";
import { swalSuccess, swalError } from "apsisEngine/helpers/helperService";
const ApsisAttachment = ({
  reference,
  reference_id,
  backLink,
  approvalButton,
  draftButton,
  editMode,
  reloadAttachments,
  draftText = " Save As Draft",
  delegationVersion,
  getSuccess = null,
}) => {
  //load child component rafarence function
  const ref = React.createRef();
  const formReset = () => {
    if (ref.current) {
      ref.current.formReset();
    }
  };
  const sendSuccess = (data) => {
    if (getSuccess != null) {
      getSuccess({ data: data, type: true });
    }
    console.log(getSuccess);
  };
  const handleBackList = () => {
    if (backLink) {
      router.push(backLink);
    }
  };

  const handleForApprove = () => {
    if (selectedFile.length > 0) {
      onSubmit(event).then((result) => {
        result
          ? sendForApproval(
              reference,
              [reference_id],
              delegationVersion ? [delegationVersion] : null
            ).then(handleBackList)
          : swalError("File Upload Failed");
      });
    } else {
      sendForApproval(
        reference,
        [reference_id],
        delegationVersion ? [delegationVersion] : null
      ).then((result) => {
        if (result) {
          handleBackList();
        }
      });
    }
  };

  const handleSaveAsDraft = () => {
    if (selectedFile.length > 0) {
      onSubmit(event).then((result) => {
        console.log(result);
        result
          ? swalSuccess("Saved As Draft").then(handleBackList)
          : swalError("File Upload Failed");
      });
    } else {
      swalSuccess("Saved As Draft").then(handleBackList);
    }
  };

  //get image state
  const [selectedFile, setSelectedFile] = useState();
  const [fileNames, setFileNames] = useState();

  const fileChange = (names, files) => {
    setSelectedFile(files);
    setFileNames(Object.values(names));
  };

  // On file upload (click the upload button)
  const onSubmit = async (e) => {
    e.preventDefault();
    const params = new FormData();
    params.append("attach_config_slug", reference);
    params.append("reference_id", reference_id);

    for (const key of Object.keys(selectedFile)) {
      params.append(`file_name[${key}]`, fileNames[key]);
      params.append("file", selectedFile[key]);
    }

    return await fetchWrapper
      .post("attachment/upload", params, {
        "Content-Type": "multipart/form-data",
      })
      .then(function (response) {
        if (!response.error) {
          console.log(response.data);
          formReset();
          sendSuccess(response.data);
          return true;
        } else {
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
  };

  return (
    <Row gutter={24}>
      <Col span={24}>
        <div style={{ minHeight: "400px", position: "relative", zIndex: 1 }}>
          <div className="container">
            <form onSubmit={onSubmit}>
              <FileUpload
                ref={ref}
                onChange={fileChange}
                upload_btn={false}
                reference={reference}
                reference_id={reference_id}
                reloadAttachments={reloadAttachments}
              />

              <div className="form-group mt-2">
                {backLink && (
                  <Button onClick={handleBackList} className="tbn btn-sm mr-2">
                    Back To List
                  </Button>
                )}

                {/* <button className="btn btn-sm btn-primary mr-2" type="submit">
                  Upload
                </button> */}
                <button
                  className="btn btn-sm btn-danger mr-2"
                  type="button"
                  onClick={formReset}
                >
                  Reset
                </button>

                {draftButton != false && (
                  <button
                    onClick={handleSaveAsDraft}
                    className="btn btn-sm btn-primary mr-2"
                  >
                    {draftText}
                  </button>
                )}

                {approvalButton != false && (
                  <button
                    onClick={handleForApprove}
                    className="btn btn-sm btn-success mr-2"
                  >
                    Send For Approval
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ApsisAttachment;
