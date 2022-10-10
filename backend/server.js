import express from "express"
import cors from "cors"
import users from "./routes/users.route.js"
import schedule from "./routes/schedule.route.js"
import pendingUsers from "./routes/pendingUsers.route.js"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import session from "express-session"

const app = express()

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    key: "userId",
    secret: "gymscheduler",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
}))

app.use("/api/v1/users", users)
app.use("/api/v1/schedule", schedule)
app.use("/api/v1/pendingUsers", pendingUsers)

app.use("*", (req, res) => { res.status(404).json({ error: "not found" }) })



export default app