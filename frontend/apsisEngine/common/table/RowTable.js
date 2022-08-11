import { apsisMoney } from "@/apsisEngine/helpers/helpers";
import moment from "moment";

const RowTable = ({ columns, dataSource, sl }) => {
  const serial = sl || 1;
  return (
    <>
      {dataSource?.length > 0 ? (
        <table width={"100%"} style={{ tableLayout: "auto" }}>
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th
                  width={column.width}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "5px",
                    borderTop: "1px solid #595977",
                    borderBottom: "1px solid #595977",
                    borderRight: "1px solid #595977",
                    borderLeft:
                      i === 0 ? "1px solid black" : "1px solid #595977",
                    textAlign: column?.align || column?.text_align || "left",
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          {dataSource.map((data, ii) => (
            <tr>
              {columns.map((column, i) => {
                return (
                  <td
                    style={{
                      border: "1px solid black",
                      fontSize: "12px",
                      color: "black",
                      margin: "5px",
                      textAlign: column?.align || column?.text_align || "left",
                    }}
                  >
                    {!data[column.dataIndex] && column.dataIndex == "sl"
                      ? serial + ii
                      : column?.dataType == "money" ||
                        column?.field_type == "money"
                      ? apsisMoney(data[column.dataIndex])
                      : (column?.dataType == "date" ||
                          column?.field_type == "date") &&
                        data[column.dataIndex]
                      ? moment(data[column.dataIndex]).format("DD-MM-YYYY")
                      : data[column.dataIndex]}
                  </td>
                );
              })}
            </tr>
          ))}
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th
                width="100%"
                style={{
                  backgroundColor: "#1e1e2d",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "400",
                  margin: "10px",
                  border: "1px solid #595977",
                  textAlign: "center",
                }}
              >
                No Data
              </th>
            </tr>
          </thead>
        </table>
      )}{" "}
    </>
  );
};

export default RowTable;
