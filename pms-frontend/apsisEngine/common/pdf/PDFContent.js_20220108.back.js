import React, { Fragment } from "react";
import { filterColumn } from "@/apsisEngine/helpers/helpers";
export const PDFContent = ({ data }) => {
  const { master_grid_title, columns, items, is_serial } = data;

  const ItemRender = ({ rowsItem }) => {
    if (columns.length > 0) {
      return (
        <Fragment>
          {columns.map((cl) => {
            return filterColumn(cl.dataIndex, rowsItem[cl.dataIndex]);
          })}
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <h1
            style={{
              display: "block",
              margin: 0,
              fontSize: 15,
              color: "#111111",
              marginLeft: "-60",
              textAlign: "center",
            }}
          >
            {master_grid_title}
          </h1>
          <div
            style={{
              display: "block",
              margin: "0 0 20 -60",
              textAlign: "center",
              color: "#ddd",
            }}
          >
            ___________________
          </div>
        </div>
        <div style={{ width: "100%", textAlign: "center" }}>
          {columns && columns.length > 0 && (
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: "10px",
                border: "none",
                width: "770px",
              }}
            >
              <thead>
                <tr>
                  <th>SL</th>
                  {columns.map((item) => {
                    return (
                      <th
                        style={{
                          fontSize: "10px",
                          border: "1px solid #333",
                          padding: "5px",
                        }}
                      >
                        {item.title ?? ""}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.length &&
                  items.map((row, index) => {
                    return (
                      <tr>
                        <td> {parseInt(index + 1)}</td>
                        <ItemRender rowsItem={row} />
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default PDFContent;
