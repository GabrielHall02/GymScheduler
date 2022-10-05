import mongodb from "mongodb"
import bcrypt from "bcrypt"
import sendConfirmationEmail from "../mailer/mailer.js"

const ObjectId = mongodb.ObjectId

const saltRounds = 10

let pendingUsers
let users

export default class pendingUsersDAO {
    static async injectDB(conn) {
        if (pendingUsers) {
            return
        }
        try {
            pendingUsers = await conn.db(process.env.DB_NS).collection("pendingUsers")
            users = await conn.db(process.env.DB_NS).collection("users")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in pendingUsersDAO: ${e}`,
            )
        }
    }

    // apiGetPendingUsers
    static async GetPendingUsers({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("username" in filters) {
                query = { $text: { $search: filters["username"] } }
            } else if ("email" in filters) {
                query = { "email": { $eq: filters["email"] } }
            } else if ("password" in filters) {
                query = { "password": { $eq: filters["password"] } }
            }
        }

        let cursor

        try {
            cursor = await pendingUsers
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { usersList: [], totalNumUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await pendingUsers.countDocuments(query)

            return { usersList, totalNumUsers }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { usersList: [], totalNumUsers: 0 }
        }
    }

    // addPendingUser
    static async addPendingUser(username, email, password) {
        try {

            const pass = await bcrypt.hash(password, saltRounds)

            const userDoc = {
                username: username,
                email: email,
                password: pass,
            }
            
            await pendingUsers.insertOne(userDoc)
            const user = await pendingUsers.findOne({email: email})
            return await sendConfirmationEmail(user, user._id)
        } catch (e) {
            console.error(`Unable to post user: ${e}`)
            return { error: e }
        }
    }

    // activatePendingUser
    static async activatePendingUser(id) {
        try{
            const user = await pendingUsers.findOne({_id: ObjectId(id)})
            const userDoc = {
                username: user.username,
                email: user.email,
                password: user.password,
            }

            return await users.insertOne(userDoc)
        } catch (e) {
            console.error(`Unable to post user: ${e}`)
            return { error: e }
        }
    }

    // deletePendingUser
    static async deletePendingUser(id) {
        try {
            const deleteResponse = await pendingUsers.deleteOne({
                _id: ObjectId(id),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete user: ${e}`)
            return { error: e }
        }
    }

}