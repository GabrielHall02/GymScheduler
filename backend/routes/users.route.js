import express from "express"
import usersController from "../controllers/users.controller.js";

const router = express.Router();


router
    .route("/")
    .get(usersController.apiGetUsers)
    .post(usersController.apiPostUsers)
    .put(usersController.apiUpdateUsers)
    .delete(usersController.apiDeleteUsers)

router
    .route("/login")
    .post(usersController.apiCheckUserLogin)
    .get(usersController.apiCheckIfLoggedIn)
router
    .route("/logout")
    .get(usersController.apiLogout)

export default router