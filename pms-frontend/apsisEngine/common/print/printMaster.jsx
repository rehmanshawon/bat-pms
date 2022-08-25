import React, {
  Fragment,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { filterColumn } from "apsisEngine/helpers/helpers";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Button } from "antd";

const ComponentToPrint = forwardRef(
  ({ slug, extra, inputState, searchState, ...props }, ref) => {
    //initial data
    const [master_grid_title, setGridTitle] = useState();
    const [columns, setColumns] = useState();
    const [items, setItems] = useState();
    const [serial, setSerial] = useState();

    //receive data
    const getData = async () => {
      const extra_condition = extra || "";
      const data = await fetchWrapper
        .post("master-grid/grid-title", {
          slug: slug,
          extra: { extra_condition },
          search_key: inputState,
          search_data: searchState ?? [],
          export: 1,
        })
        .then(async (res) => {
          const { master_grid_title, columns, items, serial } = res.data;
          setGridTitle(master_grid_title);
          setColumns(columns);
          setItems(items);
          setSerial(serial);
        });
    };

    //useEffect
    useEffect(async () => {
      await getData();
    }, [slug, extra, inputState]);

    const ItemRender = ({ rowsItem }) => {
      if (columns.length > 0) {
        return columns.map((cl, index) => {
          return (
            <Fragment key={index}>
              {filterColumn(cl.dataIndex, rowsItem[cl.dataIndex])}
            </Fragment>
          );
        });
      }
    };

    return (
      <div ref={ref} className="print-source">
        <div className="fixedHeader">
          <div className="brandLogo">
            <img src="/images/IFICLogo.png" />
          </div>
          <div className="brandTitle">IFIC Bank Limited</div>
        </div>
        <div className="print-container">
          <div className="report-title">
            <h2>
              <strong> {master_grid_title}</strong>
            </h2>
          </div>

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
                  <th key={`head`}>SL</th>
                  {columns.map((item, index) => {
                    return (
                      <th
                        style={{
                          fontSize: "10px",
                          border: "1px solid #333",
                          padding: "5px",
                        }}
                        key={`head${index}`}
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
                      <tr key={`row${index}`}>
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
    );
  }
);

export const PrintMaster = (props) => {
  const ref = useRef();
  return (
    <>
      <ReactToPrint content={() => ref.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button onClick={handlePrint}>
              <i className={`fa fa-print`}></i>
              <span className="mx-1">Print</span>
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <ComponentToPrint ref={ref} {...props} />
    </>
  );
};
export default PrintMaster;
