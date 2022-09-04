import { Wrapper } from "@/components/styles/Taskboard";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalError, swalSuccess } from "@/apsisEngine/helpers/helperService";

import {
  EditOutlined,
  DeleteFilled,
  ArrowsAltOutlined,
} from "@ant-design/icons";

const DemoTable2 = forwardRef((props, ref) => {
  const [dataSource, setDataSource] = useState(props.obj ?? []);
  DemoTable2.displayName="DemoTable2";
  const modifyData = (data) => {
    // const modifyData = data.map((node) => {
    //   return {
    //     ...node,
    //     expanded: true,
    //   };
    // });
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
        element['expanded'] = true;
      if (element.children && element.children.length != 0) {
        modifyData(element.children);
      }
    }
    return data;
  };

  useEffect(() => {
    const mData = modifyData(props.obj);
    setDataSource(mData);
  }, [props.obj]);

  const removeNode = async (record) => {
    //console.log(record);
    const ID = record.node.menu_id;
    await fetchWrapper
      .delete(`menu/${ID}`)
      .then((res) => {
        if (!res.error) {
          swalSuccess("Deleted Successfully!!!");
        } else {
          swalError(`${res.message}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handelEdit = async (record) => {
    //console.log(record.node)
    const ID = record.node.menu_id;
    await fetchWrapper
      .get(`menu/menuInfo/${ID}`)
      .then((res) => {
        if (props.getvalues) {
          props.getvalues(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Call from parent
  useImperativeHandle(ref, () => ({
    submit() {
      //console.log(dataSource);
      let object = {
        menuTree: dataSource,
      };
      // console.log(object);
      fetchWrapper
        .post("menu/updateMenuStructure", object)
        .then((res) => {
          if (!res.error) {
            swalSuccess(`${res.message}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }));

  const styleChange = () => {
    const x = document.getElementsByClassName("rst__nodeContent");
    let i;
    for (i = 0; i < x.length; i++) {
      let objLeft = x[i].style.left;
      x[i].style.width = `calc(100% - ${objLeft})`;
    }
  };

  useEffect(() => {
    styleChange();
  }, [dataSource]);

  return (

      <SortableTree
        treeData={dataSource}
        onChange={(dataSource) => setDataSource(dataSource)}
        isVirtualized={false}
        generateNodeProps={(rowInfo) => ({
          buttons: [
            <div key={1}>
              <button
                className="btn btn-primary"
                onClick={() => handelEdit(rowInfo)}
              >
                <EditOutlined />
              </button>
              <button
                style={{ marginLeft: ".5rem" }}
                className="btn btn-danger"
                onClick={() => removeNode(rowInfo)}
              >
                <DeleteFilled />
              </button>
            </div>,
          ],
        })}
      />
  );
});

export default DemoTable2;
