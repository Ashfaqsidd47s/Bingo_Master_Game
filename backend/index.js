import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { WebSocketServer } from "ws";
import cookie from "cookie";
import { addUser, exitGame } from "./gameManager.js";


const app = express();
dotenv.config();

// INIITIAL MIDDLEWARES 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    methodName: "GET, POST, PUT, DELETE",
    credentials: true
}));


// CONNECTING TO THE MONGODB 
mongoose.connect(process.env.MONGO)
.then(()=> console.log("Mongodb connected successfully..."))
.catch(err => {
    console.log(err);
})

const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate JWT
const generateJWT = (user) => {
    const payload = { _id: user._id, email: user.email, username: user.username };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token or token expired.' });
            }

            req.user = decoded; 
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



// PASSPORT GOOGLE STRATEGY
passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + "/auth/google/private",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const result =await User.findOne({email: profile.email});
        if(!result){
            const newUser = new User({
                username: profile.displayName,
                email: profile.email,
                password: "google",
            })
    
            const user = await newUser.save();
            cb(null, user)
        } else {
            cb(null, result)
        }
    } catch (err) {
        cb(err);
    }
})
)

// GOOGLE OAUTH AUTHENTICATION ROUTE
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

// GOOGLE OAUTH CALLBACK ROUTE
app.get("/auth/google/private", passport.authenticate("google", { session: false}), (req, res) => {
    const token = generateJWT(req.user);

    res.cookie('token', token, {
        httpOnly: true, 
        secure: true,  
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000, 
    });

    res.redirect(process.env.CLIENT_URL)
})

// PRIVATE ROUTE 
app.get("/private", authenticateJWT,  (req, res) => {
    
    res.json(req.user);
})


// LOGOUT ROUTE 
app.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.json({ message: 'Logged out successfully' });
});



// HTTP SERVER
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log("Server started at port :" + PORT)
})


// WEB-SOCKET SERVER 
const wss = new WebSocketServer({server});

wss.on('connection', async function connection(ws, req) {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['token']; 
    
    if (!token) {
        ws.send('No token found');
        return ws.close();
    }

    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            ws.send('Invalid or expired token');
            return ws.close();
        }

        
        const user = decoded;  

        if (user) {
            addUser(user._id, ws); 

            ws.send('Welcome, ' + user.username); 
            ws.on("close", () => {
                console.log("socket closing");
                exitGame(user._id, ws); 
            });
        } else {
            console.log('User not authenticated');
            ws.send(JSON.stringify({
                message: 'You are not authenticated'
            }));
            return ws.close();
        }
    });
});