import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let schedule


export default class scheduleDAO {
    static async injectDB(conn) {
        if (schedule) {
            return
        }
        try {
            schedule = await conn.db(process.env.DB_NS).collection("schedule")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in scheduleDAO: ${e}`,
            )
        }
    }

    // Get all schedule
    static async getSchedule({
        filters = null,
        page = 0,
        schedulePerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("date" in filters) {
                query = { $date: { $search: filters["date"] } }
            } else if ("duration" in filters) {
                query = { "duration": { $eq: filters["duration"] } }
            } else if ("username" in filters) {
                query = { "username": { $eq: filters["username"] } }
            }
        }

        let cursor

        try {
            cursor = await schedule
                .find(query)
            cursor.sort({ date: 1 })

        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { scheduleList: [], totalNumSchedule: 0 }
        }

        const displayCursor = cursor.limit(schedulePerPage).skip(schedulePerPage * page)

        try {
            const scheduleList = await displayCursor.toArray()
            const totalNumSchedule = await schedule.countDocuments(query)

            return { scheduleList, totalNumSchedule }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { scheduleList: [], totalNumSchedule: 0 }
        }
    }

    // Add a new schedule
    static async addSchedule(date, duration, userInfo) {
        try {
            const scheduleDoc = {
                date: date,
                duration: duration,
                username: userInfo.username
            }
            return await schedule.insertOne(scheduleDoc)
        } catch (e) {
            console.error(`Unable to post schedule: ${e}`)
            return { error: e }
        }
    }

    // Update a schedule
    static async updateSchedule(scheduleId, date, duration, username) {
        try {
            const updateResponse = await schedule.updateOne({ _id: ObjectId(scheduleId), username: username }, { $set: { date: date, duration: duration } }, )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update schedule: ${e}`)
            return { error: e }
        }
    }

    // Delete a schedule
    static async deleteSchedule(scheduleId, username) {
        try {
            const deleteResponse = await schedule.deleteOne({
                _id: ObjectId(scheduleId),
                username: username
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete schedule: ${e}`)
            return { error: e }
        }
    }

}