import React, { useEffect, useState } from "react";
// import NoSSR from "react-no-ssr";
import { Row, Dropdown, Button, Menu } from "antd";
import {
  MoreOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  DatabaseTwoTone,
  FileTextOutlined,
  EllipsisOutlined,
  FallOutlined,
  FileZipTwoTone,
  MessageOutlined,
  SaveTwoTone,
} from "@ant-design/icons";

import { MasterPDF } from "@/apsisEngine/common/pdf/MasterPDF";
import { CSVexport } from "../csv";

export const GridAction = ({
  title,
  buttons,
  slug,
  extra,
  is_serial,
  inputState,
  searchState,
  fileName,
  selectedRowKeys,
  selectedRows,
  clickHandler,
  exportPdf,
  exportExcel,
  exportCsv,
  exportPrinting,
  ...rest
}) => {
  //item Links
  const [itemLinks, setItemLinks] = useState([]);

  //set item links
  useEffect(() => {
    setItemLinks(buttons);
  }, [buttons]);

  //filter dropdown buttons
  const dropdown_exist = itemLinks.filter(function (action, index) {
    return action.in_dropdown == 1;
  });

  const dropdownItems =
    dropdown_exist &&
    dropdown_exist.map((action, index) => {
      return action.type == "button" ? (
        <Menu.Item key={index.toString()}>
          <Row type="flex" align="middle">
            <Button
              type="flex"
              align="middle"
              onClick={(event) => handleClick(event)}
              name={action.id}
              slug={action.slug}
            >
              <i className={action.icon}></i>
              <span className="mx-3">{action.name}</span>
            </Button>
          </Row>
        </Menu.Item>
      ) : (
        <Menu.Item key={index.toString()}>
          <Row type="flex" align="middle">
            <a
              href={action.link}
              name={action.id}
              slug={action.slug}
              className="navi-link"
              type="flex"
              align="middle"
            >
              <i className={action.icon}></i>
              <span className="mx-3">{action.name}</span>
            </a>
          </Row>
        </Menu.Item>
      );
    });

  const buttonItems = itemLinks.map((action, index) => {
    if (action.in_dropdown == 0 && action.type == "button") {
      return (
        <Button
          key={`${action.id}${index}`}
          className={`action-btn btn-shadow ${action.btn_class}`}
          onClick={(event) => handleClick(event)}
          name={action.id}
          id={action.id}
          slug={action.slug}
        >
          <span className="navi-icon">
            <i className={action.icon}></i>
          </span>
          <span className="navi-text">{action.name}</span>
        </Button>
      );
    } else if (action.in_dropdown == 0 && action.type == "link") {
      return (
        <a
          id={action.id}
          href={action.link}
          key={`${action.id}${index}`}
          className={`action-btn btn-shadow ${action.btn_class}`}
        >
          <span className="navi-icon">
            <i className={action.icon}></i>
          </span>
          <span className="navi-text">{action.name}</span>
        </a>
      );
    }

    return null;
  });

  const handleClick = (event) => {
    event.preventDefault();
    if (clickHandler) clickHandler(event, selectedRowKeys, selectedRows);
    // document.body.click();
  };

  return (
    <>
      <div className="action-wraps">
        {buttonItems && buttonItems.length > 0 && (
          <div className="action-buttons">
            {exportPdf && exportPdf == 1 ? (
              <MasterPDF
                title={title}
                slug={slug}
                extra={extra}
                inputState={inputState}
                searchState={searchState}
                is_serial={is_serial}
                fileName={fileName}
              />
            ) : (
              <></>
            )}

            {exportExcel && exportExcel == 1 ? (
              <Button
                type="flex"
                align="middle"
                onClick={(event) => alert("exportExcel")}
                name={`exportExcel`}
                slug={`exportExcel`}
                id="exportExcel"
              >
                <i className={`fa fa-file-excel-o`}></i>
                <span className="mx-1">Excel</span>
              </Button>
            ) : (
              <></>
            )}

            {exportCsv && exportCsv == 1 ? <CSVexport /> : <></>}
            {exportPrinting && exportPrinting == 1 ? (
              <Button
                type="flex"
                align="middle"
                onClick={(event) => alert("Export Printing")}
                name={`exportPrinting`}
                slug={`exportPrinting`}
                id={`exportPrinting`}
              >
                <i className={`fa fa-print`}></i>
                <span className="mx-1">Print</span>
              </Button>
            ) : (
              <></>
            )}

            {buttonItems}
          </div>
        )}
        {dropdown_exist.length > 0 && dropdownItems != "" && (
          <Dropdown
            overlay={<Menu className="action-nav">{dropdownItems}</Menu>}
          >
            <div className="btn-action">
              Action <MoreOutlined style={{ fontSize: "16px" }} />
            </div>
          </Dropdown>
        )}
      </div>
    </>
  );
};

export default GridAction;
