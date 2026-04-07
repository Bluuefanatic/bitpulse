# BitPulse

## Project overview
BitPulse is a React + TypeScript dashboard that tracks Bitcoin price data in real time using CoinGecko.
It includes mock authentication, protected routes, responsive charting, and a clean light/dark UI.

## Features
- Mock login/logout flow with persisted auth state
- Protected dashboard route
- Live Bitcoin price polling (60-second interval)
- Price history caching (last 50 points)
- Recharts-based responsive line chart
- Loading and error states with retry UI
- Light/dark mode with persisted preference
- Route-level code splitting for improved bundle performance

## Tech stack
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Zustand
- Recharts

## Setup instructions
### Prerequisites
- Node.js 20+
- npm 10+

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Architecture
The project follows a feature-oriented structure with shared app and UI layers:

```text
src/
  app/              # Router and top-level providers
  components/
    common/         # Shared non-domain components (theme toggle, etc.)
    ui/             # Reusable presentation components
  features/
    btc/
      hooks/        # Bitcoin data hooks
      services/     # CoinGecko API layer
      types/        # Feature types
  pages/            # Route pages (Login, Dashboard)
  routes/           # Route guards (ProtectedRoute)
  store/            # Global Zustand stores (auth)
  utils/            # Utility hooks/helpers
```

Data flow (dashboard):
- `api` service fetches BTC data from CoinGecko
- `useBitcoinData` handles polling, history, loading, and errors
- Dashboard page composes reusable UI cards and chart

## Screenshots
Place screenshots in this section once available.

- Login page screenshot: `[placeholder]`
- Dashboard page screenshot: `[placeholder]`
- Dark mode dashboard screenshot: `[placeholder]`
