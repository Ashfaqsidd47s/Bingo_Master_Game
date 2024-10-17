import Game from "./models/Game.js";
import Bingo from "bingo-master";

let pendingUser = null;
let usersList = []
let games = []
let aliveSockets = []
export async function chekUser(userId, socket){

}

export async function addUser(userId, socket) {
    let currentUser = usersList.find((user) => user.userId === userId)
    aliveSockets.push(socket)
    if(!currentUser){
        currentUser = new SocketUser(userId, socket);
        usersList.push(currentUser);
    } else {
        currentUser.socket = socket;
    }
    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        console.log("message recieved :" + message)
        
        if(message.type === "connect_game"){
            const gameDb = await Game.findOne({
                $or: [
                    {playerWhiteId: userId},
                    {playerBlackId : userId}
                ]
            })
            if(gameDb){
                if(userId == gameDb.playerWhiteId) {
                    currentUser.socket.send(JSON.stringify({
                        board: boardDetails(gameDb.playerWhiteBoard, gameDb.canceledNumbers),
                        turn: gameDb.turn,
                        id: "w"
                    }))
                } else {
                    currentUser.socket.send(JSON.stringify({
                        board: boardDetails(gameDb.playerBlackBoard, gameDb.canceledNumbers),
                        turn: gameDb.turn,
                        id: "b"
                    }))
                }
            } else {
                currentUser.socket.send(JSON.stringify({
                    message:"no game found start a new game"
                }));
            }
        }
        if(message.type === "init_game"){
            if(pendingUser){
                if(userId == pendingUser){
                    currentUser.socket.send(JSON.stringify({
                        err: true,
                        message:"You can't play with yourself"
                    }))
                    return;
                }
                const bingoGame = new BGame( pendingUser, userId);
                games.push(bingoGame);
                const newGameDb = new Game({
                    playerWhiteId: pendingUser,
                    playerBlackId: userId,
                    playerWhiteBoard : bingoGame.playerWhiteBoard,
                    playerBlackBoard: bingoGame.playerBlackBoard,
                    canceledNumbers: bingoGame.canceledNumbers,
                    whiteBingoCount: bingoGame.whiteBingoCount,
                    blackBingoCount: bingoGame.blackBingoCount,
                    turn: bingoGame.turn,
                    winner: ""
                })
                const gameDb = await newGameDb.save();
                const player1 = usersList.find((user) => user.userId === bingoGame.playerWhiteId)
                const player2 = usersList.find((user) => user.userId === bingoGame.playerBlackId)
                player1.socket.send(JSON.stringify({
                    board: boardDetails(bingoGame.playerWhiteBoard, bingoGame.canceledNumbers),
                    turn: bingoGame.turn,
                    id: "w"
                }))
                player2.socket.send(JSON.stringify({
                    board: boardDetails(bingoGame.playerBlackBoard, bingoGame.canceledNumbers),
                    turn: bingoGame.turn,
                    id: "b"
                }))
                pendingUser = null;
            } else {
                pendingUser = userId
            }
        }
        if(message.type === "cancel_number"){
            // find game info
            const gameDb = await Game.findOne({
                $or: [
                    {playerWhiteId: userId},
                    {playerBlackId : userId}
                ]
            })
            const bingoGame = games.find((game) => game.playerWhiteId == userId || game.playerBlackId == userId)
         
            // chek is this the users turn 
            if(userId == bingoGame.playerWhiteId && bingoGame.canceledNumbers.length % 2 == 1){
                currentUser.socket.send(JSON.stringify({
                    message: "Its not your turn"
                }))
                return;
            }
            if(userId == bingoGame.playerBlackId && bingoGame.canceledNumbers.length % 2 == 0){
                currentUser.socket.send(JSON.stringify({
                    message: "Its not your turn"
                }))
                return;
            }
            if(bingoGame.canceledNumbers.includes(message.number) || (message.number > 25 && message.number < 1)){
                currentUser.socket.send(JSON.stringify({
                    message: "Invalid move can't cancel the number"
                }))
                return;
            }
            // cancelNumber 
            bingoGame.handelCancel(message.number, bingoGame.turn);

            // if anyone wins send winner info and remove game 
            const player1 = usersList.find((user) => user.userId === bingoGame.playerWhiteId)
            const player2 = usersList.find((user) => user.userId === bingoGame.playerBlackId)
            if(bingoGame.winner){
                gameDb.winner = bingoGame.winner
                player1.socket.send(JSON.stringify({
                    board: boardDetails(bingoGame.playerWhiteBoard, bingoGame.canceledNumbers),
                    turn: bingoGame.turn,
                    id: "w",
                    winner: bingoGame.winner,
                    message: bingoGame.winner == "w" ? "You win the game" : "You loos the game"
                }))
                player2.socket.send(JSON.stringify({
                    board: boardDetails(bingoGame.playerBlackBoard, bingoGame.canceledNumbers),
                    turn: bingoGame.turn,
                    id: "b",
                    winner: bingoGame.winner,
                    message: bingoGame.winner == "b" ? "You win the game" : "You loos the game"
                }))
                await gameDb.deleteOne();
                usersList = usersList.filter((user) => user.userId !== bingoGame.playerWhiteId || user.userId !== bingoGame.playerBlackId)
                games = games.filter((game) => game !== bingoGame)
                return;
            }
            player1.socket.send(JSON.stringify({
                board: boardDetails(bingoGame.playerWhiteBoard, bingoGame.canceledNumbers),
                turn: bingoGame.turn,
                id: "w"
            }))
            player2.socket.send(JSON.stringify({
                board: boardDetails(bingoGame.playerBlackBoard, bingoGame.canceledNumbers),
                turn: bingoGame.turn,
                id: "b"
            }))
            gameDb.canceledNumbers.push(message.number);
            gameDb.whiteBingoCount = bingoGame.whiteBingoCount;
            gameDb.blackBingoCount = bingoGame.blackBingoCount;
            gameDb.turn = bingoGame.turn;
            await gameDb.save();
            
        }
        if(message.type === "exit_game") {
            const gameDb = await Game.findOne({
                $or: [
                    {playerWhiteId: userId},
                    {playerBlackId : userId}
                ]
            })
            const bingoGame = games.find((game) => game.playerWhiteId === userId || game.playerBlackId === userId)
            const player1 = usersList.find((user) => user.userId === bingoGame.playerWhiteId)
            const player2 = usersList.find((user) => user.userId === bingoGame.playerBlackId)
            if(currentUser == player1) {
                player2.socket.send(JSON.stringify({
                    winner :"b",
                    message: "other player left the game"
                }))
                player1.socket.send(JSON.stringify({
                    winner :"b",
                    message: "other player left the game"
                }))
            } else {
                player1.socket.send(JSON.stringify({
                    winner :"w",
                    message: "you quit the game"
                }))
                player2.socket.send(JSON.stringify({
                    winner :"w",
                    message: "you quit the game"
                }))
            }
            await gameDb.deleteOne();
            usersList = usersList.filter((user) => user.userId !== bingoGame.playerWhiteId || user.userId !== bingoGame.playerBlackId)
            games = games.filter((game) => game != bingoGame)
            return;

        }
    })
}

export async function exitGame(userId, socket) {
    aliveSockets = aliveSockets.filter((s) => s != socket);
    const game = games.find((game)=> game.playerWhiteId === userId || game.playerBlackId === userId)
    const cUser = usersList.find((user) => user.userId == userId)
    console.log("game found :" + game)
    if(game){
        let player1 = null;
        let player2 = null;
        if(game.playerWhiteId === userId) {
            player1 = cUser;
            player2 = usersList.find((user) => user.userId == game.playerBlackId)
        } else {
            player1 = cUser;
            player2 = usersList.find((user) => user.userId == game.playerWhiteId)
        }
        if(!aliveSockets.includes(player2.socket)){
            console.log("second socket disconected")
            const dbGame = await Game.deleteOne({
                $or:[
                    {playerWhiteId : userId},
                    {playerBlackId : userId},
                ]
            })
            usersList = usersList.filter((user) => user.userId !== player1.userId || user.userId !== player2.userId)
            games = games.filter((game) => game.playerWhiteId !== userId || game.playerBlackId !== userId);
            return;
        }
    }
}
class SocketUser {
    constructor(userId, socket) {
        this.userId = userId;
        this.socket = socket;
    }
}

class BGame {
    constructor( 
        playerWhiteId, 
        playerBlackId
    ) {
        this.playerWhiteId = playerWhiteId;
        this.playerBlackId = playerBlackId;
        this.bingo = new Bingo();
        this.playerWhiteBoard = this.bingo.playerWhiteBoard;
        this.playerBlackBoard = this.bingo.playerBlackBoard;
        this.whiteBingoCount = this.bingo.whiteBingoCount;
        this.blackBingoCount = this.bingo.blackBingoCount;
        this.canceledNumbers = this.bingo.canceledNumbers;
        this.turn = this.bingo.turn;
        this.winner = this.bingo.winner;
    }

    handelCancel(number, turn) {
        this.bingo.cancelNumber(number, turn)
        this.whiteBingoCount = this.bingo.whiteBingoCount;
        this.blackBingoCount = this.bingo.blackBingoCount;
        this.canceledNumbers = this.bingo.canceledNumbers;
        this.turn = this.bingo.turn;
        this.winner = this.bingo.winner;
    }

    load(whiteBoard, blackBoard, canceledNumbers, whiteBingoCount, blackBingoCount, turn){
        this.bingo.loadWhite(whiteBoard)
        this.bingo.loadBlack(blackBoard)
        this.bingo.canceledNumbers = canceledNumbers
        this.canceledNumbers = canceledNumbers
        this.bingo.whiteBingoCount = whiteBingoCount
        this.whiteBingoCount = whiteBingoCount
        this.bingo.blackBingoCount = blackBingoCount
        this.blackBingoCount = blackBingoCount
        this.bingo.turn = turn
        this.turn = turn
    }

    getTurn() {
        return this.bingo.turn
    }
}

// board detail
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


