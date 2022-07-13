// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

export function filePathGenerator(rootDir, type, file_code) {
  const date = new Date();
  const year = date.getFullYear();
  let month: any = date.getMonth() + 1;
  if (![10, 11, 12].includes(month)) {
    month = '0' + month;
  }
  const fileName = Date.now();
  const fileType = type.split('/')[1];
  const dirpath = `public/${rootDir}/${year}${month}/${file_code}`;
  const fullpath = `public/${rootDir}/${year}${month}/${file_code}/${fileName}.${fileType}`;
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }

  return {
    attach_file_name: fileName,
    attach_file_type: fileType,
    attach_file_path: fullpath,
  };
}

export function file_types() {
  return [
    'jpg',
    'jpeg',
    'png',
    'pdf',
    'xlsx',
    'docs',
    'JPG',
    'JPEG',
    'PNG',
    'PDF',
    'XLSX',
    'DOCS',
  ];
}
