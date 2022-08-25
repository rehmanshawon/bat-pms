/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import styles from "./FileUpload.module.css";
import {
  swalConfirm,
  swalError,
  swalSuccess,
} from "apsisEngine/helpers/helperService";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";

const getExtension = (type) => {
  if (type.startsWith("text")) {
    return "txt";
  }
  const typeName = type.split("/")[1];
  if (typeName == "vnd.ms-excel") {
    return "xls";
  }
  if (typeName == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return "xlsx";
  }
  return typeName;
};

const allowedFileTypes = (types) => {
  const fileTypes = types.split(",").map((type) => getExtension(type));
  return fileTypes.join(", ");
};

// eslint-disable-next-line react/display-name
export const FileUpload = React.forwardRef((props, ref) => {
  const { reference, reference_id, reloadAttachments } = props;
  const [fileState, setFileState] = useState([]);
  const [names, setNames] = useState([]);
  const [attachConfigs, setAttachConfigs] = useState({});
  const [files, setFileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const { mode, deleteBtn } = props;

  const onFileChange = (event) => {
    let namesArr = [...names];
    let fileArr = [...fileState];

    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (
          attachConfigs.allowed_type.includes(event.target.files[i].type) &&
          event.target.files[i].size / 1000 <= attachConfigs.allowed_size
        ) {
          let fname = event.target.files[i].name;
          let name = fname.split(".").slice(0, -1).join(".");
          namesArr.push(name);
          fileArr.push(event.target.files[i]);
        } else {
          swalError(
            "Upload file ( " + event.target.files[i].name + " ) is not allowed"
          );
        }
      }
      setFileState(fileArr);
      setNames(namesArr);
    }
  };

  const changeName = (e) => {
    let index = e.target.name.replace("file_name_", "");
    let namesArr = [...names];
    namesArr[index] = e.target.value;
    setNames(namesArr);
  };

  //remove item which upload
  const removeCurrent = (index) => {
    let fileArr = [...fileState];
    let namesArr = [...names];
    if (index !== -1) {
      fileArr.splice(index, 1);
      namesArr.splice(index, 1);
      setFileState(fileArr);
      setNames(namesArr);
      $("#files").val();
    }
  };

  const handleRemove = (index) => {
    swalConfirm("to remove this")
      .then((result) => {
        if (result.isConfirmed) {
          removeCurrent(index);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createTable = () => {
    let table = [];
    if (fileState && fileState.length > 0) {
      for (let i = 0; i < fileState.length; i++) {
        //if(allowFormate.indexOf(fileState[i].type) > -1){
        table.push(
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <input
                name={"file_name_" + i}
                key={i}
                onChange={changeName}
                value={names[i]}
                className={styles.fileName}
                autoComplete="off"
              />
            </td>
            <td>
              <span className={styles.shorter}>{fileState[i].name}</span>
            </td>
            <td>
              <span className={styles.shorter}>{fileState[i].type}</span>
            </td>
            <td className={styles.textcenter}>
              <button
                className={styles.remove_btn}
                onClick={() => handleRemove(i)}
                value={i}
                type="button"
              >
                <i className="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        );
        //}
        // else{
        //     //remove state
        //     removeCurrent(i);
        //     //show alert
        //     swalError(fileState[i].type +" Not Allowed");
        // }
      }
    }
    return table;
  };

  //remove form Old List
  const removeFromList = async (ref, log_id) => {
    let rsp = await swalConfirm("to remove this")
      .then((result, agree) => {
        if (result.isConfirmed) {
          let delItem = fetchWrapper.patch("/attachment/delete-files", {
            attach_config_slug: ref,
            attach_log_id: [log_id],
          });
          return delItem;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (rsp.data && rsp.message == "successfull") {
      setFileData(
        files.filter((entity) => {
          return entity.attach_log_id != log_id;
        })
      );
      swalSuccess("Attachment Deleted Successfully!");
    }
  };

  const formReset = () => {
    setFileState([]);
    setNames([]);
    fetchData(reference, reference_id);
    Array.from(document.querySelectorAll("#files")).forEach(
      (input) => (input.value = "")
    );
  };

  //call from parent
  React.useImperativeHandle(ref, () => ({
    formReset,
    getUploadedFiles,
  }));

  const getUploadedFiles = () => {
    return files;
  };

  const fetchData = async (reference, reference_id) => {
    setLoading(true);
    let response = await fetchWrapper.post("attachment/uploaded-files", {
      attach_config_slug: reference,
      reference_id: reference_id,
    });
    setFileData(response.data);
    setLoading(false);
  };

  const uploadNow = async (e) => {
    e.preventDefault();
    try {
      setBtnLoading(true);
      const params = new FormData();
      params.append("attach_config_slug", attachConfigs.attach_config_slug);

      if (reference_id) {
        params.append("reference_id", reference_id);
      } else {
        params.append("reference_id", attachConfigs.attach_config_id);
      }

      if (fileState.length > 0) {
        fileState.map((file, index) => {
          params.append("file_name[]", names[index]);
          params.append("file", file);
        });
      }

      await fetchWrapper
        .post("attachment/upload", params, {
          "Content-Type": "multipart/form-data",
        })
        .then(function (response) {
          if (response.message == "success") {
            formReset();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      setBtnLoading(false);
      swalError(error);
    }
  };

  const getAttachConfigs = async () => {
    await fetchWrapper
      .post("attachment/config", {
        attach_config_slug: reference,
      })
      .then((response) => {
        if (!response.error) {
          setAttachConfigs(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (props.onChange) props.onChange(names, fileState);
  }, [names, fileState]);

  //load attachment form api
  useEffect(async () => {
    await getAttachConfigs();
    if (reference && reference_id) {
      await fetchData(reference, reference_id);
      formReset();
    }
    setLoading(false);
  }, [reference, reference_id, reloadAttachments]);

  return (
    <>
      {attachConfigs.attach_config_slug && (
        <div className={styles.form - group}>
          <div className="row">
            {(!mode || mode != "view") && (
              <div className="col-md-6">
                <h4 className="attachment_title">
                  {attachConfigs.attach_upload_label ?? "Upload File"}
                </h4>
                <div className={styles.formGroup.files}>
                  <div className={styles.inputPlace}>
                    <div>
                      <h5>Choose File </h5>
                      <span>
                        {fileState && fileState.length + " Items Selected "}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    className={styles.filesInput}
                    onChange={onFileChange}
                    multiple
                  />

                  <div
                    className="p-2 text-danger d-flex justify-content-center"
                    style={{ fontSize: "12px" }}
                  >
                    <div>
                      {`Max Size: ${Math.ceil(
                        attachConfigs.allowed_size / 1048576
                      )} MB | `}
                    </div>
                    <div>{` | Allowed Files: ${allowedFileTypes(
                      attachConfigs.allowed_type
                    )}`}</div>
                  </div>
                </div>
                <div className={styles.formGroup.filesList}>
                  <table className={styles.cftable}>
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>New Name</th>
                        <th>File Name</th>
                        {/* <th>Size</th> */}
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{createTable()}</tbody>
                  </table>
                  {attachConfigs.upload_btn &&
                  fileState &&
                  fileState.length > 0 ? (
                    <button className={styles.uplaodBtn} onClick={uploadNow}>
                      <span className="apsis-loader">
                        Upload {btnLoading ? <></> : null}
                      </span>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className={reference_id ? " col-md-6 " : "no-display"}>
                Loading...
              </div>
            ) : (
              <>
                {files.length > 0 || mode == "view" ? (
                  <>
                    <div className={mode === "view" ? "col-md-12" : "col-md-6"}>
                      {(!mode || mode != "view") && (
                        <h4 className="attachment_title">Attachment Items</h4>
                      )}
                      <table className={styles.uploadTable}>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th style={{ width: "90px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {files &&
                            files.map((file, index) => (
                              <tr key={file.attach_log_id.toString()}>
                                <td>{index + 1}</td>
                                <td>
                                  <a
                                    className={styles.imageLink}
                                    href={file?.attach_path}
                                    target="_blank"
                                  >
                                    {file?.attach_name}
                                  </a>
                                </td>
                                <td>{getExtension(file?.attach_mime_type)}</td>
                                <td>
                                  <a
                                    href={file?.attach_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    <button
                                      className={styles.download_btn}
                                      type="button"
                                    >
                                      <i className="fa fa-download"></i>
                                    </button>
                                  </a>
                                  {(!mode || mode != "view") &&
                                    (!deleteBtn || deleteBtn != "hide") && (
                                      <button
                                        className={styles.btn_remove}
                                        value={file.attach_log_id}
                                        onClick={() =>
                                          removeFromList(
                                            file?.attach_config_slug,
                                            file?.attach_log_id
                                          )
                                        }
                                        type="button"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
});
