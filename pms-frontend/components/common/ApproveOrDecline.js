import { FormItem } from "apsisEngine/common/formValidations";
import { approveOrDecline } from "apsisEngine/helpers/commonFunction";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { swalError } from "apsisEngine/helpers/helperService";
import { Button, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useRouter } from "next/router";

const commentField = {
  input_name: "comment",
  label_name: "",
  required: 0,
  input_type: "textarea",
  element_column: 24,
};

const ApproveOrDecline = ({
  slug,
  codes,
  delegationVersion,
  callbackFunction,
  afterDelegation,
}) => {
  const [form] = useForm();
  const router = useRouter();
  const { query } = router;
  const onSubmit = (mode) => {
    if (mode == "query") {
      if (form.getFieldValue("comment")) {
        let payload = {};
        payload.comments = form.getFieldValue("comment");
        payload.slug = slug;
        payload.code = codes[0];

        fetchWrapper
          .post("delegation/delegation-query-insert", payload)
          .then((response) => {
            if (!response.error) {
              afterDelegation();
            } else {
              swalError("Something wrong! please try with appropriate data");
            }
          });
      } else {
        swalError("Please enter comments!");
      }
    } else {
      if (mode == "decline") {
        if (form.getFieldValue("comment")) {
          approveOrDecline(
            slug,
            codes,
            "decline",
            form.getFieldValue("comment"),
            delegationVersion
          ).then((result) => {
            if (result) {
              if (callbackFunction) {
                callbackFunction();
              }
              if (afterDelegation) {
                afterDelegation();
              }
            }
          });
        } else {
          swalError("Please enter comments!");
        }
      } else {
        approveOrDecline(
          slug,
          codes,
          "approval",
          form.getFieldValue("comment"),
          delegationVersion
        ).then((result) => {
          if (result) {
            if (callbackFunction) {
              callbackFunction();
            }
            if (afterDelegation) {
              afterDelegation();
            }
          }
        });
      }
    }
  };

  return (
    <>
      {!query.history && (
        <div className="mt-3" id="appORdec">
          <h6 className="section-title">Comment</h6>
          <Form form={form}>
            <div>
              <FormItem field={commentField} />
            </div>
            <div className="section-footer pull-right">
              <Button
                size="middle"
                type="primary"
                className="btn btn-primary mr-2"
                onClick={() => onSubmit("query")}
              >
                <i
                  style={{ paddingRight: 5 }}
                  className="fa fa-question-circle"
                ></i>
                Query
              </Button>
              <Button
                size="middle"
                type="danger"
                className="btn btn-danger mr-2"
                onClick={() => onSubmit("decline")}
              >
                <i style={{ paddingRight: 5 }} className="fa fa-ban"></i>Decline
              </Button>

              <Button
                size="middle"
                type="primary"
                className="btn btn-primary "
                onClick={() => onSubmit("approval")}
              >
                <i
                  style={{ paddingRight: 5 }}
                  className="fa fa-check-circle"
                ></i>
                Approve
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default ApproveOrDecline;
