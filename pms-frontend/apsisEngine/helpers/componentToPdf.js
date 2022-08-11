import React from "react";
import { renderToString } from "react-dom/server";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Button } from "antd";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

export const componentToPdf = async (
  content,
  isDownLoad = false,
  extra = { extraFooterText: "", pageOrientation: "landscape" }
) => {
  const logoImage = await ConvertImage("/images/IFICLogo.png");
  //load component as string
  const string = renderToString(content);

  //convert html string form component
  let html = htmlToPdfmake(string, {
    tableAutoSize: true,
  });

  // console.log("extra.extraFooterText", extra.extraFooterText);
  let docDefinition = {
    pageSize: "A4",
    pageOrientation: extra.pageOrientation, // "portrait",
    pageMargins: [60, 80, 30, 30],
    // columns: [
    //   {
    //     text: "Signature _____________________",
    //     alignment: "right",
    //     fontSize: 12,
    //     margin: [0, 0, 30, 120],
    //   },
    // ],
    footer: function (currentPage, pageCount) {
      return [
        {
          text:
            "Page : " +
            currentPage.toString() +
            " of " +
            pageCount +
            extra.extraFooterText,
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

  if (isDownLoad) {
    pdfMake.createPdf(docDefinition).download();
  } else {
    pdfMake.createPdf(docDefinition).open();
  }
};

export default componentToPdf;
