import usersDAO from "../dao/usersDAO.js";
import jwt from "jsonwebtoken";

export default class usersController {
    static async apiGetUsers(req, res, next) {
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
        } else if (req.query._id) {
            filters._id = req.query._id;
        }

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
        res.json(response);
    }


    // I think this isnt doning anything here
    static async apiGetUserByUsername(req, res, next) {
        try {
            let username = req.query.username || {};
            let password = req.query.password || {};
            let user = await usersDAO.getUser(username, password);
            if (!user) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(user);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiCheckIfLoggedIn(req, res, next){
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.status(401).json({loggedIn: false})

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({loggedIn: false})
                req.user = user
                res.json({ loggedIn: true, user: req.user });
            })

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLogin(req, res, next) {
        try {
            let email = req.query.email || {};
            let password = req.query.password || {};
            let result = await usersDAO.checkUserLogin(email, password);

            if (!result) {
                res.status(404).json({ error: "Not found" });
                return;
            }

            const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET)

            res.json({ user: accessToken });
            
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiPostUsers(req, res, next) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const ts = new Date();

            const usersResponse = await usersDAO.addUsers(
                username,
                email,
                password,
                ts,
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateUsers(req, res, next) {
        try {
            const userId = req.body._id;
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const ts = new Date();
            const usersResponse = await usersDAO.updateUsers(
                userId,
                username,
                email,
                password,
                ts,
            );
            var { error } = usersResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (usersResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update users - user may not be found",
                );
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteUsers(req, res, next) {
        try {
            const userId = req.query.id;
            console.log(userId);
            const usersResponse = await usersDAO.deleteUsers(userId);

            if (usersResponse.deletedCount === 0) {
                throw new Error(
                    "unable to delete user - user may not be original poster",
                )
            }
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLogout(req, res, next) {
        try {
            // Delete jwt token from local storage

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }


}