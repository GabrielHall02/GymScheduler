import express from "express"
import scheduleControler from "../controllers/schedule.controller.js"

const router = express.Router();

router
    .route("/")
    .get(scheduleControler.apiGetSchedule)
    .post(scheduleControler.apiPostSchedule)
    .put(scheduleControler.apiUpdateSchedule)
    .delete(scheduleControler.apiDeleteSchedule)

export default router