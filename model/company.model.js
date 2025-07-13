import mongoose from "mongoose";

const CompanySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        website: {
            type: String,
        },
        logo: {
            type: String,
        },
        location: {
            type: String,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);