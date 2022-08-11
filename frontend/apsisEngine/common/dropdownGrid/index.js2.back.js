import React, { useMemo, useEffect, useState, useContext } from "react";
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
import SearchPanel from "@/apsisEngine/common/mastergrid/searchPanel";

const DropdownGrid = React.forwardRef((props, ref) => {
  const slug = props.slug || false;
  const extra = props.extra || false;
  const displaySelected = props.displaySelected || false;
  const name = props.name || false;
  const is_multiple = props.is_multiple || false;
  const primaryKeyField = props.valueKey || "hidden_id";
  const labelKey = props.labelKey || false;

  const [selectedIds, setSelectedIds] = useState(
    (props.selectedValue &&
      props.selectedValue.map(function (item) {
        return String(item);
      })) ||
      []
  );

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

  const [searchOptions, setSearchOptions] = useState({});

  const [inputState, setInputState] = useState("");
  const [searchState, setSearchState] = useState([]);

  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleClose = () => {
    console.log("Clicked cancel button");
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
        setTotalRows(res.data.total_item);
        setIsSelectable(res.data.checkbox);
        setSerial(res.data.serial);
        setSearchOptions(res.data.search_panel);
        // setPrimaryKeyField(res.data.primary_key_field);

        //set column state
        const columns = res.data.columns.map((column) => {
          return {
            ...column,
            title: column.title.toUpperCase(),
          };
        });

        setColumnData(columns);
        fetchSelectedTitle(columns);

        //set column data

        //fetch Grid Data
        // await fetchData();
      })
      .catch((err) => console.log(err));
  };

  //fetch Data
  const fetchData = async (searchData = null) => {
    const key_field = primaryKeyField.replace("hidden_", "");
    const selectedArray = selectedIds.map((x) => "'" + x + "'").toString();

    let extra_condition =
      selectedArray.length > 0
        ? { extra_condition: key_field + " NOT IN ( " + selectedArray + " )" }
        : {};

    const res = await fetchWrapper
      .post("master-grid/grid-data", {
        slug: slug,
        extra: extra_condition,
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

          //   if (selectedData.length == 0) {
          //     //set selected levels and selected items
          //     const selectedIds = props.selectedValue.map(function (item) {
          //       return String(item);
          //     });
          //     const selectedItems = responseData.filter((item) => {
          //       if (selectedIds.includes(item[primaryKeyField])) return item;
          //     });
          //     generateSelectedItem(selectedItems);

          //     //selected Level
          //     let items = selectedItems.map((item) => item[labelKey]);
          //     setSelectedLevel(items);
          //   }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Fetch Select Titles
  const fetchSelectedTitle = (columns = []) => {
    // const res = await fetchWrapper.post( 'master-grid/grid-title', {extra:[], slug:slug})
    // .then(res => {
    //     //set column state
    //     const columns = res.data.columns.map((column) => {
    //         return {
    //             ...column,
    //             title: column.title.toUpperCase(),
    //         };
    //     });

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
    // })
    // .catch(err => console.log(err));
  };

  const fetchSelectedData = async (itemArray = false) => {
    if (selectedIds.length <= 0) {
      setSelectedData([]);
      setSelectedLevel([]);
    } else {
      const key_field = primaryKeyField.replace("hidden_", "");
      const selectedArray = selectedIds.map((x) => "'" + x + "'").toString();

      let   =
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
        })
        .catch((error) => {
          console.log(error);
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
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

      //set selected level
      //   let items = selectedRows.map((item) => item[labelKey]);
      //   setSelectedLevel((prev) => {
      //     return [...prev, ...items];
      //   });
      //update selected items
      //   addSelectedData(selectedRows);

      //selected item
      const selectItem = selectedRowKeys.map(function (item) {
        return String(item);
      });

      //update with previous state
      setSelectedIds((prev) => {
        return [...prev, ...selectItem];
      });
    },
  };

  //Remove Selection
  const handleDelete = (item) => {
    if (!item) return false;
    swalConfirm("to delete this item")
      .then((rsp) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInput = (event) => {
    const { value } = event.target;
    setInputState(value);
    // filterData(value);
  };

  //client side filter
  //   const filterData = (value = null) => {
  //     if (!value) setFilterData(grid_data);
  //     const filteredData = grid_data.filter((entry) => {
  //       let item = false;
  //       columnData.map((element) => {
  //         if (
  //           entry[element.dataIndex] &&
  //           entry[element.dataIndex].includes(value)
  //         ) {
  //           item = true;
  //         }
  //       });
  //       return item;
  //     });
  //     setFilterData(filteredData);
  //   };

  //handle Search
  const handleSearch = (search_data) => {
    setSearchState(search_data);
    // console.log(search_data);
  };

  //call from parent
  React.useImperativeHandle(ref, () => ({
    //getData() { fetchData(1, perPage, is_serial, searchStat); }
  }));

  //Initial window load
  useEffect(async () => {
    // setSelectedIds(
    //   props.selectedValue.map(function (item) {
    //     return String(item);
    //   }) || []
    // );
    // await fetchTitle().then(async () => {
    //   await fetchSelectedData();
    // });
    await fetchTitle();
  }, []);

  //when Checked and unchecked
  useEffect(async () => {
    await fetchData();
    await fetchSelectedData();
  }, []);

  //when Checked and unchecked
  useEffect(async () => {
    await fetchData();
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

      {displaySelected && (
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
      )}

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
        {searchOptions !== undefined && searchOptions.length > 0 && (
          <SearchPanel
            is_master={true}
            searchPanel={searchOptions}
            handleClick={handleSearch}
          />
        )}

        <div className="search-filter">
          <Input
            type="text"
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
          pagination={{ pageSize: 2 }}
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
