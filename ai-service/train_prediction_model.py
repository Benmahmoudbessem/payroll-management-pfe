import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression

def main():
    df = pd.read_csv("salary_mass_data.csv")
    df["time_index"] = range(1, len(df) + 1)
    X = df[["time_index"]]
    y = df["total_salary_mass"]
    model = LinearRegression()
    model.fit(X, y)
    joblib.dump(model, "prediction_model.pkl")
    print("Modèle de prédiction entraîné et sauvegardé dans prediction_model.pkl")

if __name__ == "__main__":
    main()
