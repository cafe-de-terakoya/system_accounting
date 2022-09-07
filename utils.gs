/**
 * 仕分けデータを一行ずつ処理し、総勘定元帳に転記する。
 * 
 * @param {int} lastRow_jornal 転記したい仕訳帳の最終行
 * @param {Object} data_jornal 転記したい仕訳帳の全データ
 */
function postJornalToGL(lastRow_jornal, data_jornal) {
  for (let i=0; i<=(lastRow_jornal-ROW_FIRST_DATA); i++) {
    Logger.log('i = ' + i);
    
    let date          = data_jornal[i][COL_DATE-1];
    let debit         = data_jornal[i][COL_DEBIT-1];
    let debit_amount  = data_jornal[i][COL_DEBIT_AMOUNT-1];
    let credit        = data_jornal[i][COL_CREDIT-1];
    let credit_amount = data_jornal[i][COL_CREDIT_AMOUNT-1];
    let summary       = data_jornal[i][COL_SUMMARY-1];
    let note          = data_jornal[i][COL_NOTE-1];

    // 総勘定元帳 に転記する行(借方・貸方それぞれ)
    let info_debit = [date, credit, (summary+' '+note), debit_amount, ''];  // 日付, 相手勘定科目(貸方), 適用, 借方金額, 貸方金額
    let info_credit = [date, debit, (summary+' '+note), '', credit_amount]; // 日付, 相手勘定科目(借方), 適用, 借方金額, 貸方金額

    /* 参照している仕分けが複合仕分けで、その1つ目の行を参照している場合の処理 --- */
    if (i+1 <= (lastRow_jornal-ROW_FIRST_DATA)) {

      if ( (data_jornal[i+1][COL_DEBIT-1] == '' && data_jornal[i+1][COL_CREDIT-1] != '')
      || (data_jornal[i+1][COL_CREDIT-1] == '' && data_jornal[i+1][COL_DEBIT-1] != '')) {

        // 相手勘定科目を「諸口」に上書き
        info_debit  = [date, '諸口', (summary+' '+note), debit_amount, '']; 
        info_credit = [date, '諸口', (summary+' '+note), '', credit_amount];
        SS_GL.getSheetByName(debit).appendRow(info_debit);
        SS_GL.getSheetByName(credit).appendRow(info_credit);

        Logger.log('複合仕分け(一行目)：');
        Logger.log('借方：' + debit  + ', info_debit  = ' + info_debit);
        Logger.log('貸方：' + credit + ', info_credit = ' + info_credit);
        continue;

      } else {
        // Nothing
      }
    } else {
      // Nothing
    }
    /* ------ */

    /* --- 参照している仕分けが複合仕分けで、その2つ目の行を参照している場合の処理 --- */
    if (data_jornal[i][COL_DEBIT-1] == '' || data_jornal[i][COL_SUMMARY-1] == '') {
      date    = data_jornal[i-1][COL_DATE-1];
      note    = data_jornal[i-1][COL_NOTE-1];
      summary = (data_jornal[i][COL_SUMMARY-1] == '') ? data_jornal[i-1][COL_SUMMARY-1] : summary;
      
      Logger.log('複合仕分け(二行目)：');

      if (data_jornal[i][COL_DEBIT-1] == '') {
        info_credit = [date, '諸口', (summary+' '+note), '', credit_amount];
        SS_GL.getSheetByName(credit).appendRow(info_credit);  // 借方は転記せず、貸方のみ転記
        Logger.log('貸方：' + credit + ', info_credit = ' + info_credit);
        continue;

      } else if (data_jornal[i][COL_CREDIT-1] == '') {
        info_debit = [date, '諸口', (summary+' '+note), debit_amount, ''];
        SS_GL.getSheetByName(debit).appendRow(info_debit);  // 貸方は転記せず、借方のみ転記
        Logger.log('借方：' + debit  + ', info_debit  = ' + info_debit);
        continue;

      } else {
        // Nothing
      }
    } else {
      // Nothing
    }
    /* ------ */

    /* --- 複合仕分けではない場合 --- */
    // info_debit, info_credit は何も書き換えず、借方も貸方も両方記帳する
    SS_GL.getSheetByName(debit).appendRow(info_debit);
    SS_GL.getSheetByName(credit).appendRow(info_credit);

    Logger.log('単一行の仕分け：');
    Logger.log('借方：' + debit  + ', info_debit  = ' + info_debit);
    Logger.log('貸方：' + credit + ', info_credit = ' + info_credit);
    /* ------ */

  } // for文 終わり
}


/**
 * 対象の全シートから未精算の未払金を集計し、別シートに結果を記録する。
 * 
 * @param {Object} fromSheet 未払金を集計する対象の全シート
 * @param {Object} toSheet   未払金を集計した結果を記録するシート
 */
function pickupAccountsPayable(fromSheet, toSheet) {
  const lastRow = fromSheet.getLastRow();

  const allData = fromSheet.getRange(
    ROW_FIRST_DATA,
    COL_FIRST_FIELD,
    lastRow - (ROW_FIRST_DATA-1),
    COL_CALCULATED_DATE
  ).getValues();

  for (data of allData) {
    const credit = data[COL_CREDIT-COL_FIRST_FIELD];
    const calculatedDate = data[COL_CALCULATED_DATE-COL_FIRST_FIELD];
    if (credit == '未払金' && calculatedDate == '') {
      toSheet.appendRow(data);
    }
  }
}
