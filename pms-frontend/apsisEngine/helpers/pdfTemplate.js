import { renderToString } from "react-dom/server";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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

export const pdfTemplate = async (
  content,
  isDownLoad = false,
  extra = {
    pageOrientation: "portrait",
    font: "english",
    footerConcat: [],
  }
) => {
  const logoImage = await ConvertImage("/images/IFICLogo.png");
  const apsisImage = await ConvertImage("/images/apsis.png");
  //load component as string
  const string = renderToString(content);
  const footerConcat = extra?.footerConcat ? extra.footerConcat : [];

  //convert html string form component
  let html = htmlToPdfmake(string, {
    tableAutoSize: true,
  });

  let docDefinition = {
    // defaultStyle: {
    //   font: "kalPurush",
    // },
    pageSize: "A4",
    pageOrientation: extra.pageOrientation, // "portrait",
    pageMargins: [60, 80, 30, 50],
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
          text: "Page : " + currentPage.toString() + " of " + pageCount,
          alignment: "center",
          fontSize: 8,
          margin: [0, 20, 25, -30],
        },
        // {
        //   image: apsisImage,
        //   alignment: "left",
        //   height: 16,
        //   width: 20,
        //   //left,top,right,bottom
        //   margin: [10, 20, 0, -30],
        // },
        {
          text: "Powered By Apsis",
          alignment: "left",
          fontSize: 8,
          margin: [30, 20, 0, -30],
        },
        ...footerConcat,
      ];
    },

    header: function (currentPage, pageCount, pageSize) {
      return [
        {
          image: logoImage,
          alignment: "left",
          height: 36,
          width: 80,
          //left,top,right,bottom
          margin: [30, 10, 0, 0],
        },
        {
          text: "IFIC Bank Limited",
          alignment: "center",
          fontSize: 14,
          margin: [-5, -40, -10, 0],
        },
        {
          text: "Head Office, IFIC Tower, 61, Purana Paltan, Dhaka-1000, Bangladesh",
          alignment: "center",
          fontSize: 10,
          margin: [10, 2, 0, 0],
        },
        {
          text: "Phone : 9563020, 9562060, Ext: 219",
          alignment: "center",
          fontSize: 10,
          margin: [5, 4, 0, 0],
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
  if (extra.font == "bangla") {
    docDefinition.defaultStyle = {
      font: "banglaFont",
    };
    pdfMake.fonts = {
      banglaFont: {
        normal: window.location.origin + "/fonts/Kalpurush.woff.ttf",
        bold: window.location.origin + "/fonts/Kalpurush.woff.ttf",
        italics: window.location.origin + "/fonts/Kalpurush.woff.ttf",
        bolditalics: window.location.origin + "/fonts/Kalpurush.woff.ttf",
      },
    };
  }

  if (isDownLoad) {
    pdfMake.createPdf(docDefinition).download();
  } else {
    pdfMake.createPdf(docDefinition).open();
  }
};

export default pdfTemplate;
