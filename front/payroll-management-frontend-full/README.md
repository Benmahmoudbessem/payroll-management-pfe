# Frontend Angular complet aligné sur le backend ZIP

Ce frontend est construit pour correspondre au backend .NET généré pour la plateforme intelligente de gestion de la paie avec analyse prédictive.

## Pages incluses
- Connexion
- Dashboard
- Départements
- Employés
- Contrats
- Demandes de congé
- Paies
- Prédictions
- Notifications
- Création de comptes + profil connecté

## Étapes
1. Extraire le ZIP
2. Ouvrir le dossier dans VS Code
3. Vérifier l'URL du backend dans :
   `src/app/core/config/api.config.ts`
4. Installer les dépendances :
   ```bash
   npm install
   ```
5. Lancer Angular :
   ```bash
   npm start
   ```
6. Ouvrir :
   `http://localhost:4200`

## Backend attendu
Le frontend est aligné sur ces routes :
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- GET /api/departments
- POST /api/departments
- GET /api/employees
- GET /api/employees/{id}
- POST /api/employees
- GET /api/contracts
- POST /api/contracts
- GET /api/leaverequests
- POST /api/leaverequests
- GET /api/payrolls
- POST /api/payrolls
- GET /api/predictions
- GET /api/notifications

## Important
Ton backend actuel retourne encore plusieurs entités EF complètes avec navigations.
Cela peut provoquer des erreurs 500 liées aux boucles JSON.
Le frontend est prêt, mais pour qu'il fonctionne parfaitement, il faut idéalement corriger le backend avec :
- DTOs de réponse
- ou projection Select(...)
- ou ReferenceHandler.IgnoreCycles
