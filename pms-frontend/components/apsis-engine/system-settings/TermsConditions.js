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
import { Form, Row, Col, Input, Card, Tabs, Button } from "antd";
import moment from "moment";
import { useRouter } from "next/router";

const TermsConditions = ({
  slug,
  terms,
  setTerms,
  moduleId,
  newChange,
  setNewChange,
}) => {
  const [change, setChange] = useState(1);

  const addTermValue = (event, termValue) => {
    //console.log(termValue)
    termValue[event.target.name] = event.target.value;
    setChange(change + 1);

    if (termValue.config_id) {
      setNewChange({
        ...newChange,
        [termValue.config_id]: termValue,
      });
    }
  };

  const addTerms = () => {
    setTerms([
      ...terms,
      {
        config_slug: slug,
        config_key: "",
        config_value: "",
        module_id: moduleId,
      },
    ]);
  };
  const removeTerms = (i, value) => {
    const newTerms = [...terms];
    newTerms.splice(i, 1);
    setTerms(newTerms);

    let delete_id = {};
    delete_id.ids = [value.config_id];
    fetchWrapper
      .patch("/config/delete", delete_id)
      .then((response) => {
        if (!response.error) {
          swalSuccess(response.message);
        } else {
          swalError(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function convertWord(str) {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(" ");
  }

  return (
    <>
      <div className="title_area">
        <div className="gridTitle">
          <h5>
            <span className=" mr-2"></span> {convertWord(slug)}
          </h5>
        </div>

        <div className="gridTitle">
          <Button onClick={addTerms} type="primary">
            <i className="fa fa-plus mr-1"></i> <strong>Add</strong>
          </Button>
        </div>
      </div>

      <div className="form-section">
        <div className="section-body">
          <div className="section-body p-3">
            <Row gutter={16}>
              <div className="col-lg-12 pl-2">
                <div className="row">
                  <div className="col-lg-5">
                    <label className="pb-2">Key</label>
                  </div>
                  <div className="col-lg-5">
                    <label className="pb-2">Value</label>
                  </div>
                </div>

                {terms &&
                  terms.map((term, i) => (
                    <div key={i} className="row mb-2">
                      <div className="col-lg-5 pb-2">
                        {/* <label className="pb-2">Key</label> */}
                        <Input
                          name="config_key"
                          value={term.config_key}
                          onChange={(e) => addTermValue(e, term)}
                          type="text"
                        ></Input>
                      </div>
                      <div className="col-lg-5">
                        {/* <label className="pb-2">Value</label> */}
                        <Input
                          name="config_value"
                          value={term.config_value}
                          onChange={(e) => addTermValue(e, term)}
                          type="text"
                        ></Input>
                      </div>
                      <div className="col-lg-1">
                        {terms.length > 1 && (
                          <div className="d-flex flex-column">
                            {/* <label className="invisible">Remove</label> */}
                            <Button
                              size="small"
                              onClick={() => removeTerms(i, term)}
                              type="danger"
                            >
                              <i className="fa fa-times"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
