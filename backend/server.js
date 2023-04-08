import express from "express"
import cors from "cors"
import users from "./routes/users.route.js"
import schedule from "./routes/schedule.route.js"
import pendingUsers from "./routes/pendingUsers.route.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import session from 'express-session';
import MongoStore from 'connect-mongo';
import jwt from "jsonwebtoken"

const sessionStore = MongoStore.create({ mongoUrl: 'mongodb+srv://admin:Aveiro02_m@cluster.ccbq6mw.mongodb.net/?retryWrites=true&w=majority',dbName: 'gymData' })

const app = express()

app.use(cors({
    // origin: "http://localhost:3000",
    origin: ["https://guysauceperformance.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders:[
        "Access-Control-Allow-Header",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Credentials",
        "Origin",
        "withCredentials",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-HTTTP-Method-Override",
        "Set-Cookie",
        "Cookie",
        "Request",
    ],
}))


app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


app.set("trust proxy", 1);
app.use(session({
    secret: "gymscheduler",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
    },
}))

app.use("/api/v1/users", users)
app.use("/api/v1/schedule", schedule)
app.use("/api/v1/pendingUsers", pendingUsers)

app.use("*", (req, res) => { res.status(404).json({ error: "not found" }) })


export default app