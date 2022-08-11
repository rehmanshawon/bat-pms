import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const PDFButton = ({
  ButtonTitle,
  ReportTitle,
  DownloadType,
  Settings,
  Content,
  ...props
}) => {
  const [logoImage, setLogoImage] = useState(false);
  const [pdfSetting, setPdfSetting] = useState({});

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

  //config pdf setting
  const pdfConfig = () => {
    let pageSettings = {
      pageSize: Settings && Settings.pageSize ? Settings.pageSize : "A4",
      pageOrientation:
        Settings && Settings.pageOrientation
          ? Settings.pageOrientation
          : "portrait",
      pageMargins:
        Settings && Settings.pageMargins
          ? Settings.pageMargins
          : [60, 80, 30, 30],
      reportTitle: Settings && Settings.reportTitle ? Settings.reportTitle : "",
    };
    setPdfSetting(pageSettings);
  };

  //Generate Component
  const GenerateContent = () => {
    return (
      <Fragment>
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <h1
              style={{
                display: "block",
                margin: 0,
                fontSize: 18,
                color:
                  Settings && Settings.TitleColor
                    ? Settings.TitleColor
                    : "#111111",
                marginLeft: "-60",
                textAlign: "center",
              }}
            >
              {ReportTitle ?? ""}
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

          {!Content && props.children}

          {Content && <Content />}
        </div>
      </Fragment>
    );
  };

  const print = () => {
    const string = renderToString(<GenerateContent />);
    var html = htmlToPdfmake(string);
    var docDefinition = {
      pageSize: pdfSetting.pageSize ?? "A4",
      pageOrientation: pdfSetting.pageOrientation ?? "portrait",
      pageMargins: pdfSetting.pageMargins ?? [60, 80, 30, 30],

      footer: function (currentPage, pageCount) {
        return [
          {
            text: "Page : " + currentPage.toString() + " of " + pageCount,
            alignment: "left",
            fontSize: 10,
            margin: [10, 0, 0, 0],
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
            margin: [120, 10, 0, 0],
          },
          {
            text: "IFIC Bank Limited",
            alignment: "left",
            fontSize: 24,
            margin: [220, -30, 0, 0],
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

  //convert logo
  useEffect(async () => {
    await ConvertImage("/images/IFICLogo.png").then((dataUrl) => {
      setLogoImage(dataUrl);
    });
  }, []);

  useEffect(() => {
    pdfConfig();
  }, [Settings]);

  return (
    <div>
      <button
        onClick={print}
        className={`btn ${
          Settings && Settings.btnClass ? Settings.btnClass : "btn-primary"
        } mt-1`}
      >
        <i className="fa fa-file-pdf-o" style={{ marginRight: 5 }}></i>
        {ButtonTitle ?? "PDF Button"}
      </button>
    </div>
  );
};

PDFButton.propTypes = {
  Content: PropTypes.func,
  Settings: PropTypes.object,
  ButtonTitle: PropTypes.string,
  ReportTitle: PropTypes.string,
  DownloadType: PropTypes.string,
};

export default PDFButton;

//https://pdfmake.github.io/docs/0.1/document-definition-object/page/
//https://github.com/bpampuch/pdfmake/issues/1163
