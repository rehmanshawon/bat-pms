import React, { useState } from "react";
import { Button } from "antd";
import { CSVLink, CSVDownload } from "react-csv";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
export const CSVexport = ({
  slug,
  extra,
  inputState,
  searchState,
  fileName,
}) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);

  //get master data
  const getMasterData = async () => {
    setLoading(true);
    const extra_condition = extra || "";
    await fetchWrapper
      .post("master-grid/grid-title", {
        slug: slug,
        extra: { extra_condition },
        search_key: inputState,
        search_data: searchState ?? [],
        export: 1,
      })
      .then(async (res) => {
        const { columns, items } = res.data;
        const tableHead = columns.map((item) => {
          return item.title.toUpperCase();
        });

        //declaration data array
        const rowsData = [tableHead];
        if (items && columns && columns.length > 0 && items.length > 0) {
          items.forEach((element) => {
            const colData = [];
            columns.forEach((item) => {
              let coll = element[item.dataIndex];
              if (coll.value) {
                coll = coll.value;
              }
              colData.push(coll);
            });
            rowsData.push(colData);
          });
        }

        setMasterData(rowsData);

        setTimeout(() => {
          document.getElementById("ExpCsv").click();
        }, 10);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        done(false);
      });
  };

  return (
    <>
      <CSVLink
        data={masterData}
        filename={"my-file.csv"}
        className="btn btn-primary"
        target="_blank"
        style={{ display: "none" }}
        id="ExpCsv"
      >
        Download
      </CSVLink>

      <Button
        type="flex"
        align="middle"
        onClick={() => getMasterData()}
        name={`exportCsv`}
        slug={`exportCsv`}
        id={`exportCsv`}
      >
        <i className={`fa fa-file-text`}></i>
        <span className="mx-1"> CSV</span>
      </Button>
    </>
  );
};
export default CSVexport;
