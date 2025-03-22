// const BaseModel = require('../models/BaseModel');
// const User = new BaseModel('User');

// class UserController {
//     static async createUser(req, res) {
//         try {
//             const newUser = await User.create(req.body);
//             res.status(201).json({ message: 'User created successfully', user: newUser });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async updateUser(req, res) {
//         try {
//             const { user_id } = req.params;
//             const updatedUser = await User.update(user_id, req.body);
//             res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async deleteUser(req, res) {
//         try {
//             const { user_id } = req.params;
//             await User.delete(user_id);
//             res.status(200).json({ message: 'User deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async getAllUsers(req, res) {
//         try {
//             const users = await User.getAll();
//             res.status(200).json(users);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async getUserById(req, res) {
//         try {
//             const { user_id } = req.params;
//             const user = await User.getOne(user_id);
//             res.status(200).json(user);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async updateMe(req, res) {
//         try {
//             const { user_id } = req.user; // Assuming user ID is extracted from auth middleware
//             const updatedUser = await User.update(user_id, req.body);
//             res.status(200).json({ message: 'Your profile has been updated', user: updatedUser });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async deleteMe(req, res) {
//         try {
//             const { user_id } = req.user;
//             await User.delete(user_id);
//             res.status(200).json({ message: 'Your account has been deleted' });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// }

// module.exports = UserController;
const BaseModel = require('../models/BaseModel');
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
            const users = await User.getAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const user = await User.getById(id);
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
