import React, { useMemo, useEffect, useState, useContext, useRef } from "react";
import {
  Modal,
  Button,
  Card,
  Table,
  Tag,
  Space,
  Radio,
  Divider,
  Input,
} from "antd";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";

import { swalConfirm } from "@/apsisEngine/helpers/helperService";
import SearchComponent from "@/apsisEngine/common/search";

const DropdownGrid = React.forwardRef((props, ref) => {
  const isMounted = useRef(false);
  const slug = props.slug || false;
  const extra = props.extra || false;
  const name = props.name || false;
  const is_multiple = props.is_multiple || false;
  const primaryKeyField = props.valueKey || "hidden_id";
  const labelKey = props.labelKey || false;

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedColumn, setSelectedColumn] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);

  const [grid_data, setData] = useState([]);
  const [columnData, setColumnData] = useState([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [is_serial, setSerial] = useState(0);
  const [is_selectable, setIsSelectable] = useState(1);

  const [searchConfig, setSearchConfig] = useState({});

  const [inputState, setInputState] = useState("");
  const [searchState, setSearchState] = useState([]);

  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      if (props.onChange) {
        props.onChange(name, selectedIds, selectedData);
      }
      setVisible(false);
      setConfirmLoading(false);
    }, 1000);
  };

  //fetch title
  const fetchTitle = async () => {
    const res = await fetchWrapper
      .post("master-grid/grid-title", {
        slug: slug,
        extra: [],
      })
      .then(async (res) => {
        const {
          total_item,
          checkbox,
          serial,
          columns,
          primary_key_field,
          search_panel,
        } = res.data;
        setTotalRows(total_item);
        setIsSelectable(checkbox);
        setSerial(serial);
        setSearchConfig(search_panel);
        // setPrimaryKeyField(primary_key_field);

        //set column state
        const tableColumns = columns.map((column) => {
          return {
            ...column,
            title: column.title.toUpperCase(),
          };
        });

        setColumnData(tableColumns);
        fetchSelectedTitle(tableColumns);
      })
      .catch((err) => console.log(err));
  };

  //fetch Data
  const fetchData = async (searchData = null) => {
    const key_field = primaryKeyField.replace("hidden_", "");
    const selectedArray = selectedIds.map((x) => "'" + x + "'").toString();

    let extra_condition = "";
    if (selectedArray.length > 0 && extra) {
      extra_condition = `${key_field} NOT IN ( ${selectedArray} ) and ${extra}`;
    } else if (selectedArray.length > 0) {
      extra_condition = `${key_field} NOT IN ( ${selectedArray} )`;
    } else {
      extra;
    }

    const res = await fetchWrapper
      .post("master-grid/grid-data", {
        slug: slug,
        extra: { extra_condition },
        page: page,
        per_page: perPage,
        search_key: { search_text: inputState },
        search_data: searchState ?? [],
      })
      .then((res) => {
        if (res.data && res.data.items) {
          //set response data
          const responseData = res.data.items;
          const data = responseData.map((item, index) => {
            return {
              key: item[primaryKeyField].toString(),
              ...item,
            };
          });

          setData(data);
        }
      });
  };

  //Fetch Select Titles
  const fetchSelectedTitle = (columns = []) => {
    let gridColumn = columns.length > 0 ? columns : [...columnData];
    let actionColumn = [
      {
        title: "ACTION",
        field_type: "delete_btn",
        link: false,
        dataIndex: "delete_btn",
        key: "delete_btn",
        sortable: false,
        width: "50px",
      },
    ];
    setSelectedColumn([...gridColumn, ...actionColumn]);
  };

  const fetchSelectedData = async (itemArray = false) => {
    if (selectedIds.length <= 0) {
      setSelectedData([]);
      setSelectedLevel([]);
    } else {
      const key_field = primaryKeyField.replace("hidden_", "");
      const selectedArray = selectedIds.map((x) => "'" + x + "'").toString();

      let extra_condition =
        selectedArray.length > 0
          ? { extra_condition: key_field + " IN ( " + selectedArray + " )" }
          : {};

      const res = await fetchWrapper
        .post("master-grid/grid-data", {
          slug: slug,
          extra: extra_condition,
          page: page,
          per_page: perPage,
          // search_key: inputState,
          // search_data: search_state,
        })
        .then((res) => {
          if (res.data && res.data.items) {
            let selectedItems = res.data.items;
            //set selected level
            let items = selectedItems.map((item) => item[labelKey]);
            setSelectedLevel(items);
            generateSelectedItem(selectedItems);
          }
        });
    }
  };

  //delete button component
  const DeleteBtn = (props) => {
    return (
      <button
        key={props.index}
        className={`btn btn-xs del-btn btn-danger`}
        onClick={() => handleDelete(props.primary_key)}
      >
        <i className="fa fa-trash"></i>
      </button>
    );
  };

  const generateSelectedItem = async (rsp_data) => {
    if (rsp_data.length > 0) {
      await rsp_data.forEach((data, index) => {
        data.key = data[primaryKeyField];
        data.delete_btn = (
          <DeleteBtn index={index} primary_key={data[primaryKeyField]} />
        );
      });
    }
    setSelectedData(rsp_data);
  };

  /*
   * master grid Selection
   */
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      //selected item
      const selectItem = selectedRowKeys.map(function (item) {
        return String(item);
      });

      //update with previous state
      if (is_multiple) {
        setSelectedIds((prev) => {
          return [...prev, ...selectItem];
        });
      } else {
        setSelectedIds(selectItem);
      }
    },
  };

  //Remove Selection
  const handleDelete = (item) => {
    if (!item) return false;
    swalConfirm("to delete this item").then((rsp) => {
      if (rsp.isConfirmed) {
        let currentItem = [...selectedIds];
        let currentLevel = [...selectedLevel];

        //get current item
        const index = currentItem.indexOf(item);

        //remove items
        if (index > -1) {
          currentItem.splice(index, 1);
          currentLevel.splice(index, 1);
        }

        //update state
        setSelectedLevel(currentLevel);
        setSelectedIds(currentItem);
      }
    });
  };

  const handleInput = (event) => {
    const { value } = event.target;
    setInputState(value);
  };

  //handle Search
  const handleSearch = (search_data) => {
    setSearchState(search_data);
  };

  //call from parent
  React.useImperativeHandle(ref, () => ({
    //getData() { fetchData(1, perPage, is_serial, searchStat); }
  }));

  //Initial window load
  useEffect(async () => {
    if (
      selectedIds.length == 0 &&
      props.selectedValue &&
      props.selectedValue.length > 0
    ) {
      setSelectedIds(
        props.selectedValue.map(function (item) {
          return String(item);
        })
      );
    }
  }, [props.selectedValue]);

  //Initial window load get grid title
  useEffect(async () => {
    await fetchTitle();
  }, []);

  //when Checked and unchecked
  useEffect(async () => {
    await fetchData();
    await fetchSelectedData();
    isMounted.current = true;
  }, [extra, selectedIds]);

  //when Checked and unchecked
  useEffect(async () => {
    if (isMounted.current) {
      await fetchData();
    }
  }, [inputState, searchState]);

  return (
    <>
      <Button
        type="primary"
        style={{ float: "right" }}
        size={`${props.btn_size ?? "small"}` || "small"}
        className={`${props.className ?? ""}`}
        onClick={showModal}
      >
        {props.btn_text || "Select..."}
      </Button>

      <div
        className={`form-control dropdown_grid_level ${
          selectedLevel.length == 0 ? "no-selected" : ""
        }`}
      >
        {selectedLevel.length > 0
          ? selectedLevel.length > 2
            ? selectedLevel.length + " items"
            : selectedLevel.toString()
          : "Please select"}
      </div>

      <Modal
        visible={visible}
        title={props.title ?? "Basic Dropdown Grid"}
        onOk={handleSubmit}
        onCancel={handleClose}
        width={1000}
        footer={[
          <Button key="back" onClick={handleClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>,
        ]}
        wrapClassName="dropdown-grid"
      >
        {searchConfig && searchConfig?.search_fields && (
          <SearchComponent
            callFrom={`grid`}
            searchConfig={searchConfig}
            setQuery={handleSearch}
          />
        )}

        <div className="search-filter">
          <Input
            type="text"
            autoComplete={"off"}
            name="search_text"
            value={inputState ?? ""}
            onChange={handleInput}
          />
          <span className="icon">
            <i className="fa fa-search" />
          </span>
        </div>

        <Table
          rowSelection={{
            type: is_multiple ? "checkbox" : "radio",
            selectedRowKeys: selectedIds,
            ...rowSelection,
          }}
          dataSource={grid_data}
          columns={columnData}
          pagination={{ pageSize: 15 }}
        />
        <div className="selected-items">
          <h2>Selected Item</h2>
          <Table
            dataSource={selectedData}
            columns={selectedColumn}
            pagination={false}
          />
        </div>
      </Modal>
    </>
  );
});
export default DropdownGrid;
