import React, { useState } from "react";
import { Button } from "antd";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import {
  swalConfirm,
  swalSuccess,
  swalError,
} from "@/apsisEngine/helpers/helperService";
export const XLSXexport = ({ slug, extra, inputState, searchState }) => {
  const [loading, setLoading] = useState(false);

  //get master data
  const getMasterData = async () => {
    setLoading(true);
    const extra_condition = extra || "";
    await fetchWrapper
      .post("master-grid/export-xlsx", {
        slug: slug,
        extra: { extra_condition },
        search_key: inputState,
        search_data: searchState ?? [],
        export: 1,
      })
      .then((res) => {
        if (!res.error) {
          window.open(res.data, "_blank");
        }
        if (res.error) {
          swalError(res.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        swalError(error);
        setLoading(false);
      });
  };

  return (
    <Button
      type="flex"
      align="middle"
      onClick={() => getMasterData()}
      name={`exportExcel`}
      slug={`exportExcel`}
      id="exportExcel"
    >
      <i className={`fa fa-file-excel-o`}></i>
      <span className="mx-1">Excel</span>
    </Button>
  );
};
export default XLSXexport;
