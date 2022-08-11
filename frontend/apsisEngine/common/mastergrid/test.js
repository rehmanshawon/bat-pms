import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
} from "react";

import { Row, Col, Button, Input, Space, Table } from "antd";

import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import SearchComponent from "@/apsisEngine/common/search";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { columnShorter } from "@/apsisEngine/helpers/sorter";
import GridAction from "./gridAction";
import {
  apsisDate,
  apsisMoney,
  apsisQuantity,
} from "@/apsisEngine/helpers/helpers";

export const MasterGrid = React.forwardRef(
  (
    {
      title,
      slug,
      value,
      extra,
      headerFixed,
      is_multiple,
      is_selectable = true,
      primaryKey,
      handleClick,
      getSelectedRows,
      getSelectedKeys,
      rawtable,
      disableIds,
      mode,
      extraButtons,
      getAllValue,
      disableButtons,
      pager = [10, 20, 30, 50, 100],
      ...rest
    },
    ref
  ) => {
    const isMounted = useRef(false);
    let searchInput = "";

    const [gridTitle, setGridTitle] = useState(title);
    const [columnState, setColumnState] = useState();

    const [primaryKeyField, setPrimaryKeyField] = useState(primaryKey);

    const [columnData, setColumnData] = useState([]);
    const [griData, setGridData] = useState([]);
    const [sourceData, setSourceData] = useState([]);

    //const pagination for table
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagerOptions, setPagerOptions] = useState(pager);

    const [is_serial, setSerial] = useState(false);
    const [is_clientSide, setClientSide] = useState(false);
    // const [is_selectable, setSelectable] = useState(true);

    //for input search
    const [inputState, setInputState] = useState({});

    //for search panel
    const [search_panel, setSearchPanel] = useState({});
    const [searchState, setSearchState] = useState([]);
    const [error, setErrors] = useState("");

    const [loading, setLoading] = useState(false);
    const [selectedLoading, setSelectedLoading] = useState(false);

    //this for selected item rows
    const [selectionType, setSelectionType] = useState("checkbox");
    const [selectedIds, setSelectedIds] = useState([]);
    const [curInstanceIds, setCurInstanceIds] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [initialButtons, setInitialButtons] = useState([]);
    const [buttonData, setButtonData] = useState([]);

    //export buttons
    const [exportExcel, setExportExcel] = useState(0);
    const [exportPdf, setExportPdf] = useState(0);
    const [exportCsv, setExportCsv] = useState(0);
    const [exportPrinting, setExportPrinting] = useState(0);

    const [reviseButton, setReviseButton] = useState([]);

    //file Name generate
    const fileName =
      rest.fileName || "document_" + Math.random().toString(36).substring(7);

    //search input handler
    const handleInput = (event) => {
      setInputState({ ...inputState, [event.target.name]: event.target.value });
    };

    /*
     * Generate Unique iem
     */
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    //Call from parent
    useImperativeHandle(ref, () => ({
      fetchInfo() {
        console.log("Call from parent 1");
        fetchTitle();
        if (!is_clientSide) {
          console.log("Call from parent 2");
          fetchData();
        }
      },
    }));

    const buttonFilter = (buttons) => {
      if (!buttons) return;
      let button = [];
      for (const [i, bt] of buttons.entries()) {
        if (bt.always_show == 1) {
          let btnItem = {
            name: bt?.btn_name,
            type: bt?.btn_type,
            id: bt?.btn_id,
            btn_class: bt?.btn_class,
            icon: bt?.btn_icon,
            slug: bt?.btn_slug,
            link: bt?.route_link,
            in_dropdown: bt?.in_dropdown,
            always_show: bt?.always_show,
            enable_status: bt?.enable_status,
            disable_status: bt?.disable_status,
            enable_multiple: bt?.enable_multiple,
          };
          button.push(btnItem);
        }
      }

      return button;
    };

    const buttons = useMemo(() => buttonFilter(buttonData), [buttonData]);

    /*
     * master grid Selection
     */
    const rowSelection = {
      getCheckboxProps: (record) => ({
        disabled: disableIds ? disableIds.includes(record.key) : false,
        key: record.key,
      }),

      onChange: (selectedRowKeys, selectedRows) => {
        //set selected ids
        setSelectedIds(selectedRowKeys);

        //selected item
        const selectItem = selectedRowKeys.map(function (item) {
          return String(item);
        });

        // //update with previous state
        if (selectionType == "checkbox") {
          const removeIds = curInstanceIds.filter(
            (id) => !selectItem.includes(id)
          );

          let newSelectedIds = selectedIds
            ? selectedIds.filter((id) => !removeIds.includes(id))
            : [];

          setSelectedIds([...newSelectedIds, ...selectItem].filter(onlyUnique));

          //filter selected Items
          const filteredSelectedItems = selectedData.filter(
            (item) => !curInstanceIds.includes(item.key)
          );

          //generate selected rows
          let newSelectedItems = [...filteredSelectedItems, ...selectedRows];
          setSelectedData(newSelectedItems);
        } else {
          //update selected ids
          setSelectedIds(selectItem);

          //update selected rows
          setSelectedData(selectedRows);
        }
      },
    };

    //column search component
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleColumnSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleColumnSearch(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
      render: (text) =>
        columnState?.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[columnState.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });

    //column search
    const handleColumnSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setColumnState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setColumnState({ searchText: "" });
    };

    //when change table field like filter, pagination
    const handleChange = (pagination, filters, sorter) => {
      //when change pager
      setPerPage(pagination.pageSize);
      setCurrentPage(pagination.current);
      //when short filter
      setColumnState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    };

    //Get Master Grid Title
    const fetchTitle = async () => {
      setLoading(true);

      await fetchWrapper
        .post("master-grid/grid-title", {
          slug: slug,
          extra: { ...extra },
          search_key: inputState,
          search_data: searchState ?? [],
        })
        .then(async (res) => {
          const {
            master_grid_title,
            buttons,
            page_customize,
            export_excel,
            export_pdf,
            export_csv,
            export_printing,
            client_side,
            serial,
            checkbox,
            primary_key_field,
            search_panel,
            total_item,
            columns,
            items,
          } = res.data;

          //Set Grid Title
          if (!title) {
            setGridTitle(master_grid_title);
          }

          //set total rows
          setTotalRows(total_item);

          if (
            page_customize &&
            page_customize.split(",") &&
            page_customize.split(",").length > 1
          ) {
            //pager option
            setPagerOptions(page_customize.split(","));

            //set per page
            setPerPage(parseInt(page_customize.split(",")[0]));
          }

          //set selection type
          setSelectionType(checkbox ? "checkbox" : "radio");

          //set primary key
          setPrimaryKeyField(String(primary_key_field));

          //set is serial
          setSerial(serial ?? false);

          //set is client side
          setClientSide(client_side ?? false);

          //set search config
          setSearchPanel(search_panel);

          //set buttons
          setInitialButtons(buttons);
          setButtonData(buttons);

          //set Export Buttons
          setExportExcel(export_excel);
          setExportPdf(export_pdf);
          setExportCsv(export_csv);
          setExportPrinting(export_printing);

          //generate and filter column data
          let generatedColumn = [];
          if (parseInt(serial) == 1) {
            let serialColumn = [
              {
                title: "SL",
                dataIndex: "serial",
                key: "serial",
                link: false,
                sortable: true,
                text_align: "right",
                field_type: "text",
              },
            ];

            //set column state
            generatedColumn = [...serialColumn, ...columns];
          } else {
            generatedColumn = columns;
          }

          //set column data
          const filteredColumn = generatedColumn.map((column) => {
            if (column.sortable) {
              column.sorter = (a, b) => {
                return columnShorter(a, b, column);
              };
            }

            const render = (value, row, index) => {
              if (column.link) {
                return (
                  <a
                    style={{
                      display: "block",
                      textAlign: column.text_align ?? "left",
                    }}
                    href={value.link ?? "#"}
                  >
                    {value.value}
                  </a>
                );
              }

              if (column.field_type == "date") {
                return (
                  <span
                    style={{
                      display: "block",
                      textAlign: column.text_align ?? "left",
                    }}
                  >
                    {apsisDate(value)}
                  </span>
                );
              }

              if (column.field_type == "number") {
                return (
                  <span
                    style={{
                      display: "block",
                      textAlign: column.text_align ?? "right",
                    }}
                  >
                    {apsisQuantity(value, row.hidden_uom)}
                  </span>
                );
              }

              if (column.field_type == "money") {
                return (
                  <span
                    style={{
                      display: "block",
                      textAlign: column.text_align ?? "right",
                    }}
                  >
                    {apsisMoney(value, row.hidden_currency)}
                  </span>
                );
              }

              return (
                <span
                  style={{
                    display: "block",
                    textAlign: column.text_align ?? "left",
                  }}
                >
                  {value}
                </span>
              );
            };

            return {
              ...column,
              ...getColumnSearchProps(column.dataIndex),
              render,
            };
          });

          //when client side table store table data
          if (client_side) {
            const data = items.map((item) => {
              return {
                key: String(item[primary_key_field]),
                ...item,
              };
            });
            //set current instance
            setCurInstanceIds(data.map((item) => item.key));
            setGridData(data);
          }
          setSelectedIds([]);
          //set filtered column
          setColumnData(filteredColumn);
        })
        .catch((err) => console.log(err));

      //loading false
      setLoading(false);
    };

    //fetch Data
    const fetchData = async (searchData = null) => {
      const res = await fetchWrapper
        .post("master-grid/grid-data", {
          slug: slug,
          extra: { ...extra },
          page: currentPage,
          per_page: perPage,
          search_key: inputState,
          search_data: searchState ?? [],
        })
        .then((res) => {
          if (res.data && res.data.items) {
            //set response data
            const responseData = res.data.items;

            const data = responseData.map((item, index) => {
              return {
                key: String(item[primaryKeyField]),
                ...item,
              };
            });

            //set current instance
            setCurInstanceIds(data.map((item) => item.key));

            //set Master grid data
            setGridData(data);
            if (getAllValue) {
              getAllValue(data);
            }
          }
        });
    };

    //Add Serial Number
    const generateSerial = (rsp_data, currentPage, perPage) => {
      let incPage = parseInt((parseInt(currentPage) - 1) * perPage) + 1;
      rsp_data.forEach((data, index) => {
        data.serial = index + incPage;
      });
      return rsp_data;
    };

    //button intersections
    const getArraysIntersection = (oldArr, newArr) => {
      return oldArr.filter(function (n) {
        return newArr.indexOf(n) !== -1;
      });
    };

    //handle Search Panel
    const handleSearch = (query) => {
      setSearchState(query);
    };

    //Generate Action Buttons
    const generateActionButtons = (rows) => {
      let number_items = rows.length || 0;
      let newButtons = [];
      let btnArray = [];

      if (rows && rows.length > 0) {
        for (const [i, item] of rows.entries()) {
          let act_buttons = item.action.buttons
            ? item.action.buttons.split(",")
            : [];
          //store buttons
          if (btnArray.length == 0) {
            btnArray = act_buttons;
          } else {
            btnArray = getArraysIntersection(act_buttons, btnArray);
          }
        }

        if (buttonData.length) {
          for (const [i, button] of buttonData.entries()) {
            if (number_items > 1 && button.enable_multiple == 0) {
              //set button is display
              let btn = { ...buttonData[i], always_show: 0 };
              //push button
              newButtons.push(btn);
            } else {
              if (btnArray.includes(button.btn_name)) {
                let btn = { ...buttonData[i], always_show: 1 };
                newButtons.push(btn);
              } else {
                let btn = { ...buttonData[i], always_show: 0 };
                newButtons.push(btn);
              }
            }
          }
        }
        //set new button states
        setButtonData(newButtons);
      } else {
        //set new button states
        setButtonData(initialButtons);
      }

      //pass rows to parent
      if (getSelectedRows) getSelectedRows(rows);
      if (getSelectedKeys) getSelectedKeys(selectedIds);
    };

    //selected ids
    useEffect(async () => {
      if (value && value.constructor === String) {
        setSelectedIds(value.split(","));
      } else if (value && value.constructor === Number) {
        setSelectedIds([String(value)]);
      } else if (value && Array.isArray(value)) {
        setSelectedIds(value.map(String));
      } else {
        setSelectedIds([]);
      }
    }, [value]);

    //load initial column data and table data
    useEffect(async () => {
      isMounted.current = true;
      if (slug) {
        console.log("load initial column data and table data");
        await fetchTitle();
      }
    }, [extra, slug]);

    //when master grid server side
    useEffect(async () => {
      if (
        griData.length == 0 &&
        primaryKeyField &&
        !is_clientSide &&
        !isMounted.current
      ) {
        console.log("when master grid server side");
        await fetchData();
      }
    }, [primaryKeyField, is_serial]);

    // when Checked and unchecked
    // useEffect(async () => {
    //   if (isMounted.current) {
    //     await fetchTitle();
    //   }
    // }, [inputState, searchState]);

    //when Checked and unchecked
    useEffect(async () => {
      if (isMounted.current && primaryKeyField) {
        console.log("when Checked and unchecked");
        await fetchData();
      }
    }, [inputState, searchState, is_serial, perPage, currentPage]);

    //Data Filer
    useEffect(async () => {
      setSourceData(generateSerial(griData, currentPage, perPage));
    }, [griData]);

    //when change selected id
    useEffect(() => {
      generateActionButtons(selectedData);
    }, [selectedData]);

    useEffect(() => {
      const buttonList = [...buttons, ...(extraButtons ?? [])];
      if (disableButtons && disableButtons.length > 0) {
        const newButtonList = buttonList.filter(
          (button) => !disableButtons.includes(button.id)
        );
        setReviseButton(newButtonList);
      } else {
        setReviseButton(buttonList);
      }
    }, [disableButtons, buttons, extraButtons]);

    return (
      <Fragment>
        <div className="master_grid">
          <div className="title_area">
            <div className="gridTitle">
              <h6>
                <span className="fa fa-list mr-2"></span> {gridTitle}
              </h6>
            </div>
          </div>
          {search_panel && search_panel?.search_fields && (
            <SearchComponent
              callFrom={`master`}
              searchConfig={search_panel}
              setQuery={handleSearch}
              defaultSearchValues={rest.defaultSearchValues}
            />
          )}

          <Row className="action-rows">
            <Col span={8}>
              {!rawtable && (
                <div className="search-filter">
                  <Input
                    type="text"
                    autoComplete="off"
                    name="search_text"
                    value={inputState.search_text ?? ""}
                    onChange={handleInput}
                  />
                  <span className="icon">
                    <i className="fa fa-search" />
                  </span>
                </div>
              )}
            </Col>

            <Col span={16} style={{ textAlign: "right" }}>
              <GridAction
                title={gridTitle}
                buttons={reviseButton}
                fileName={fileName}
                slug={slug}
                extra={extra}
                is_serial={is_serial}
                inputState={inputState}
                searchState={searchState}
                clickHandler={handleClick}
                selectedRows={selectedData}
                selectedRowKeys={selectedIds}
                exportExcel={exportExcel}
                exportPdf={exportPdf}
                exportCsv={exportCsv}
                exportPrinting={exportPrinting}
                // hideCreateButton={selectedIds.length > 0}
              />
            </Col>
          </Row>

          {columnData && columnData.length > 0 && (
            <Table
              className={`grid-table ${!is_selectable ? "disable_select" : ""}`}
              rowSelection={{
                type: selectionType,
                selectedRowKeys: selectedIds,
                ...rowSelection,
              }}
              columns={columnData}
              dataSource={sourceData}
              onChange={handleChange}
              pagination={
                rawtable == true
                  ? false
                  : {
                      defaultPageSize: perPage,
                      showSizeChanger: true,
                      pageSizeOptions: pagerOptions || [10, 20, 50, 100],
                      total: totalRows,
                    }
              }
              {...rest}
            />
          )}
        </div>
      </Fragment>
    );
  }
);
export default MasterGrid;
