# ai-service

Microservice Python pour la partie IA du projet de gestion de la paie.

## Contenu
- Détection d'anomalies avec `IsolationForest`
- Prédiction de masse salariale avec `LinearRegression`
- API FastAPI prête à être appelée depuis .NET

## Étapes d'installation

### 1. Créer et activer l'environnement virtuel
Sous Windows :

```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 3. Entraîner les modèles
```bash
python train_anomaly_model.py
python train_prediction_model.py
```

Après ça, tu auras :
- `anomaly_model.pkl`
- `prediction_model.pkl`

### 4. Lancer l'API
```bash
uvicorn app:app --reload
```

### 5. Tester
Ouvre :
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

## Endpoints

### POST /predict-anomaly
Envoie une paie et récupère si elle est anormale.

### GET /predict-salary-mass?month=5&year=2026
Retourne une prédiction de masse salariale.

## Exemple JSON pour /predict-anomaly

```json
{
  "payrollId": "00000000-0000-0000-0000-000000000001",
  "employeeId": "00000000-0000-0000-0000-000000000002",
  "baseSalary": 1200,
  "bonus": 100,
  "allowance": 50,
  "overtimeAmount": 20,
  "deductions": 30,
  "contributions": 60,
  "grossSalary": 1370,
  "netSalary": 1310,
  "month": 4,
  "year": 2026
}
```

## Intégration avec .NET
Dans `Program.cs` :

```csharp
builder.Services.AddHttpClient<IAiService, AiService>(client =>
{
    client.BaseAddress = new Uri("http://127.0.0.1:8000/");
});
```
