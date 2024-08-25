import Game from "./models/Game.js";
import Bingo from "bingo-master";

let pendingUser = null;
let usersList = []
let games = []
export async function chekUser(userId, socket){

}

export async function addUser(userId, socket) {
    let currentUser = usersList.find((user) => user.userId === userId)
    if(!currentUser){
        currentUser = new SocketUser(userId, socket);
        usersList.push(currentUser);
    }
    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());
        
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
                        board: gameDb.playerWhiteBoard,
                        canceledNumbers: gameDb.canceledNumbers
                    }))
                } else {
                    currentUser.socket.send(JSON.stringify({
                        board: gameDb.playerBlackBoard,
                        canceledNumbers: gameDb.canceledNumbers
                    }))
                }
            } else {
                currentUser.socket.send("no game found start a new game");
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
                    board: bingoGame.playerWhiteBoard,
                    canceledNumbers: bingoGame.canceledNumbers
                }))
                player2.socket.send(JSON.stringify({
                    board: bingoGame.playerBlackBoard,
                    canceledNumbers: bingoGame.canceledNumbers
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
                currentUser.socket.send("Its not your turn")
                return;
            }
            if(userId == bingoGame.playerBlackId && bingoGame.canceledNumbers.length % 2 == 0){
                currentUser.socket.send("Its not your turn")
                return;
            }
            if(bingoGame.canceledNumbers.includes(message.number) || (message.number > 25 && message.number < 1)){
                currentUser.socket.send("Invalid move number is alredy canceled")
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
                    winner: bingoGame.winner,
                    canceledNumbers: bingoGame.canceledNumbers
                }))
                player2.socket.send(JSON.stringify({
                    winner: bingoGame.winner,
                    canceledNumbers: bingoGame.canceledNumbers
                }))
                await gameDb.deleteOne();
                usersList = usersList.filter((user) => user.userId === bingoGame.playerWhiteId || user.userId === bingoGame.playerBlackId)
                games = games.filter((game) => game == bingoGame)
                return;
            }
            player1.socket.send(JSON.stringify({
                canceledNumbers: bingoGame.canceledNumbers
            }))
            player2.socket.send(JSON.stringify({
                canceledNumbers: bingoGame.canceledNumbers
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
            usersList = usersList.filter((user) => user.userId === bingoGame.playerWhiteId || user.userId === bingoGame.playerBlackId)
            games = games.filter((game) => game == bingoGame)
            return;

        }
    })
}

export async function exitGame(userId, socket) {
    const game = games.find((game)=> game.playerWhiteId === userId || game.playerBlackId === userId)
    const cUser = usersList.find((user) => user.userId == userId)
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
    
        player2.socket.on("close", async () => {
            const dbGame = await Game.deleteOne({
                $or:[
                    {playerWhiteId : userId},
                    {playerBlackId : userId},
                ]
            })
            usersList = usersList.filter((user) => user.userId !== player1.userId || user.userId !== player2.userId)
            games = games.filter((game) => game.playerWhiteId !== userId || game.playerBlackId !== userId);
        })
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


