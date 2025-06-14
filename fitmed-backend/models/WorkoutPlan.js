import mongoose from "mongoose";

const WorkoutPlanSchema = new mongoose.Schema({
    goal: { type: String, required: true, trim: true }, // e.g., "Weight Loss", "Muscle Gain"
    level: { type: String, required: true, trim: true }, // e.g., "Beginner", "Advanced"
    exercises: [
        {
            name: { type: String, required: true, trim: true }, // e.g., "Push-ups"
            sets: { type: Number, required: true, min: 1 }, 
            reps: { type: String, required: true, trim: true }, // e.g., "10-15 reps"
        },
    ],
}, { timestamps: true });

export default mongoose.model("WorkoutPlan", WorkoutPlanSchema);
