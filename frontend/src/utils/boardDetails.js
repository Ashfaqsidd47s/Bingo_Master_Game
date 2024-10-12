export function boardDetails(board, canceled){
    let resBoard = [];
    let count = 0;
    for (let i = 0; i < 5; i++) {
        resBoard.push([]);
        for (let j = 0; j < 5; j++) {
            resBoard[i].push({
                val: board[i][j],
                isCanceled: canceled.includes(board[i][j]),
                isRow: false,
                isCol: false,
                isDig1: false,
                isDig2: false
            })
        }
    }
    let canceledRows = [];
    let canceledCols = [];
    let canceledDig = [];
    for (let i = 0; i < 5; i++) {
        let rowCanceled = true;
        let columnCanceled = true;
        for (let j = 0; j < 5; j++) {
            if (!canceled.includes(board[i][j])) {
                rowCanceled = false;
            }
            if (!canceled.includes(board[j][i])) {
                columnCanceled = false;
            }
        }
        if (rowCanceled) canceledRows.push(i);
        if (columnCanceled) canceledCols.push(i);
    }

    let diagonal1Canceled = true;
    let diagonal2Canceled = true;
    for (let i = 0; i < 5; i++) {
        if (!canceled.includes(board[i][i])) {
            diagonal1Canceled = false;
        }
        if (!canceled.includes(board[i][4 - i])) {
            diagonal2Canceled = false;
        }
    }
    if (diagonal1Canceled) canceledDig.push(1);
    if (diagonal2Canceled) canceledDig.push(2);

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if(canceledRows.includes(i)) resBoard[i][j].isRow = true;
            if(canceledCols.includes(j)) resBoard[i][j].isCol = true;
            if(i == j && canceledDig.includes(1)) resBoard[i][j].isDig1 = true;
            if(i + j == 4 && canceledDig.includes(2)) resBoard[i][j].isDig2 = true;
        }
    }
    count = canceledRows.length + canceledCols.length + canceledDig.length;
    return {
        resBoard: resBoard,
        count: count
    };
}