import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Load your dataset
df = pd.read_csv("fitness_data.csv")  # Replace with your actual file name

# --- 1. Label Encoding for 'Experience_Level'
le_exp = LabelEncoder()
df['experience_encoded'] = le_exp.fit_transform(df['Experience_Level'])
joblib.dump(le_exp, 'le_exp.pkl')
print("✅ Saved LabelEncoder for 'Experience_Level' as le_exp.pkl")

# --- 2. Label Encoding for 'Workout_Type'
le_workout = LabelEncoder()
df['workout_encoded'] = le_workout.fit_transform(df['Workout_Type'])
joblib.dump(le_workout, 'le_workout.pkl')
print("✅ Saved LabelEncoder for 'Workout_Type' as le_workout.pkl")

# --- 3. StandardScaler for input features (excluding 'Sex')
input_features = [
    'Age',
    'Height(cm)',
    'Weight(kg)',
    'Resting_BPM',
    'Workout_Frequency(days/week)',
    'experience_encoded'
]

scaler = StandardScaler()
df_scaled = scaler.fit_transform(df[input_features])
joblib.dump(scaler, 'scaler.pkl')
print("✅ Saved StandardScaler as scaler.pkl")
