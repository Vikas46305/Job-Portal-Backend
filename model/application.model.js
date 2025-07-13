import mongoose from "mongoose";

const ApplicationSchema = mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "reject"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
