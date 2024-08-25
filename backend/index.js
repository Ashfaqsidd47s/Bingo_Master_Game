import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import { WebSocketServer } from "ws";
import cookie from "cookie";
import { addUser, exitGame } from "./gameManager.js";


const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// temp code 
const sessionMiddleware = session({
    secret: "this is top secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
});
// temp

app.use(sessionMiddleware)

//using passport
app.use(passport.initialize())
app.use(passport.session())


// sending html file on requsting route a genral statement 
function sendPublicFile(res, fileName) {
    res.sendFile(path.join(__dirname, 'public', fileName));
}

// connecting to mongodb 
mongoose.connect(process.env.MONGO)
.then(()=> console.log("Mongodb connected successfully..."))
.catch(err => {
    console.log(err);
})


app.get("/", (req, res) => {
    sendPublicFile(res, "index.html")
})
app.get("/login", (req, res) => {
    sendPublicFile(res, "login.html")
})
app.get("/register", (req, res) => {
    sendPublicFile(res, "register.html")
})

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

app.get("/auth/google/private", passport.authenticate("google", {
    successRedirect: "/private",
    failureRedirect: "/login"
}))

//REGISTER USER
app.post("/register",async function(req,res){
    try {
        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.name,
            email: req.body.username,
            password: hashedPassword,
        })

        const user = await newUser.save();
        req.login(user, (err) => {
            console.log(err)
            res.redirect("/private")
        }) 
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});


//LOGIN USER
app.post("/login", passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login"
}))


// Private route only available when used has logged in 
app.get("/private", (req, res) => {
    if(req.isAuthenticated()){
        console.log(req.user)
        return res.status(200).sendFile(path.join(__dirname, 'public', "private.html"))
    } else {
        return res.redirect("/login")
    }
})

// Route to handle logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) console.log(err)
        res.redirect("/")
    })
});


// passport varification function local strategy 
passport.use("local", new Strategy(async function verify(username, password, cb) {
    try {
        const user =await User.findOne({email: username});
        if(!user){
            return cb("user not found", false);
        }
        const validate =await bcrypt.compare(password , user.password);
        if(!validate) {
            return cb("password not matching ", false);
        }

        return cb(null, user)
    } catch (err) {
        return cb(err)        
    }
}))


// passport google strategy 
passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/private",
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


passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log("server started at port :" + PORT)
})

// websocket server 

const wss = new WebSocketServer({server});

// wss.on('connection', function connection(ws, req) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data) {
//     console.log('received: %s', data);
//     console.log(req.headers.cookie)
    
//   });
  
//   ws.send('something');

// });

// temp code
wss.on('connection', async function connection(ws, req) {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');
    const sid = cookies['connect.sid'];
    
    if (!sid) {
        ws.send('No session found');
        return ws.close();
    }

    const res = {
        getHeader: () => null,
        setHeader: () => null,
    };

    req.headers.cookie = `connect.sid=${sid}`;
    
    sessionMiddleware(req, res, () => {
        passport.initialize()(req, res, () => {
            passport.session()(req, res, () => {
                if (req.user) {
                    console.log('User authenticated:', req.user);
                    addUser(req.user._id, ws)

                    ws.send('Welcome, ' + req.user.username);
                    ws.on("close", () => {
                        exitGame(req.user._id, ws);
                    })
                } else {
                    console.log('User not authenticated');
                    ws.send('You are not authenticated');
                }
            });
        });
    });
});