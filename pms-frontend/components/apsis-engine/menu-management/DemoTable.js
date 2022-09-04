import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Checkbox,
    Radio,
    Card,
    Table,
} from "antd";
import {
    EditOutlined,
    DeleteFilled,
    ArrowsAltOutlined,
} from "@ant-design/icons";

// https://github.com/raisezhang/react-drag-listview
//const ReactDragListView = window["react-drag-listview"];
import ReactDragListView from "react-drag-listview";

import React, { useEffect, useState } from "react";

const DemoTable = (props) => {
    const [dataSource, setDataSource] = useState(props.obj ?? []);

    const handelEdit = (record) => {
        console.log(record);
    };
    const columns = [
        {
            title: "Swap",
            key: "swap",
            render: (text, record, index) => (
                <a className="drag-handle" href="#">
                    <ArrowsAltOutlined style={{ fontSize: "20px" }} />
                </a>
            ),
            align: "center",
        },
        {
            title: "Menu Name",
            dataIndex: "label",
            key: "menuName",
        },
        {
            title: "Action",
            key: "operate",
            render: (text, record, index) => (
                <>
                    <button
                        className="btn btn-primary"
                        onClick={() => handelEdit(record)}
                    >
                        <EditOutlined />
                        Edit
                    </button>
                    <button
                        style={{ marginLeft: ".5rem" }}
                        className="btn btn-danger"
                        onClick={() => handelEdit(record)}
                    >
                        <DeleteFilled />
                        Delete
                    </button>
                </>
            ),
            align: "center",
        },
    ];

    const modifyData = (data) => {
        data.map((item, index) => {
            if (item.children && item.children.length != 0) {
                modifyData(item.children);
            } else {
                delete item.children;
            }
        });

        //console.log(data);
        return data;
    };

    useEffect(() => {
        const mData = modifyData(props.obj);
        //console.log(mData);
        setDataSource(mData);
    }, [props.obj]);

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const data = [...dataSource];
            const item = data.splice(fromIndex, 1)[0];
            data.splice(toIndex, 0, item);
            setDataSource(data);
        },
        handleSelector: "a",
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const data = [...dataSource];
    console.log(data);

    return (
        <div style={{ marginRight: "1.3rem" }}>
            <ReactDragListView {...dragProps}>
                <Table columns={columns} pagination={false} dataSource={data} />
            </ReactDragListView>
        </div>
    );
};

export default DemoTable;
