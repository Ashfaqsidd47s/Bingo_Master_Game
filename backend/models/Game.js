import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    playerWhiteId: {
        type: String,
        required: true,
        unique: true
    },
    playerBlackId: {
        type: String,
        required: true,
        unique: true
    },
    playerWhiteBoard: {
        type: Array,
        required: true
    },
    playerBlackBoard: {
        type: Array,
        required: true
    },
    blackBingoCount: {
        type: Number,
        default: 0
    },
    whiteBingoCount: {
        type: Number,
        default: 0
    },
    canceledNumbers: {
        type: Array,
        default: []
    },
    turn: {
        type: String,
        default: "w"
    }, 
    winner: {
        type: String,
        default: ""
    }
   },
   {timestamps: true}
);



export default mongoose.model("Game", gameSchema);

