import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useContext,
  useRef,
} from "react";
import {
  Row,
  Col,
  Dropdown,
  Button,
  Menu,
  Checkbox,
  Form,
  Input,
  Icon,
  Radio,
  Space,
  Switch,
  Divider,
  Table,
} from "antd";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { swalConfirm } from "@/apsisEngine/helpers/helperService";
import SearchComponent from "@/apsisEngine/common/search";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Sorter } from "@/apsisEngine/helpers/sorter";
import moment from "moment";

export const MasterGrid = React.forwardRef(
  (
    {
      title,
      slug,
      value,
      extra,
      headerFixed,
      is_multiple,
      primaryKey,
      pager = [10, 20, 30, 50, 100],
      gridChange,
      ...rest
    },
    ref
  ) => {
    const isMounted = useRef(false);

    const [state, setState] = useState();
    let searchInput = "";

    const [primaryKeyField, setPrimaryKeyField] = useState(primaryKey);
    const [selectionType, setSelectionType] = useState("checkbox");

    const [grid_data, setData] = useState([]);
    const [columnData, setColumnData] = useState([]);

    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagerOptions, setPagerOptions] = useState(pager);

    const [buttonData, setButtonData] = useState([]);
    const [is_serial, setSerial] = useState(0);
    const [is_selectable, setIsSelectable] = useState(1);

    const [inputState, setInputState] = useState({});
    const [search_panel, setSearchPanel] = useState({});
    const [searchStat, setSearchState] = useState({});
    const [error, setErrors] = useState("");

    const [loading, setLoading] = useState(false);
    const [selectedLoading, setSelectedLoading] = useState(false);

    //this for selected item rows
    const [selectedIds, setSelectedIds] = useState(value);

    //table row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User",
        name: record.name,
      }),
    };

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
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
        state?.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });

    //column search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setState({ searchText: "" });
    };

    const handleChange = (pagination, filters, sorter) => {
      setState({
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    };

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length,
        // sortOrder:
        //   state?.sortedInfo?.columnKey == "name" && state?.sortedInfo?.order,
      },
      {
        key: "age",
        title: "Age",
        dataIndex: "age",
        ...getColumnSearchProps("age"),
        sorter: (a, b) => a.age - b.age,
        // sortOrder:
        //   state?.sortedInfo?.columnKey == "age" && state?.sortedInfo?.order,
      },
      {
        key: "address",
        title: "Address",
        dataIndex: "address",
        ...getColumnSearchProps("address"),
      },
    ];

    const data = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
      },
      {
        key: "4",
        name: "Disabled User",
        age: 99,
        address: "Sidney No. 1 Lake Park",
      },
    ];

    return (
      <Fragment>
        <div className="master_grid">
          <div className="title_area">
            <div className="gridTitle">
              <h6>
                <span className="fa fa-list mr-2"></span> Hello world
              </h6>
            </div>
          </div>
          <Table
            className="grid-table"
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            onChange={handleChange}
          />
        </div>
      </Fragment>
    );
  }
);
export default MasterGrid;
