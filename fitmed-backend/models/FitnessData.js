import mongoose from 'mongoose';

const fitnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: String,
  age: Number,
  height: Number,
  heightUnit: String,
  weight: Number,
  weightUnit: String,
  bpm: Number,
  frequency: String,
  experience: String,
  bmi: Number,
  createdAt: { type: Date, default: Date.now }
});

const FitnessData = mongoose.model('FitnessData', fitnessSchema);

export default FitnessData;
