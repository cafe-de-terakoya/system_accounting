/**
 * スプレッドシートに独自のメニューを追加
 */
function onOpen() {
  SS_JORNAL.addMenu('スクリプトメニュー', [
    {name: 'この月の仕分けを総勘定元帳に転記', functionName: 'main_1'},
    {name: '未精算の未払金を集計', functionName: 'main_2'}
  ]);
}


/**
 * 対象の月(アクティブなシート)の仕訳帳の内容を、総勘定元帳に転記する。
 */
function main_1() { 
  const lastRow_jornal = SS_JORNAL.getActiveSheet().getLastRow();

  //*デバッグ用*/ const data_jornal = SS_JORNAL.getSheetByName('6月').getRange(
  const data_jornal = SS_JORNAL.getActiveSheet().getRange(
    ROW_FIRST_DATA,
    COL_FIRST_FIELD,
    lastRow_jornal - (ROW_FIRST_DATA-1),
    COL_NOTE - (COL_FIRST_FIELD-1)
  ).getValues();

  Logger.log(data_jornal);

  postJornalToGL(lastRow_jornal, data_jornal);
}


/**
 * 新しくシートを生成し、未精算の未払金の集計結果を記録する。
 */
function main_2() {
  const allSheets_jornal = SS_JORNAL.getSheets();

  const tmp = SS_JORNAL.insertSheet(SHEET_NAME_ACCOUNTS_PAYABLE, SS_JORNAL.getNumSheets());

  tmp.setColumnWidth(COL_DATE, 85);
  tmp.setColumnWidth(COL_DEBIT, 120);
  tmp.setColumnWidth(COL_DEBIT_AMOUNT, 80);
  tmp.setColumnWidth(COL_CREDIT_AMOUNT, 80);
  tmp.setColumnWidth(COL_CREDIT, 120);
  tmp.setColumnWidth(COL_SUMMARY, 500);
  tmp.setColumnWidth(COL_NOTE, 160);
  tmp.setColumnWidth(COL_DATE, 85);
  tmp.setColumnWidth(COL_TEMPORARY_PAYER, 90);
  tmp.setColumnWidth(COL_CALCULATED_DATE, 85);
  
  for (sheet of allSheets_jornal) {
    pickupAccountsPayable(sheet, tmp);
  }
}
