import pendingUsersDAO from '../dao/pendingUsersDAO.js';
import usersDAO from '../dao/usersDAO.js';

export default class pendingUsersController {
    static async apiGetPendingUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ?
            parseInt(req.query.usersPerPage, 10) :
            20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        
        if (req.query.username) {
            filters.username = req.query.username;
        } else if (req.query.email) {
            filters.email = req.query.email;
        } else if (req.query.password) {
            filters.password = req.query.password;
        }

        const { usersList, totalNumUsers } = await pendingUsersDAO.GetPendingUsers({
            filters,
            page,
            usersPerPage,
        });

        let response = {
            pendingUsers: usersList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: totalNumUsers,
        };
        res.json(response);
    }

    static async apiPostPendingUser(req, res, next) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            // check if email exists in the database
            const usersPerPage = req.query.usersPerPage ?
                parseInt(req.query.usersPerPage, 10) :
                20;
            const page = req.query.page ? parseInt(req.query.page, 10) : 0;

            let filters = {};

            filters.email = email;

            console.log(filters.email)

            const { usersList, totalNumUsers } = await usersDAO.getUsers({
                filters,
                page,
                usersPerPage,
            });

            let response = {
                users: usersList,
                page: page,
                filters: filters,
                entries_per_page: usersPerPage,
                total_results: totalNumUsers,
            };

            if (response.total_results > 0) {
                res.status(400).json({ error: "Email already exists" });
                return;
            }

            const pendingUserResponse = await pendingUsersDAO.addPendingUser(
                username,
                email,
                password
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeletePendningUser(req, res, next) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const pendingUserResponse = await pendingUsersDAO.deletePendingUser(
                username,
                email,
                password
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Activate Pending User
    static async apiActivatePendingUser(req, res, next) {
        try {
            const id = req.query.id || {};
            const pendingUserResponse = await pendingUsersDAO.activatePendingUser(
                id
            );

            // Delete pending user
            const pendingUserDeleteResponse = await pendingUsersDAO.deletePendingUser(id)

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Delete Pending User
    static async apiDeletePendingUser(req, res, next) {
        try {
            const id = req.query.id || {};
            console.log(id)
            const pendingUserResponse = await pendingUsersDAO.deletePendingUser(id);

            if (pendingUserResponse.deletedCount === 0) {
                throw new Error(
                    "unable to delete user - user may not be original poster",
                )
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}