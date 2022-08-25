import {
  workbookSetup,
  headerFooterSetup,
  pageSetupLandscape,
  addToHeader,
  fileNameGenerator,
  createHeader,
  createTableHeader,
  getletter,
} from './xlsx.helper';

// import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
// import Common_function from 'src/global/common_function.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ExcelJS = require('exceljs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
export async function generateXlsx(payload, user_data, knex = null) {
  const fileNames = await fileNameGenerator(
    payload.reportName,
    user_data,
    knex,
  );
  console.log(fileNames);
  const length = Object.keys(payload.items[0]).length - 1;
  const workbook = new ExcelJS.Workbook();
  // workbook setup
  workbookSetup(workbook, user_data);
  // create sheet
  let sheetrow = 1;
  const sheet = workbook.addWorksheet(
    'Main sheet',
    // headerFooterSetup(payload.header, payload.footer),
  );
  // page setup
  pageSetupLandscape(sheet);
  // header setup
  sheetrow = createHeader(sheet, length);
  addToHeader(sheet, ++sheetrow, length, payload.reportName, { fontSize: 12 });

  // take empty row
  ++sheetrow;
  // insert table headers
  if (
    payload.tableHeader &&
    payload.tableHeader.headers &&
    payload.tableHeader.headers.length === 0
  ) {
    payload.tableHeader.headers = Object.keys(payload.items[0]);
  }
  // note table start row
  const startRow = ++sheetrow;
  sheetrow = createTableHeader(sheet, sheetrow, payload.tableHeader, {
    fontSize: 12,
  });

  // table rows
  payload.items.map((item, i) => {
    sheet.insertRow(++sheetrow, Object.values(item));
  });

  // note table end row
  const endRow = sheetrow;
  for (let i = 0; i <= endRow - startRow; i++) {
    for (let j = 0; j <= length; j++) {
      sheet.getCell(`${getletter(j)}${startRow + i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  await workbook.xlsx.writeFile(`./public/uploads/${fileNames.storeName}`);
  setTimeout(() => {
    // Delete file after 1 minute
    fs.unlink(`./public/uploads/${fileNames.storeName}`, async (err) => {
      if (err) console.log(err);
      else {
        console.log(`\nDeleted file: ./public/uploads/${fileNames.storeName}`);
      }
    });
  }, 36000);
  return fileNames;
}
// async function genarateName(name, user_data, knex) {
//   const pin = Math.round(Math.random() * 10000);
//   name = name.split(' ').join('_');
//   const storeName =
//     Date.now() + '' + user_data.user_id + pin + '-' + name + '.xlsx';
//   const errorService = new KnexErrorService();
//   const helper = new Common_function(knex, errorService);
//   const date = helper.cmnDatetime().toString().split(' ')[0];
//   const downloadName = name + '-' + date + '.xlsx';
//   return { storeName, downloadName };
// }
