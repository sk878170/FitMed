from fastapi import FastAPI
from pydantic import BaseModel
import torch
import joblib
import numpy as np
from fitness_model import FitnessModel  # Ensure this matches your saved model architecture

# Load label encoders and scaler
le_exp = joblib.load("le_exp.pkl")
le_workout = joblib.load("le_workout.pkl")
scaler = joblib.load("scaler.pkl")

# Initialize model
input_size = 6  # age, height, weight, resting_bpm, workout_frequency, experience_level
model = FitnessModel(input_size=input_size)
model.load_state_dict(torch.load("fitness_model.pth"))
model.eval()

# FastAPI app
app = FastAPI()

# Request schema
class FitnessInput(BaseModel):
    sex: str
    age: int
    height: float
    weight: float
    resting_bpm: int
    workout_frequency: int
    experience_level: str

# Response schema
class FitnessPrediction(BaseModel):
    Session_Duration: float
    Fat_Percentage: float
    Workout_Type: str
    BMI_Class: str

@app.post("/predict", response_model=FitnessPrediction)
def predict(input_data: FitnessInput):
    print("✅ Received input:", input_data)

    # Encode experience level
    experience_encoded = le_exp.transform([input_data.experience_level])[0]

    # Prepare feature array (excluding 'sex' from model input for now)
    features = np.array([
        input_data.age,
        input_data.height,
        input_data.weight,
        input_data.resting_bpm,
        input_data.workout_frequency,
        experience_encoded
    ]).reshape(1, -1)

    # Scale features
    features_scaled = scaler.transform(features)
    features_tensor = torch.tensor(features_scaled, dtype=torch.float32)

    # Make prediction
    with torch.no_grad():
        reg_output, cls_output = model(features_tensor)

    # Extract regression outputs
    session_duration = float(reg_output[0][0])
    fat_percentage = float(reg_output[0][1])

    # Extract classification outputs
    workout_type_idx = torch.argmax(cls_output[0][:2]).item()
    bmi_class_idx = torch.argmax(cls_output[0][2:]).item()

    workout_type = le_workout.inverse_transform([workout_type_idx])[0]
    bmi_class = "Underweight/Normal" if bmi_class_idx == 0 else "Overweight/Obese"

    return FitnessPrediction(
        Session_Duration=round(session_duration, 2),
        Fat_Percentage=round(fat_percentage, 2),
        Workout_Type=workout_type,
        BMI_Class=bmi_class
    )
