import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Joi schema for profile update
const updateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().positive().min(10).max(100).required(),
  height: Joi.number().positive().required(),
  weight: Joi.number().positive().required(),
  password: Joi.string().min(6),
});

// Get logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ msg: '❌ User not found' });
    res.json({ msg: '✅ User retrieved successfully!', user });
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ msg: '❌ Server error!' });
  }
});

// Update user profile
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: `❌ ${error.details[0].message}` });

    const { password, ...updates } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ msg: '❌ User not found' });

    res.json({ msg: '✅ Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ msg: '❌ Server error!' });
  }
});

// Delete user account
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.json({ msg: '✅ Account deleted successfully!' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ msg: '❌ Server error!' });
  }
});

// NEW: POST /api/users/fitness
router.post('/fitness', async (req, res) => {
  try {
    const fitnessData = req.body;
    console.log('📥 Received fitness form:', fitnessData);

    // Basic validation example
    if (!fitnessData.age || !fitnessData.height || !fitnessData.weight) {
      return res.status(400).json({ error: 'Missing required fitness fields' });
    }

    // TODO: Save fitnessData to DB if needed

    res.json({ message: '✅ Fitness data received!' });
  } catch (error) {
    console.error('❌ Error in /fitness:', error);
    res.status(500).json({ error: 'Server error processing fitness data' });
  }
});

export default router;
