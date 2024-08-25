import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 25,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 25,
    },
    password: {
        type: String,
        required: true,
        min: 4,
    },
   },
   {timestamps: true}
);



export default mongoose.model("User", userSchema);

