# CineVerse

Application de réservation de cinéma (Spring Boot + React).

## Structure

- `cineverse-backend/` — API REST (port 8081), MySQL, JWT
- `cineverse-frontend/` — Interface React (Vite, port 5173)

## Prérequis

- Java 17+
- Node.js 18+
- MySQL (base `cineverse_db`, user `root` / `root`)

## Démarrage

### Backend

```bash
cd cineverse-backend
# Lancer CineVerseApplication depuis l'IDE
# ou: mvn spring-boot:run
```

### Frontend

```bash
cd cineverse-frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173

## Fonctionnalités

- Inscription / connexion (JWT)
- Catalogue de films avec affiches TMDB
- 7 cinémas en Tunisie (Pathé, Azur City, etc.)
- Réservation de sièges par séance
- Historique « Mes réservations » avec nom du cinéma
