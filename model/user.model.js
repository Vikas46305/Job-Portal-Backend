import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profile: {
            bio: { type: String },
            skills: [{ type: String }],
            resume: { type: String },
            resumeName: { type: String },
            company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
            profilePhoto: {
                type: String,
                default: "",
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
