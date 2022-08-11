import React, { useEffect, useState } from "react";
// import NoSSR from "react-no-ssr";
import { Row, Dropdown, Button, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { MasterPDF } from "@/apsisEngine/common/pdf/MasterPDF";
import { CSVexport } from "../csv/csvExport";
import { XLSXexport } from "../xlsx/masterXlsx";
import { PrintMaster } from "../print/printMaster";
import Link from "next/link";

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
  // hideCreateButton,
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

  let exportButtons = [];
  exportPdf && exportPdf == 1
    ? exportButtons.push(
        <Menu.Item>
          <Row type="flex" align="middle">
            <MasterPDF
              title={title}
              slug={slug}
              extra={extra}
              inputState={inputState}
              searchState={searchState}
              is_serial={is_serial}
              fileName={fileName}
            />
          </Row>
        </Menu.Item>
      )
    : null;

  exportExcel && exportExcel == 1
    ? exportButtons.push(
        <Menu.Item>
          <Row type="flex" align="middle">
            <XLSXexport
              title={title}
              slug={slug}
              extra={extra}
              inputState={inputState}
              searchState={searchState}
              is_serial={is_serial}
              fileName={fileName}
            />
          </Row>
        </Menu.Item>
      )
    : null;

  exportCsv && exportCsv == 1
    ? exportButtons.push(
        <Menu.Item>
          <Row type="flex" align="middle">
            <CSVexport
              title={title}
              slug={slug}
              extra={extra}
              inputState={inputState}
              searchState={searchState}
              is_serial={is_serial}
              fileName={fileName}
            />
          </Row>
        </Menu.Item>
      )
    : null;

  exportPrinting && exportPrinting == 1
    ? exportButtons.push(
        <Menu.Item>
          <Row type="flex" align="middle">
            <PrintMaster
              title={title}
              slug={slug}
              extra={extra}
              inputState={inputState}
              searchState={searchState}
              is_serial={is_serial}
              fileName={fileName}
            />
          </Row>
        </Menu.Item>
      )
    : null;

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
            <Link
              href={action.link}
              name={action.id}
              slug={action.slug}
              type="flex"
              align="middle"
            >
              <a className="navi-link">
                <i className={action.icon}></i>
                <span className="mx-3">{action.name}</span>
              </a>
            </Link>
          </Row>
        </Menu.Item>
      );
    });

  const buttonItems = itemLinks.map((action, index) => {
    if (action.in_dropdown == 0 && action.type == "button") {
      // if (action.id.startsWith("create")) {
      //   action.btn_class = hideCreateButton ? "d-none" : "";
      // }
      return (
        <Button
          key={`${action.id}${index}`}
          className={`action-btn btn-shadow ${action.btn_class}`}
          onClick={(event) => handleClick(event)}
          name={action.id}
          id={action.id}
          slug={action.slug}
          attribute={action.data_attribute}
        >
          <span className="navi-icon">
            <i className={action.icon}></i>
          </span>
          <span className="navi-text">{action.name}</span>
        </Button>
      );
    } else if (action.in_dropdown == 0 && action.type == "link") {
      // if (action.id.startsWith("create")) {
      //   action.btn_class = hideCreateButton ? "d-none" : "";
      // }
      return (
        <Link href={action.link} id={action.id} key={`${action.id}${index}`}>
          <a className={`action-btn btn-shadow ${action.btn_class}`}>
            <span className="navi-icon">
              <i className={action.icon}></i>
            </span>
            <span className="navi-text">{action.name}</span>
          </a>
        </Link>
      );
    }

    return null;
  });

  const handleClick = (event) => {
    event.preventDefault();
    if (clickHandler) clickHandler(event, selectedRowKeys, selectedRows);
  };

  return (
    <>
      <div className="action-wraps">
        {buttonItems && buttonItems.length > 0 && (
          <div className="action-buttons">{buttonItems}</div>
        )}
        {((dropdown_exist.length > 0 && dropdownItems != "") ||
          exportButtons.length > 0) && (
          <Dropdown
            overlay={
              <Menu className="action-nav">
                {[dropdownItems, exportButtons]}
              </Menu>
            }
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
