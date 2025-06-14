import mongoose from "mongoose";

const DietPlanSchema = new mongoose.Schema({
    goal: { type: String, required: true, trim: true }, // e.g., "Weight Loss", "Muscle Gain"
    meals: [
        {
            mealType: { type: String, required: true, trim: true }, // e.g., "Breakfast", "Lunch"
            items: [{ type: String, required: true }], // e.g., ["Oatmeal", "Fruits"]
        },
    ],
}, { timestamps: true });

export default mongoose.model("DietPlan", DietPlanSchema);
