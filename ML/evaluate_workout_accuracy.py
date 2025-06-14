import pandas as pd
import torch
import joblib
import numpy as np
from sklearn.metrics import accuracy_score, classification_report
from fitness_model import FitnessModel

# Load encoders and scaler
le_exp = joblib.load("le_exp.pkl")
le_workout = joblib.load("le_workout.pkl")
scaler = joblib.load("scaler.pkl")

# Load trained model
model = FitnessModel(input_size=6)
model.load_state_dict(torch.load("fitness_model.pth"))
model.eval()

# Load dataset
df = pd.read_csv("fitness_data.csv")  # replace with your file name

# Encode Experience_Level to match training
df['experience_encoded'] = le_exp.transform(df['Experience_Level'])

# Select the same features as used during training
X = df[['Age', 'Height(cm)', 'Weight(kg)', 'Resting_BPM', 'Workout_Frequency(days/week)', 'experience_encoded']]
y_true = le_workout.transform(df['Workout_Type'])

# Scale the input features
X_scaled = scaler.transform(X)
X_tensor = torch.tensor(X_scaled, dtype=torch.float32)

# Make predictions
with torch.no_grad():
    _, cls_output = model(X_tensor)
    workout_preds = torch.argmax(cls_output[:, :2], dim=1).numpy()

# Calculate and print accuracy
accuracy = accuracy_score(y_true, workout_preds)
print(f"\n🏋️ Workout Type Accuracy: {accuracy * 100:.2f}%")

# Classification report
print("\n📊 Classification Report:")
print(classification_report(y_true, workout_preds, target_names=le_workout.classes_))
