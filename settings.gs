/*
▽ 仕訳帳についての前提：
・各月毎にシートが分かれている。
・下記の定数の通りに、列が用意されている。
・最後の仕分け(最終行) より下に、何も記載がない。

・対応できる複合仕分けは2行まで
　例：10万円の給与のうち、1万円は所得税として預かる場合
　　　給与手当 100,000 / 90,000 現金
　　　　　　　         / 10,000 預り金

・未払金を集計するスクリプトを実行する前に、SHEET_NAME_ACCOUNTS_PAYABLE と同じ名前のシートが存在しないことを担保する。

▽ 総勘定元帳についての前提：
・仕訳帳で使用した勘定科目と同名のシートが用意されている(各勘定科目ごとにシートを分けて管理している)。
・各シートの列構成は、左から 日付, 相手勘定科目, 摘要, 借方金額, 貸方金額 を記載する順番になっている。
*/

// 総勘定元帳
const SS_GL = SpreadsheetApp.openById('1SCtSqRx7gpdtayV2Yvs3HqYTNio1PUhsxPtWvMkGL1E');

/* --- 仕訳帳 --- */
const SS_JORNAL = SpreadsheetApp.getActiveSpreadsheet();

const COL_DATE  = 1;  // 日付
const COL_DEBIT = 2;  // 借方
const COL_DEBIT_AMOUNT  = 3;  // 借方金額
const COL_CREDIT_AMOUNT = 4;  // 貸方金額
const COL_CREDIT  = 5;  // 貸方
const COL_SUMMARY = 6;  // 品目・摘要
const COL_NOTE    = 7;  // 備考
const COL_TEMPORARY_PAYER = 8;  // 立替人
const COL_CALCULATED_DATE = 9;  // 精算日

const COL_FIRST_FIELD = COL_DATE;

const ROW_FIRST_DATA = 2;

const SHEET_NAME_ACCOUNTS_PAYABLE = '未払金 集計結果';
/* ------ */
