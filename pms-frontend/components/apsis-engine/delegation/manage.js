import {
    
    Row,
    Col,
    FormSelect
} from "antd";
<Row
    gutter={16}
    style={{ marginTop: "1rem" }}
>
    {delegation.ref_event_slug?.map(
        (item,i) => (
            <Col
            key={i}
                className="gutter-row"
                span={6}
                style={{}}
            >
                <div className="form-group">
                    <label
                        className={`form-label`}
                    >
                        <b>
                            {" "}
                            {`Select ${item.split(
                                "_"
                            )[0]
                                }`}{" "}
                        </b>
                    </label>
                    <FormSelect
                        name={
                            item.split(
                                "_"
                            )[0]
                        }
                        slug={item}
                        // selectedValue={
                        //   formState.requisition[
                        //     "requisition_branch_id"
                        //   ] ?? ""
                        // }

                        onChange={
                            selectChange
                        }
                    />
                    {refEvent[
                        item.split("_")[0]
                    ] == "" ? (
                        <label>
                            <b
                                style={{
                                    color: "red",
                                }}
                            >{`Please Select ${item.split(
                                "_"
                            )[0]
                                }`}</b>
                        </label>
                    ) : null}
                </div>
            </Col>
        )
    )}
</Row>