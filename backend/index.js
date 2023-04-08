import app from "./server.js"
import express from "express"
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./dao/usersDAO.js"
import ScheduleDAO from "./dao/scheduleDAO.js"
import PendingUsersDAO from "./dao/pendingUsersDAO.js"


dotenv.config()
const MongoClient = mongodb.MongoClient


const port = process.env.PORT || 5005

MongoClient.connect(
        process.env.ATLAS_URI, {
            maxPoolSize: 10,
            wtimeoutMS: 2500,
            useNewUrlParser: true
        }
    )
    // Log error
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })

// Log success
.then(async client => {
    await PendingUsersDAO.injectDB(client)
    await UsersDAO.injectDB(client)
    await ScheduleDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})