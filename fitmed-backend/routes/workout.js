import { Router } from "express";
import WorkoutPlan from "../models/WorkoutPlan.js";

const router = Router();

// 📌 Get Workout Plan by Goal & Level
router.get("/", async (req, res) => {
    try {
        const { goal, level } = req.query;
        if (!goal || !level) return res.status(400).json({ msg: "❌ Goal & Level required!" });

        const plan = await WorkoutPlan.findOne({ goal: goal.trim(), level: level.trim() });
        if (!plan) return res.status(404).json({ msg: "❌ No workout plan found!" });

        res.json({ msg: "✅ Workout Plan Found!", plan });
    } catch (error) {
        console.error("🔥 Error fetching workout plan:", error);
        res.status(500).json({ msg: "❌ Server error!" });
    }
});

// 📌 Add a New Workout Plan
router.post("/", async (req, res) => {
    try {
        const { goal, level, exercises } = req.body;
        if (!goal || !level || !exercises || exercises.length === 0) return res.status(400).json({ msg: "❌ Goal, Level & Exercises are required!" });

        const newPlan = new WorkoutPlan({ goal: goal.trim(), level: level.trim(), exercises });
        await newPlan.save();

        res.status(201).json({ msg: "✅ Workout Plan Added!", plan: newPlan });
    } catch (error) {
        console.error("🔥 Error adding workout plan:", error);
        res.status(500).json({ msg: "❌ Server error!" });
    }
});

export default router;
