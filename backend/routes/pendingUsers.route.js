import express from "express"
import usersController from "../controllers/pendingUsers.controller.js";

const router = express.Router();


router
    .route("/")
    .get(usersController.apiGetPendingUsers)
    .post(usersController.apiPostPendingUser)
    .delete(usersController.apiDeletePendingUser)


router
    .route("/activate")
    .get(usersController.apiActivatePendingUser)


export default router