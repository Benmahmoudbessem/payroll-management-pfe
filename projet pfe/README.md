# PayrollManagementBackend

Backend ASP.NET Core Web API pour un projet PFE de gestion de la paie avec détection d'anomalies et prédiction simple de masse salariale.

## Fonctionnalités incluses
- Authentification JWT
- Gestion des rôles: Admin, RH, Employee
- Gestion des employés
- Gestion des départements
- Gestion des contrats
- Gestion des demandes de congé et validation
- Génération de la paie
- Détection simple des anomalies
- Notifications
- Prédiction simple de la masse salariale
- Swagger

## Technologies
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- Identity
- JWT

## Lancer le projet

### 1. Restaurer les packages
```bash
dotnet restore
```

### 2. Vérifier la chaîne de connexion dans `appsettings.json`

### 3. Créer la base de données
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Lancer l'application
```bash
dotnet run
```

## Compte admin initial
- Email: `admin@payroll.com`
- Mot de passe: `Admin123!`

## Endpoints principaux
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/employees`
- `POST /api/employees`
- `GET /api/departments`
- `POST /api/contracts`
- `GET /api/leaverequests`
- `POST /api/leaverequests`
- `PUT /api/leaverequests/{id}/approve`
- `POST /api/payrolls`
- `GET /api/payrolls`
- `GET /api/payrolls/prediction?month=6&year=2026`

## Remarques
- La génération PDF réelle de la fiche de paie n'est pas implémentée ici; le backend stocke le chemin du fichier PDF.
- Le module de prédiction est volontairement simple pour un PFE. Tu peux le remplacer plus tard par ML.NET ou Python.
- Le projet est prêt à être relié à un frontend Angular.
