import React, { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const PDFPrint = (props) => {
  const [logoImage, setImage] = useState(false);
  const toDataURL = (url) => {
    return fetch(url)
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

  useEffect(() => {
    toDataURL("http://localhost:5000/images/logo.png")
      .then((dataUrl) => {
        setImage(dataUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const DownlaodPdf = () => {
    const string = renderToString(props.content);
    var html = htmlToPdfmake(string);

    var docDefinition = {
      pageSize: "A4",
      pageOrientation: "potrait",
      pageMargins: [40, 100, 40, 40],
      // footer: {
      //   columns: (currentPage, pageCount) => {
      //     return [currentPage.toString() + " of " + pageCount];
      //   },
      //   margin: [60, 10, 60, 10],
      // },
      footer: function (currentPage, pageCount) {
        return currentPage.toString() + " of " + pageCount;
      },
      header: {
        margin: 40,
        height: 80,
        columns: [
          {
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  {
                    image: logoImage,
                    width: 80,
                    height: 40,
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
        ],
      },
      content: html,
    };

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={DownlaodPdf}>
        Print
      </button>
    </div>
  );
};

export default PDFPrint;
