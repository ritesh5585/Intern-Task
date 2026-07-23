const xlsx = require("xlsx");
const path = require("path");

const readExcel = (filePath, sheetName) => {
  const workbook = xlsx.readFile(filePath);
  const targetSheet = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[targetSheet];

  if (!sheet) {
    throw new Error(`Sheet "${targetSheet}" not found in workbook`);
  }

  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false });

  return rows;
};

module.exports = readExcel;
