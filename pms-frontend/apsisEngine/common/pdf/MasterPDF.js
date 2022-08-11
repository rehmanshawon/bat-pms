import React, { useEffect, useState, Fragment } from "react";
import fetchWrapper from "@/apsisEngine/helpers/fetchWrapper";
import { renderToString } from "react-dom/server";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PDFContent } from "./PDFContent";
import { Button } from "antd";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const MasterPDF = ({
  title,
  slug,
  extra,
  inputState,
  searchState,
  is_serial,
  fileName,
  DownloadType,
}) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const ConvertImage = async (url) => {
    return await fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      )
      .catch((error) => {
        console.log(error);
      });
  };

  //download pdf action
  const downloadPdf = async () => {
    const logoImage = await ConvertImage("/images/IFICLogo.png");
    const extra_condition = extra || {};
    const data = await fetchWrapper
      .post("master-grid/grid-title", {
        slug: slug,
        extra: extra_condition,
        search_key: inputState,
        search_data: searchState ?? [],
        export: 1,
      })
      .then(async (res) => {
        const { master_grid_title, columns, items, serial } = res.data;

        return { master_grid_title, columns, items, is_serial: serial };
      });

    //load component as string
    const string = renderToString(<PDFContent data={data} />);

    //convert html string form component
    let html = htmlToPdfmake(string);

    let docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape", // "portrait",
      pageMargins: [60, 80, 30, 30],

      footer: function (currentPage, pageCount) {
        return [
          {
            text: "Page : " + currentPage.toString() + " of " + pageCount,
            alignment: "left",
            fontSize: 10,
            margin: [80, 5, 0, 0],
          },
        ];
      },

      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            image: logoImage,
            alignment: "left",
            height: 36,
            width: 80,
            margin: [260, 10, 0, 0],
          },
          {
            text: "IFIC Bank Limited",
            alignment: "left",
            fontSize: 24,
            margin: [360, -30, 0, 0],
          },
          {
            canvas: [
              {
                type: "rect",
                x: 0,
                y: 10,
                lineColor: "#e7e7e7",
                w: pageSize.width,
                h: 1,
              },
            ],
          },
        ];
      },
      content: html,
    };

    if (DownloadType && DownloadType == "download") {
      pdfMake.createPdf(docDefinition).download();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  };

  //Handle click pdf button
  const handleSubmit = async () => {
    await downloadPdf();
  };

  return (
    <Button
      id="exportPdf"
      type="flex"
      align="middle"
      loading={confirmLoading}
      onClick={handleSubmit}
    >
      <i className={`fa fa-file-pdf-o`}></i>
      <span className="mx-1">Export PDF</span>
    </Button>
  );
};

export default MasterPDF;
