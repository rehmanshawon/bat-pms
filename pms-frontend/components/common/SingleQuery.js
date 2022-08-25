import { FormTextArea, swalError } from "apsisEngine/common/formValidations";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Button, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import QueryLog from "./QueryLog";

const SingleQuery = ({ slug, code, alwaysShow = false }) => {
  const [formState, setFormState] = useState({});
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [initiator, setInitiator] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const stateChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    let payload = {};
    payload.comments = formState.comments;
    payload.slug = slug;
    payload.code = code;
    if (formState.comments) {
      await fetchWrapper
        .post("delegation/delegation-query-insert", payload)
        .then((response) => {
          if (!response.error) {
            setLoading(false);
            setFormState({});
            setData(response.data.frdata);
          } else {
            swalError("Something wrong! please try with appropriate data");
            setLoading(false);
          }
        });
    } else {
      swalError("Please Enter a message");
      setLoading(false);
    }
  };

  const getQueryLogData = async () => {
    const response = await fetchWrapper.get(
      `delegation/delegation-query-get/${slug}/${code}`
    );
    setData(response.data.frdata);
    setInitiator(response.data.act_comments_data?.created_by);
  };

  const checkConstraints = (initiator) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.user_id === initiator) {
      setIsInitiator(true);
    }
  };

  //get on load data
  useEffect(() => {
    getQueryLogData();
  }, [slug, code]);

  useEffect(() => {
    checkConstraints(initiator);
  }, [initiator]);

  return (
    <>
      <Spin spinning={loading}>
        <div className="main-wrap">
          <div className="card card-xl-stretch p-2 border-0">
            <div className="pb-2">
              <QueryLog data={data} />
            </div>

            {(data && data.length > 0 && isInitiator) || alwaysShow ? (
              <>
                <div>
                  <h6 className="section-title">
                    Comment <span style={{ color: "red" }}>*</span>
                  </h6>
                  <FormTextArea
                    value={formState?.comments}
                    name="comments"
                    getEvent={stateChange}
                  />
                </div>
                <div className="section-footer mt-3">
                  <Row style={{ float: "right", paddingBottom: 4 }}>
                    <div style={{ paddingRight: 2 }}>
                      <Button
                        size="middle"
                        type="primary"
                        htmlType="submit"
                        className="btn btn-primary"
                        onClick={onSubmit}
                      >
                        <i
                          style={{ paddingRight: 5 }}
                          className="fa fa-send"
                        ></i>{" "}
                        Send
                      </Button>
                    </div>
                  </Row>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Spin>
    </>
  );
};

export default SingleQuery;
