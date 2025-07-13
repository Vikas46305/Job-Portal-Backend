import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../model/user.model.js";
import isAuth from "../middleware/isAuth.js";

const App = express();

// Register API
App.post("/register", async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;
        if (!name || !email || !mobile || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check password lenght
        if (password.trim().length < 8) {
            return res.status(400).json({
                message: "Password lenght should be 8",
                success: false,
            });
        }

        // Check email already exist or not
        const CheckEmail = await UserModel.findOne({
            email: email.trim().toLowerCase(),
        });
        if (CheckEmail) {
            return res.status(400).json({
                message: "Email already exist",
                success: false,
            });
        }

        // Password Hash
        const HashPassword = await bcrypt.hash(password.trim(), 10);

        // Strore data in db
        const newUser = new UserModel({
            name,
            email: email.trim().toLowerCase(),
            mobile,
            password: HashPassword,
            role,
        });

        await newUser.save();

        res.status(200).json({
            message: "user created success",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Login API
App.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All field are required",
                success: false,
            });
        }

        // Check email exist or not
        const CheckEmail = await UserModel.findOne({
            email: email.trim().toLowerCase(),
        });
        if (!CheckEmail) {
            return res.status(400).json({
                message: "Wrong email, try again ",
                success: false,
            });
        }

        // Check Password
        const HashPassword = await bcrypt.compare(
            password.trim(),
            CheckEmail.password
        );
        if (!HashPassword) {
            return res.status(400).json({
                message: "Wrong password try again",
                success: false,
            });
        }

        // Check role match or not
        if (role !== CheckEmail.role) {
            return res.status(400).json({
                message: "Role not match",
                success: false,
            });
        }

        // Generate Token
        const Token = await jwt.sign(
            { id: CheckEmail._id },
            process.env.SIGN_TOKEN,
            { expiresIn: "1d" }
        );
        res.cookie("Token", Token, {
            maxAge: 24 * 60 * 60,
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })
            .status(200)
            .json({
                message: `Welcome ${CheckEmail.name}`,
                success: true,
            });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: true,
        });
    }
});

// Logout API
App.get("/logout", isAuth, (req, res) => {
    try {
        res.clearCookie("Token", { maxAge: 0 }).status(200).json({
            message: "Logout success",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Update API
App.put("/update", isAuth, async (req, res) => {
    try {
        const { name, mobile, password, bio, skills, resumeName } = req.body;

        // HashPassword
        let HashPassword;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: "Password should be 8 letter",
                    success: false,
                });
            }
            HashPassword = await bcrypt.hash(password.trim(), 10);
        }

        const UpdateUser = await UserModel.findByIdAndUpdate(
            req.userId,
            {
                name,
                mobile,
                password: HashPassword,
                "profile.bio": bio,
                "profile.skills": skills?.toUpperCase().split(","),
                "profile.resumeName": resumeName,
            },
            { new: true }
        );
        await UpdateUser.save();
        res.status(200).json({
            message: "Update success",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

export default App;
