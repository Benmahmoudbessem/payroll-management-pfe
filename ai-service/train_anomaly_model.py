import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest

def main():
    df = pd.read_csv("sample_payroll_data.csv")
    features = [
        "base_salary",
        "bonus",
        "allowance",
        "overtime_amount",
        "deductions",
        "contributions",
        "gross_salary",
        "net_salary"
    ]
    X = df[features]
    model = IsolationForest(n_estimators=200, contamination=0.3, random_state=42)
    model.fit(X)
    joblib.dump(model, "anomaly_model.pkl")
    print("Modèle d'anomalie entraîné et sauvegardé dans anomaly_model.pkl")

if __name__ == "__main__":
    main()
