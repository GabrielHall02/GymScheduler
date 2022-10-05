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
            } else if ("user" in filters) {
                query = { "user": { $eq: filters["user"] } }
            }
        }

        let cursor

        try {
            cursor = await schedule
                .find(query)
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
                user_id: userInfo._id
            }
            return await schedule.insertOne(scheduleDoc)
        } catch (e) {
            console.error(`Unable to post schedule: ${e}`)
            return { error: e }
        }
    }

    // Update a schedule
    static async updateSchedule(scheduleId, date, duration, userId) {
        try {
            const updateResponse = await schedule.updateOne({ _id: ObjectId(scheduleId), user_id: userId }, { $set: { date: date, duration: duration } }, )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update schedule: ${e}`)
            return { error: e }
        }
    }

    // Delete a schedule
    static async deleteSchedule(scheduleId, userId) {
        try {
            const deleteResponse = await schedule.deleteOne({
                _id: ObjectId(scheduleId),
                user_id: userId
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete schedule: ${e}`)
            return { error: e }
        }
    }

}