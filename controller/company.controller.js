import express from "express";

import isAuth from "../middleware/isAuth.js";
import companyModel from "../model/company.model.js";

const App = express();

// Register Api
App.post("/register", isAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Name is required",
                success: false,
            });
        }

        //  Check if company already exists
        const CheckCompany = await companyModel.findOne({ name });
        if (CheckCompany) {
            return res.status(400).json({
                message: "Company already exists",
                success: false,
            });
        }

        // Create new company
        const newComapany = await new companyModel({
            name,
            created_by: req.userId,
        });
        await newComapany.save();

        res.status(201).json({
            message: "Company created successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Get all companies Api
App.get("/all", isAuth, async (req, res) => {
    try {
        const FindCompany = await companyModel.find({ created_by: req.userId });
        if (!FindCompany) {
            return res.status(400).json({
                message: "No company found",
                success: false,
            });
        }

        // return all companies
        res.status(200).json({
            message: "Companies found successfully",
            success: true,
            data: FindCompany,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Get single company Api
App.get("/:id", isAuth, async (req, res) => {
    try {
        const FindCompany = await companyModel.findById(req.params.id);
        if (!FindCompany) {
            return res.status(400).json({
                message: "No company found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Company found successfully",
            success: true,
            data: FindCompany,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Update Api
App.put("/update/:id", isAuth, async (req, res) => {
    try {
        // Check company exists or not
        const FindCompany = await companyModel.findById(req.params.id);
        if (!FindCompany) {
            return res.status(400).json({
                message: "No company found",
                success: false,
            });
        }

        // Check user is owner of company or not
        if (FindCompany.created_by.toString() !== req.userId) {
            return res.status(400).json({
                message: "You are not owner of this company",
                success: false,
            });
        }

        const { description, website, logo, location } = req.body;
        await companyModel.findByIdAndUpdate(
            FindCompany._id,
            {
                description,
                website,
                logo,
                location,
            },
            { new: true }
        );
        res.status(200).json({
            message: "updated successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

export default App;