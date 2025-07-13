import express from "express";

import isAuth from "../middleware/isAuth.js";
import jobModel from "../model/job.model.js";

const App = express();

// Create Job API
App.post("/create", isAuth, async (req, res) => {
    try {
        const {
            title,
            description,
            requirments,
            salary,
            location,
            jobType,
            position,
            companyId,
        } = req.body;
        if (
            !title ||
            !description ||
            !requirments ||
            !salary ||
            !location ||
            !jobType ||
            !position ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false,
            });
        }

        const newJob = await jobModel({
            title,
            description,
            requirments,
            salary,
            location: await location.toUpperCase().trim(),
            jobType: await jobType.toUpperCase().trim(),
            position,
            companyId,
            created_by: req.userId,
        });
        await newJob.save();
        res.status(201).json({
            message: "Job created successfully",
            success: true,
            job: newJob,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Search Job API
App.get("/search", async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        };

        const FindSearch = await jobModel.find(query);
        if (FindSearch.length === 0) {
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Jobs found",
            success: true,
            jobs: FindSearch,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Job posted by Admin API
App.get("/all", isAuth, async (req, res) => {
    try {
        const FindAllAdminJobs = await jobModel
            .find({ created_by: req.userId })
            .sort({ created_by: -1 })
            .populate("companyId");

        if (!FindAllAdminJobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            message: "Jobs found",
            jobs: FindAllAdminJobs,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Job details
App.get("/detail/:id", isAuth, async (req, res) => {
    try {
        const FindJob = await jobModel
            .findOne({ _id: req.params.id })
            .populate("companyId");
        if (FindJob === null) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }
        res.status(200).json({
            message: "Job found",
            success: true,
            job: FindJob,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Update Job API
App.put("/update/:id", isAuth, async (req, res) => {
    try {
        const {
            title,
            description,
            requirments,
            salary,
            location,
            jobType,
            position,
        } = req.body;

        const FindJob = await jobModel.findById(req.params.id);
        if (!FindJob) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        // Check user is correct or not
        if (FindJob.created_by.toString() !== req.userId) {
            return res.status(401).json({
                message: "You are not authorized to update this job",
                success: false,
            });
        }

        // Update here
        const UpdateJob = await jobModel
            .findByIdAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    title,
                    description,
                    requirments,
                    salary,
                    location: await location?.toUpperCase().trim(),
                    jobType: await jobType?.toUpperCase().trim(),
                    position,
                },
                {
                    new: true,
                }
            )
            .populate("companyId");

        res.status(200).json({
            message: "Job updated successfully",
            success: true,
            job: UpdateJob,
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
