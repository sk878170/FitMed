import torch
import torch.nn as nn
import joblib
import numpy as np

# Define the model architecture that matches the saved fitness_model.pth
class FitnessModel(nn.Module):
    def __init__(self, input_size):
        super(FitnessModel, self).__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )
        self.reg_head = nn.Linear(32, 2)  # session duration, fat percentage
        self.cls_head = nn.Linear(32, 4)  # 2 for workout type, 2 for BMI

    def forward(self, x):
        x = self.shared(x)
        reg_out = self.reg_head(x)
        cls_out = self.cls_head(x)
        return reg_out, cls_out

# Load encoders and scaler
le_exp = joblib.load("le_exp.pkl")
le_workout = joblib.load("le_workout.pkl")
scaler = joblib.load("scaler.pkl")

# Initialize and load the trained model
model = FitnessModel(input_size=6)  # 6 numerical features (excluding 'Sex')
model.load_state_dict(torch.load("fitness_model.pth"))
model.eval()

# Define prediction function
def predict_fitness(input_data: dict):
    sex = input_data["Sex"]  # Not used in model; passed through to response
    age = input_data["Age"]
    height = input_data["Height"]
    weight = input_data["Weight"]
    bpm = input_data["Resting_BPM"]
    freq = input_data["Workout_Frequency"]
    exp = le_exp.transform([input_data["Experience_Level"]])[0]

    # Scale input features (excluding 'Sex')
    input_array = scaler.transform([[age, height, weight, bpm, freq, exp]])
    input_tensor = torch.tensor(input_array, dtype=torch.float32)

    with torch.no_grad():
        reg_out, cls_out = model(input_tensor)

    # Regression outputs
    session_duration = round(reg_out[0][0].item(), 2)
    fat_percentage = round(reg_out[0][1].item(), 2)

    # Classification outputs (split cls_head into two parts)
    workout_logits = cls_out[0][:2]
    bmi_logits = cls_out[0][2:]

    workout_idx = torch.argmax(workout_logits).item()
    bmi_pred = torch.argmax(bmi_logits).item()

    workout_type = le_workout.inverse_transform([workout_idx])[0]

    return {
        "Sex": sex,
        "Session_Duration(min)": session_duration,
        "Workout_Type": workout_type,
        "Fat_Percentage(%)": fat_percentage,
        "BMI": bmi_pred
    }
