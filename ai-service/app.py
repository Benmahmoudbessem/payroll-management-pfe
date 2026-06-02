from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="AI Service - Payroll Management")

anomaly_model = None
prediction_model = None

def load_models():
    global anomaly_model, prediction_model
    anomaly_path = BASE_DIR / "anomaly_model.pkl"
    prediction_path = BASE_DIR / "prediction_model.pkl"
    if anomaly_path.exists():
        anomaly_model = joblib.load(anomaly_path)
    if prediction_path.exists():
        prediction_model = joblib.load(prediction_path)

load_models()

class PayrollAiInput(BaseModel):
    payrollId: str
    employeeId: str
    baseSalary: float
    bonus: float
    allowance: float
    overtimeAmount: float
    deductions: float
    contributions: float
    grossSalary: float
    netSalary: float
    month: int
    year: int

@app.get("/")
def root():
    return {"message": "AI service is running"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "anomaly_model_loaded": anomaly_model is not None,
        "prediction_model_loaded": prediction_model is not None
    }

@app.post("/predict-anomaly")
def predict_anomaly(data: PayrollAiInput):
    if anomaly_model is None:
        return {
            "isAnomaly": False,
            "score": 0.0,
            "type": "ModelNotLoaded",
            "description": "Le modèle d'anomalie n'est pas encore entraîné."
        }
    features = np.array([[data.baseSalary, data.bonus, data.allowance, data.overtimeAmount, data.deductions, data.contributions, data.grossSalary, data.netSalary]])
    prediction = anomaly_model.predict(features)[0]
    score = anomaly_model.decision_function(features)[0]
    is_anomaly = prediction == -1
    if is_anomaly:
        return {
            "isAnomaly": True,
            "score": round(float(abs(score)), 4),
            "type": "Paie inhabituelle",
            "description": "Une anomalie potentielle a été détectée dans cette paie."
        }
    return {
        "isAnomaly": False,
        "score": round(float(abs(score)), 4),
        "type": "Normal",
        "description": "Aucune anomalie détectée."
    }

@app.get("/predict-salary-mass")
def predict_salary_mass(month: int, year: int):
    if prediction_model is None:
        return {
            "month": month,
            "year": year,
            "predictedSalaryMass": 0,
            "evolutionRate": 0,
            "notes": "Le modèle de prédiction n'est pas encore entraîné."
        }
    time_index = (year - 2025) * 12 + month
    predicted_value = prediction_model.predict([[time_index]])[0]
    previous_value = prediction_model.predict([[max(time_index - 1, 1)]])[0]
    evolution_rate = ((predicted_value - previous_value) / previous_value) * 100 if previous_value != 0 else 0
    return {
        "month": month,
        "year": year,
        "predictedSalaryMass": round(float(predicted_value), 2),
        "evolutionRate": round(float(evolution_rate), 2),
        "notes": "Prédiction générée par le modèle de régression linéaire."
    }
