# Patient Frontend

A React + TypeScript + Vite application for interacting with the Patient Management API.

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI
- Axios
- React Router DOM
- ESLint (TypeScript + React)

## Setup

```bash
corepack enable           # enables Corepack shims
yarn set version 4.6.0     # downloads Yarn 4 release into .yarn/releases
yarn install               # installs dependencies using PnP
```

```bash
yarn install
yarn dev
```

App runs on: http://localhost:5173 (default)
Backend expected at: `${VITE_API_BASE_URL}` (default http://localhost:8080)

## Environment Variables

- `VITE_API_BASE_URL` – base URL for backend API (e.g. http://localhost:8080)
