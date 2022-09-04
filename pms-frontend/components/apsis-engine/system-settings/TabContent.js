import React, { useEffect, useState } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import FormFooter from "@/components/common/FormFooter";
import {
  FormInput,
  FormItem,
  FormSelect,
  swalError,
  swalSuccess,
} from "@/apsisEngine/common/formValidations";
import { Form, Row, Col, Input, Card, Tabs } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import TermsConditions from "./TermsConditions";

const TabContent = ({ slug }) => {
  const [content, setContent] = useState();
  const [moduleId, setModuleId] = useState();

  const [oldData, setOldData] = useState([]);

  const [newChange, setNewChange] = useState([]);

  const getSlugData = async () => {
    let response = await fetchWrapper.get("/config/get-by-slug/" + slug);
    if (!response.error) {
      setModuleId(response.data[0].module_id);
      setContent(response.data);
      setOldData(response.data);
    }
  };

  const submitHandler = () => {
    const newTerms = [];
    content.map((term) => {
      if (!term.config_id) {
        newTerms.push(term);
      }
    });

    let payLoad = [];

    newTerms.map((item) => {
      payLoad.push(item);
    });

    Object.values(newChange).map((value, index) => {
      payLoad.push(value);
    });

    fetchWrapper
      .post("config", payLoad)
      .then((response) => {
        if (!response.error) {
          //console.log(response);
          swalSuccess(response.message);
        } else {
          swalError(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //get on load data
  useEffect(() => {
    if (slug) {
      getSlugData(slug);
    }
  }, [slug]);

  return (
    <>
      <div className="main-wrap">
        <div className="card card-xl-stretch">
          <div className="master_grid">
            <TermsConditions
              slug={slug}
              terms={content}
              setTerms={setContent}
              moduleId={moduleId}
              setNewChange={setNewChange}
              newChange={newChange}
            />

            <div className="d-flex justify-content-end mt-2">
              <FormFooter submitText={"Save"} submitHandler={submitHandler} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabContent;
