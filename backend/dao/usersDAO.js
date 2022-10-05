import mongodb from "mongodb"
import bcrypt from "bcrypt"

const ObjectId = mongodb.ObjectId


const saltRounds = 10

let users

export default class usersDAO {
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db(process.env.DB_NS).collection("users")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in usersDAO: ${e}`,
            )
        }
    }

    // Get all users
    static async getUsers({
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
            cursor = await users
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { usersList: [], totalNumUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await users.countDocuments(query)

            return { usersList, totalNumUsers }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { usersList: [], totalNumUsers: 0 }
        }
    }

    // Get a user by email and password
    static async checkUserLogin(email, password) {
        try {
            const pipeline = [
                {
                    $match: {
                        email: email,
                    },
                },
            ]
            const res = await users.aggregate(pipeline).next()
            if (res) {
                const match = await bcrypt.compare(password, res.password)
                if (match) {
                    return res
                }
            }
        } catch (e) {
            console.error(`Something went wrong in getUser: ${e}`)
            throw e
        }
    }


    // Add a new user
    static async addUsers(username, email, password, ts) {
        try {
            const pass = await bcrypt.hash(password, saltRounds)

            const userDoc = { username: username, email: email, password: pass, timestamp: ts }

            return await users.insertOne(userDoc)
        } catch (e) {
            console.error(`Unable to post user: ${e}`)
            return { error: e }
        }
    }

    // Update a user
    static async updateUsers(userId, username, email, password, ts) {
        try {
            const updateResponse = await users.updateOne({ _id: ObjectId(userId) }, { $set: { username: username, email: email, password: password, timestamp: ts } }, )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update user: ${e}`)
            return { error: e }
        }
    }

    // Delete a user
    static async deleteUsers(userId) {
        try {
            const deleteResponse = await users.deleteOne({
                _id: ObjectId(userId),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete user: ${e}`)
            return { error: e }
        }
    }


}