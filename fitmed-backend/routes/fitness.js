import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import FitnessData from '../models/FitnessData.js';

const router = Router();

function feetToCm(feet) {
  return feet * 30.48;
}

function poundsToKg(pounds) {
  return pounds * 0.45359237;
}

function calculateBMI(weightKg, heightMeters) {
  if (weightKg <= 0 || heightMeters <= 0) return null;
  return +(weightKg / (heightMeters * heightMeters)).toFixed(2);
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      gender,
      age,
      height,
      heightUnit,
      weight,
      weightUnit,
      bpm,
      frequency,
      experience,
    } = req.body;

    if (
      !gender ||
      !age ||
      !height ||
      !heightUnit ||
      !weight ||
      !weightUnit ||
      !bpm ||
      !frequency ||
      !experience
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let heightInCm =
      heightUnit === 'feet' ? feetToCm(parseFloat(height)) : parseFloat(height);
    let heightInMeters = heightInCm / 100;

    let weightInKg =
      weightUnit === 'lbs' ? poundsToKg(parseFloat(weight)) : parseFloat(weight);

    const bmi = calculateBMI(weightInKg, heightInMeters);

    if (bmi === null) {
      return res.status(400).json({ error: 'Invalid height or weight for BMI.' });
    }

    const fitnessData = new FitnessData({
      userId: req.user.id,
      gender,
      age,
      height: heightInCm,
      heightUnit: 'cm',
      weight: weightInKg,
      weightUnit: 'kg',
      bpm,
      frequency,
      experience,
      bmi,
    });

    await fitnessData.save();

    res.status(201).json({ message: '✅ Fitness data saved successfully!', bmi });
  } catch (error) {
    console.error('❌ Fitness route error:', error);
    res.status(500).json({ error: '❌ Server error processing fitness data' });
  }
});

export default router;
