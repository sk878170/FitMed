import { Router } from "express";
import DietPlan from "../models/DietPlan.js";

const router = Router();

// 📌 Get Diet Plan by Goal
router.get("/", async (req, res) => {
    try {
        const { goal } = req.query;
        if (!goal) return res.status(400).json({ msg: "❌ Goal is required!" });

        const plan = await DietPlan.findOne({ goal: goal.trim() });
        if (!plan) return res.status(404).json({ msg: "❌ No diet plan found!" });

        res.json({ msg: "✅ Diet Plan Found!", plan });
    } catch (error) {
        console.error("🔥 Error fetching diet plan:", error);
        res.status(500).json({ msg: "❌ Server error!" });
    }
});

// 📌 Add a New Diet Plan
router.post("/", async (req, res) => {
    try {
        const { goal, meals } = req.body;
        if (!goal || !meals || meals.length === 0) return res.status(400).json({ msg: "❌ Goal and Meals are required!" });

        const newPlan = new DietPlan({ goal: goal.trim(), meals });
        await newPlan.save();

        res.status(201).json({ msg: "✅ Diet Plan Added!", plan: newPlan });
    } catch (error) {
        console.error("🔥 Error adding diet plan:", error);
        res.status(500).json({ msg: "❌ Server error!" });
    }
});

export default router;
