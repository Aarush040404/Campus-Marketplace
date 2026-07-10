# Campus Marketplace

A student-to-student marketplace for buying and selling books, electronics, hostel essentials, notes, cycles, and other campus resources.

## Overview

Campus Marketplace gives students a dedicated place to post products, browse available listings, and contact sellers directly instead of relying on scattered WhatsApp groups or social media posts.

## Current Project Shape

```text
Campus-Marketplace/
|-- client/   # React + Vite frontend
|-- server/   # Express backend
|-- README.md
|-- package.json
```

The `client` and `server` folders are separate Node packages with their own `package.json` and `package-lock.json` files. The root `package.json` is only a command hub for common scripts.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Lucide React
- Backend: Node.js, Express
- Database: MongoDB with Mongoose

## Setup

Install dependencies separately:

```bash
npm --prefix client install
npm --prefix server install
```

Run the frontend:

```bash
npm run client
```

Run the backend:

```bash
npm run server
```

Copy `server/.env.example` to `server/.env` and paste your Atlas connection
string into `MONGODB_URI`. That is the only required environment value. The API
adds the `campusmarket` database name when needed and derives a stable signing
secret automatically; `JWT_SECRET` remains available as an optional override.

Useful checks:

```bash
npm run lint
npm run build
```

## Features

- Search, filter, sort, and browse marketplace listings
- Listing detail pages with direct WhatsApp seller contact
- JWT-based registration, login, and protected routes
- Create and edit listings with image uploads
- Seller dashboard with status management and analytics
- MongoDB persistence for accounts and marketplace listings

## Backend Structure

```text
server/src/
|-- config/       # environment and database setup
|-- controllers/  # HTTP request/response handling
|-- data/         # demo seed data
|-- middleware/   # authentication, uploads, and errors
|-- models/       # Mongoose schemas and indexes
|-- routes/       # API route definitions
|-- services/     # business logic and persistence abstraction
|-- store/        # zero-config development store
|-- utils/        # shared errors, tokens, and serializers
```

## Developed By

Aarush Gambhir and Avika Yadav  
B.Tech CSE (Artificial Intelligence)  
Swami Keshvanand Institute of Technology, Jaipur
