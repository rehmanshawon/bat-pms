import Common_function from 'src/global/common_function.service';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';

export function getletter(number) {
  const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'AA',
    'AB',
    'AC',
    'AD',
    'AE',
    'AF',
    'AG',
    'AH',
    'AI',
    'AJ',
    'AK',
    'AL',
    'AM',
    'AN',
    'AO',
    'AP',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AV',
    'AW',
    'AX',
    'AY',
    'AZ',
    'BA',
    'BB',
    'BC',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BK',
    'BL',
    'BM',
    'BN',
    'BO',
    'BP',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BU',
    'BV',
    'BW',
    'BX',
    'BY',
    'BZ',
    'CA',
    'CB',
    'CC',
    'CD',
    'CE',
    'CF',
    'CG',
    'CH',
    'CI',
    'CJ',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CP',
    'CQ',
    'CR',
    'CS',
    'CT',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DA',
    'DB',
    'DC',
    'DD',
    'DE',
    'DF',
    'DG',
    'DH',
    'DI',
    'DJ',
    'DK',
    'DL',
    'DM',
    'DN',
    'DO',
    'DP',
    'DQ',
    'DR',
    'DS',
    'DT',
    'DU',
    'DV',
    'DW',
    'DX',
    'DY',
    'DZ',
    'EA',
    'EB',
    'EC',
    'ED',
    'EE',
    'EF',
    'EG',
    'EH',
    'EI',
    'EJ',
    'EK',
    'EL',
    'EM',
    'EN',
    'EO',
    'EP',
    'EQ',
    'ER',
    'ES',
    'ET',
    'EU',
    'EV',
    'EW',
    'EX',
    'EY',
    'EZ',
    'FA',
    'FB',
    'FC',
    'FD',
    'FE',
    'FF',
    'FG',
    'FH',
    'FI',
    'FJ',
    'FK',
    'FL',
    'FM',
    'FN',
    'FO',
    'FP',
    'FQ',
    'FR',
    'FS',
    'FT',
    'FU',
    'FV',
    'FW',
    'FX',
    'FY',
    'FZ',
    'GA',
    'GB',
    'GC',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GJ',
    'GK',
    'GL',
    'GM',
    'GN',
    'GO',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GV',
    'GW',
    'GX',
    'GY',
    'GZ',
    'HA',
    'HB',
    'HC',
    'HD',
    'HE',
    'HF',
    'HG',
    'HH',
    'HI',
    'HJ',
    'HK',
    'HL',
    'HM',
    'HN',
    'HO',
    'HP',
    'HQ',
    'HR',
    'HS',
    'HT',
    'HU',
    'HV',
    'HW',
    'HX',
    'HY',
    'HZ',
  ];
  return letters[number];
}

export function workbookSetup(workbook, user_data) {
  workbook.creator = user_data.user_name;
  workbook.lastModifiedBy = user_data.user_name;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 0,
      visibility: 'visible',
    },
  ];
}

export function pageSetupLandscape(sheet) {
  sheet.pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    fitToPage: true,
    fitToHeight: 0,
    fitToWidth: 1,
  };
  sheet.pageSetup.margins = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3,
  };
}

export function headerFooterSetup(header, footer) {
  return {
    headerFooter: {
      evenHeader: `&C&K0070C0&\"Aril\"&16 ${header}`,
      oddHeader: `&C&K0070C0&\"Aril\"&16 ${header}`,
      evenFooter: `&L&D &T &C&K0070C0&\"Aril\"&16 ${footer} &RPage &P of &N`,
      oddFooter: `&L&D &T &C&K0070C0&\"Aril\"&16 ${footer} &RPage &P of &N`,
      differentFirst: false,
    },
  };
}

export function createHeader(sheet, length) {
  const headers = [
    { header: 'This is Header', style: {} },
    { header: 'This is Sub Header', style: { FontSize: 10 } },
  ];
  headers.map((data, i) => {
    addToHeader(sheet, i + 1, length, data.header, data.style);
  });
  return headers.length;
}

export function createTableHeader(sheet, row, tableHeader, style: any) {
  if (
    tableHeader.groupHeaders &&
    Object.keys(tableHeader.groupHeaders).length !== 0
  ) {
    Object.keys(tableHeader.groupHeaders).map((header) => {
      const groupHead = tableHeader.groupHeaders[header];
      const start = `${getletter(groupHead[0])}${row}`;
      const end = `${getletter(groupHead[1])}${row}`;

      sheet.mergeCells(`${start}:${end}`);
      sheet.getCell(`${start}`).value = splitAndUppercase(header);
      addHeaderAlignmentStyle(sheet, start, {});
    });
    addHeaderFontStyle(sheet, row, style);
    ++row;
  }
  const headers = tableHeader.headers.map((header) =>
    splitAndUppercase(header),
  );
  sheet.insertRow(row, headers);
  sheet.getRow(row).font = {
    bold: true,
  };
  sheet.getRow(row).alignment = {
    vertical: style.vertical || 'middle',
    horizontal: style.horizontal || 'center',
  };
  return row;
}

export function addToHeader(sheet, row, length, header, style: any) {
  const headerRow = `${getletter(0)}${row}`;
  const headerLength = `${getletter(length)}${row}`;

  sheet.mergeCells(`${headerRow}:${headerLength}`);
  sheet.getCell(`${headerRow}`).value = header;

  addHeaderFontStyle(sheet, row, style);
  addHeaderAlignmentStyle(sheet, headerRow, style);
}

export function fileNameGenerator(name, user_data, knex = null, date = null) {
  const pin = Math.round(Math.random() * 10000);
  name = name.split(' ').join('_');
  const storeName =
    Date.now() + '' + user_data.user_id + pin + '-' + name + '.xlsx';
  const errorService = new KnexErrorService();
  const helper = new Common_function(knex, errorService);
  //const date = helper.cmnDatetime().toString().split(' ')[0];
  date = date ? date : helper.cmnDatetime().toString();
  const downloadName = name + '-' + date + '.xlsx';
  return { storeName, downloadName };
}

export function splitAndUppercase(str) {
  return str.split('_').join(' ').toUpperCase();
}

export function addHeaderFontStyle(sheet, row, style: any) {
  sheet.getRow(row).font = {
    name: style.fontName || 'Calibri',
    color: { argb: style.color || '000000' },
    family: style.family || 2,
    size: style.fontSize || 14,
    bold: style.bold || true,
  };
}

export function addHeaderAlignmentStyle(sheet, cell, style: any) {
  sheet.getCell(cell).alignment = {
    vertical: style.vertical || 'middle',
    horizontal: style.horizontal || 'center',
  };
}
