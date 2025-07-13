import express from "express";

import applicationModel from "../model/application.model.js";
import jobModel from "../model/job.model.js";
import isAuth from "../middleware/isAuth.js";

const App = express();

// Apply API
App.post("/apply/:id", isAuth, async (req, res) => {
    try {
        const FindJob = await jobModel.findOne({ _id: req.params.id });
        if (!FindJob) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        const alreadyApplied = await applicationModel.findOne({
            jobId: req.params.id,
            applicant: req.userId,
        });

        if (alreadyApplied) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            });
        }

        const newApplication = await applicationModel.create({
            jobId: req.params.id,
            applicant: req.userId,
        });

        // push user Id in job model
        if (!alreadyApplied) {
            await jobModel.findByIdAndUpdate(req.params.id, {
                $push: { applications: req.userId },
            });
        }

        res.status(200).json({
            message: "You have successfully applied for this job",
            success: true,
            application: newApplication,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Get Applied job
App.get("/all", isAuth, async (req, res) => {
    try {
        const FindAppliedJob = await applicationModel
            .find({ applicant: req.userId })
            .populate("jobId")
            .populate("applicant");
        if (!FindAppliedJob) {
            return res.status(404).json({
                message: "No job found",
                success: false,
            });
        }
        res.status(200).json({
            message: "All applied jobs",
            success: true,
            FindAppliedJob,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
});

// Update Application Status
App.put("/status", isAuth, async (req, res) => {
    try {
        const { status } = req.body;

        await applicationModel.updateOne(
            { applicant: req.userId },
            { status },
            { new: true }
        );
        res.status(200).json({
            message: "Application status updated successfully",
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
