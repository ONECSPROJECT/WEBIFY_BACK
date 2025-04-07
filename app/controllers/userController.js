const BaseModel = require('../models/BaseModel');
const db = require('../config/db');

const User = new BaseModel('User');
const jwt = require('jsonwebtoken');



class UserController {
    static async createUser(req, res) {
        try {
            res.status(500).json({
                status: 'error',
                message: 'This route is not defined! Please use /register instead'
              });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            await User.update(id, req.body);
            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            await User.delete(id);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const query = `
                SELECT 
                    U.user_id,
                    U.first_name,
                    U.last_name,
                    U.state,
                    U.payment_information,
                    U.faculty,
                    A.account_id,
                    A.email,
                    A.role,
                    R.name AS rank_name,
                    R.pay_rate_course,
                    R.pay_rate_lab,
                    R.pay_rate_tutorial
                FROM User U
                INNER JOIN Account A ON U.user_id = A.user_id
                LEFT JOIN ProfRank PR ON PR.prof_rank_id = (
                    SELECT MAX(prof_rank_id)
                    FROM ProfRank
                    WHERE professor_id = U.user_id
                )
                LEFT JOIN Rank R ON PR.rank_id = R.rank_id
            `;
    
            const users = await db.query(query);
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error while fetching users' });
        }
    }
    
    
    
    
    static async getUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const query = `
           SELECT 
                    U.user_id,
                    U.first_name,
                    U.last_name,
                    U.state,
                    U.payment_information,
                    U.faculty,
                    A.account_id,
                    A.email,
                    A.role,
                    R.name AS rank_name,
                    R.pay_rate_course,
                    R.pay_rate_lab,
                    R.pay_rate_tutorial
                FROM User U
                INNER JOIN Account A ON U.user_id = A.user_id
                LEFT JOIN ProfRank PR ON PR.prof_rank_id = (
                    SELECT MAX(prof_rank_id)
                    FROM ProfRank
                    WHERE professor_id = U.user_id
                )
                LEFT JOIN Rank R ON PR.rank_id = R.rank_id
            `;
            const user = await db.query(query, [id]);
            res.status(200).json(user);  

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    

    static async updateMe(req, res) {
        try {
            if (req.body.password || req.body.passwordConfirm) {
                return next(
                  new AppError(
                    'This route is not for password updates. Please use /request-reset-password',
                    400
                  )
                );}
            const { user_id } = req.body;
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            await User.update(user_id, req.body);
            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static extractUserId(req) {
        let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error("Unauthorized, token missing");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user_id; 
    }

    static async getMe(req, res) {
        try {
            const user_id = UserController.extractUserId(req);
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    static async updateMe(req, res) {
        try {
            const user_id = UserController.extractUserId(req);

            await User.update(user_id, req.body);
            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteMe(req, res) {
        try {
            const user_id = UserController.extractUserId(req);

            await User.update(user_id, { active: false });
            res.status(200).json({ message: "Account deactivated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    
}

module.exports = UserController;
