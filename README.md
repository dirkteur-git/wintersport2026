# Wintersport 2026

Een website voor het plannen van de wintersport 2026 met Guus, Rene, Harm en Dirk.

## Functies

- **Datumplanner**: Deelnemers kunnen aangeven wanneer ze niet beschikbaar zijn
- **Skigebieden**: Overzicht van de beste wintersportbestemmingen in de Alpen
- **Vliegvelden**: Informatie over vliegvelden en transfers naar skigebieden

## Tech Stack

- **Framework**: Vue 3 + Vite
- **Routing**: Vue Router
- **Hosting**: Vercel
- **Data opslag**: LocalStorage (voor nu)

## Development

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## Deployment naar Vercel

1. Push de code naar een Git repository (GitHub, GitLab, of Bitbucket)
2. Ga naar [Vercel](https://vercel.com) en log in
3. Klik op "Add New Project"
4. Importeer je Git repository
5. Vercel detecteert automatisch Vite
6. Klik op "Deploy"

### Vercel CLI (optioneel)

```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy naar productie
vercel --prod
```

## Data opslag

Momenteel gebruikt de datumplanner **localStorage** om de beschikbaarheid op te slaan. Dit werkt alleen lokaal in de browser van de gebruiker.

Voor een gedeelde opslag over meerdere gebruikers, overweeg:
- **Vercel KV** (Redis-based key-value store)
- **Vercel Postgres** (PostgreSQL database)
- **Firebase Firestore**
- **Supabase**

## Toekomstige verbeteringen

- Backend API voor gedeelde data opslag
- Authenticatie voor deelnemers
- Email notificaties
- Exporteren van planning naar kalendar
- Weerbericht integratie
- Prijsvergelijking vluchten
