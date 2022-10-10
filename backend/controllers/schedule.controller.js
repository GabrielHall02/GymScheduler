import scheduleDAO from "../dao/scheduleDAO.js"

export default class scheduleControler {
    static async apiGetSchedule(req, res, next) {
        const schedulePerPage = req.query.schedulePerPage ? parseInt(req.query.schedulePerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.date) {
            filters.date = req.query.date
        } else if (req.query.duration) {
            filters.duration = req.query.duration
        } else if (req.query.username) {
            filters = req.query.username
        }

        const { scheduleList, totalNumSchedule } = await scheduleDAO.getSchedule({
            filters,
            page,
            schedulePerPage,
        })

        let response = {
            schedule: scheduleList,
            page: page,
            filters: filters,
            entries_per_page: schedulePerPage,
            total_results: totalNumSchedule,
        }
        res.json(response)
    }

    static async apiPostSchedule(req, res, next) {
        try {
            const date = new Date(req.body.date)
            const duration = req.body.duration
            const userInfo = {
                username: req.body.username,
            }
            const scheduleResponse = await scheduleDAO.addSchedule(
                date,
                duration,
                userInfo,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateSchedule(req, res, next) {
        try {
            const scheduleId = req.body.schedule_id
            const date = new Date(req.body.date)
            const duration = req.body.duration


            const scheduleResponse = await scheduleDAO.updateSchedule(
                scheduleId,
                date,
                duration,
                req.body.username,
            )
            var { error } = scheduleResponse
            if (error) {
                res.status(400).json({ error })
            }
            if (scheduleResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update schedule - user may not be original poster",
                )
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteSchedule(req, res, next) {
        try {
            const scheduleId = req.query.id
            const username = req.body.username
            console.log(scheduleId)
            const scheduleResponse = await scheduleDAO.deleteSchedule(
                scheduleId,
                username,
            )
            if (scheduleResponse.deletedCount === 0) {
                throw new Error(
                    "unable to delete schedule - user may not be original poster",
                )
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

}