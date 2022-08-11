import React, {useState, Fragment} from 'react';
import XLSX from 'sheetjs-style'; 

import ApsisLoader from "../ApsisLoader"
import http from "../../../services/httpService";
import {apiURL} from "../../../constants/constants"; 
    
export const XlsButton = (props) => {
    const [loading, setLoading] = useState(false);  

    const getPost = async() =>{
        let response = await http.post(apiURL+'grid-data',
          {
            slug: props.slug|| false,
            extra: props.extra || false, 
            search_key: props.search_key || false,
            search_data: props.search_data || false,
          } 
        );
        
        if(response.data){  
            return serializeData(response.data); 
        } 

        return [];
    } 

    //Data Serialize
    const serializeData = async (rsp_data) =>{
        let headers = props.header; 
        let return_data = []; 
        rsp_data.forEach((data, i) => {
            let objItem = []; 

            //when serial is open
            if(props.is_serial && props.is_serial === 1) data.serial = parseInt(i+1);

            headers.forEach((header, index) => {
                objItem.push(data[header.selector]);
            }); 
            return_data.push(objItem); 
        }); 
        return (return_data);  
    }
    
    //Filter Header
    const GetHeaderArray = (data) =>{
        let head = []; 
        data.forEach(item => {
            head.push(item.name);
        }); 
        return head;
    }
 
    //Handle Button
    const handleXls = async () =>{ 
        setLoading(true);
        const exportArr = await getPost() || []; 
        let headerArr = GetHeaderArray(props.header) || [];

        // Description in the official document: converts an array of arrays of JS data to a worksheet.
        const headerWs = XLSX.utils.aoa_to_sheet([headerArr]);
        const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {skipHeader: true, origin: "A2"});

        const excelCell = {
            v: "",
            t: "s",
            s: {
                fill: {
                    patternType: "none",
                    fgColor: {rgb: "FF000000"},
                    bgColor: {rgb: "FFFFFFFF"}
                },
                font: {
                  name: 'Times New Roman',
                  sz: 13,
                  color: {rgb: "#FF000000"},
                  bold: false,
                  italic: false,
                  underline: false
                },
                alignment: {
                    vertical: "center",
                    horizontal: "center",
                    indent:0,
                    wrapText: true
                },
                border: {
                  top: {style: "thin", color: {auto: 1}},
                  right: {style: "thin", color: {auto: 1}},
                  bottom: {style: "thin", color: {auto: 1}},
                  left: {style: "thin", color: {auto: 1}}
                }
            }
        };

        const headerCellStyle =  { 
            fill: {
                patternType: "solid",
                fgColor: {rgb: "FFdbdbdb"},
                bgColor: {rgb: "FFdbdbdb"}
            },
                alignment: {
                vertical: "center",
                horizontal: "center",
                indent:0,
                wrapText: true
            },
            border: {
                top: {style: "thin", color: {auto: 1}},
                right: {style: "thin", color: {auto: 1}},
                bottom: {style: "thin", color: {auto: 1}},
                left: {style: "thin", color: {auto: 1}}
            }
        };

        const celLimit = headerArr.length||0;
        const headRange = {s:{c:0, r:0}, e:{c:celLimit, r:0}};

        for (let R = headRange.s.r; R <= headRange.e.r; ++R) {
            for (let C = headRange.s.c; C <= headRange.e.c; ++C) {
                let cell_address = {
                    c: C,
                    r: R
                };

                // if an A1-style address is needed, encode the address 
                var cell_ref = XLSX.utils.encode_cell(cell_address);
                var cell = ws[cell_ref]; 
                //cell.s = headerCellStyle;
                
                // eslint-disable-next-line no-undef
                if(typeof cell === 'undefined' || Object.keys(cell).length === 0) {
                    ws[cell_ref] = excelCell;
                } else {
                    cell.s = headerCellStyle;
                }
            }
        }
  
        // Create an empty workbook, and then add the worksheet 
        const wb = XLSX.utils.book_new();

        // You can customize the Sheet Name after downloading
        XLSX.utils.book_append_sheet(wb, ws, "sheet 01");

        // Generate xlsx file 
        let fileName = props.fileName ||'Download';
        XLSX.writeFile(wb, `${fileName}.xlsx`);

        //close loader
        setLoading(false);
    }


    /*  const handleDownload = () => { 
        // Data to be exported
        let exportArr = props.data||[];

        // Customize the downloaded header, pay attention to the array in the array
        let Header = props.header||[];

        // Description in the official document: converts an array of arrays of JS data to a worksheet.
        const headerWs = XLSX.utils.aoa_to_sheet([Header]);
        const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {skipHeader: true, origin: "A2"});
 
        const excelCell = {
            v: "",
            t: "s",
            s: {
                fill: {
                    patternType: "none",
                    fgColor: {rgb: "FF000000"},
                    bgColor: {rgb: "FFFFFFFF"}
                },
                font: {
                  name: 'Times New Roman',
                  sz: 13,
                  color: {rgb: "#FF000000"},
                  bold: false,
                  italic: false,
                  underline: false
                },
                alignment: {
                    vertical: "center",
                    horizontal: "center",
                    indent:0,
                    wrapText: true
                },
                border: {
                  top: {style: "thin", color: {auto: 1}},
                  right: {style: "thin", color: {auto: 1}},
                  bottom: {style: "thin", color: {auto: 1}},
                  left: {style: "thin", color: {auto: 1}}
                }
            }
        };

        const headerCellStyle =  { 
            fill: {
                patternType: "solid",
                fgColor: {rgb: "FFdbdbdb"},
                bgColor: {rgb: "FFdbdbdb"}
            },
                alignment: {
                vertical: "center",
                horizontal: "center",
                indent:0,
                wrapText: true
            },
            border: {
                top: {style: "thin", color: {auto: 1}},
                right: {style: "thin", color: {auto: 1}},
                bottom: {style: "thin", color: {auto: 1}},
                left: {style: "thin", color: {auto: 1}}
            }
        };
        
        const celLimit = Header.length||0;
        const headRange = {s:{c:0, r:0}, e:{c:celLimit, r:0}};

        for (let R = headRange.s.r; R <= headRange.e.r; ++R) {
            for (let C = headRange.s.c; C <= headRange.e.c; ++C) {
                let cell_address = {
                    c: C,
                    r: R
                };

                // if an A1-style address is needed, encode the address 
                var cell_ref = XLSX.utils.encode_cell(cell_address);
                var cell = ws[cell_ref]; 
                //cell.s = headerCellStyle;
                
                // eslint-disable-next-line no-undef
                if(typeof cell === 'undefined' || Object.keys(cell).length === 0) {
                    ws[cell_ref] = excelCell;
                } else {
                    cell.s = headerCellStyle;
                }
            }
        }
       
 
        
        //ws["A1"].v = "hello";
        
        // ws["A1"].s = {
        //     font: { 
        //         name:"Calibri",
        //         sz: 24,
        //         bold: true,
        //         color: { rgb: "FFFFAA00" }
        //     },
        //     fill:{
        //         patternType:"solid",
        //         bgColor:{ rgb: "000000" }
        //     },
        //     alignment:{
        //         horizontal:"center"
        //     }
        // };
  
        // const merge = [{ s: { r: 0, c: 0 }, e: { r: 0, c:8 } }];

        //cell marge
        // ws["!merges"] = merge

        // Create an empty workbook, and then add the worksheet 
        const wb = XLSX.utils.book_new();

        // You can customize the Sheet Name after downloading
        XLSX.utils.book_append_sheet(wb, ws, "sheet 01");

        // Generate xlsx file 
        let fileName = props.fileName ||'Download';
        XLSX.writeFile(wb, `${fileName}.xlsx`); 
    } */
  
    return (
       
        <Fragment> 
            <button className="pdf-btn btn-shadow null" name="export_pdf" onClick={(e)=>handleXls()} disabled={ loading ? true:false}>
                <span className="navi-icon"><i className="fa fa-file-excel"></i></span>
                <span className="apsis-loader">&nbsp;XLSX  { loading ? <ApsisLoader type="bubbles" color="#fff"  height="24" width="60" /> : null } </span>
            </button>
        </Fragment> 
    )
}

export default XlsButton
