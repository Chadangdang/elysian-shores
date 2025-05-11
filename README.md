# Elysian Shores — Hotel Booking App

**Course:** DES422 Business Application Development (2024/2)
**Group:** 13
**Members:**

* 6522770591 Chadang Phummarin
* 6522770864 Punyawee Poungsri

---

## Project Description

Elysian Shores is a full‑stack hotel booking application developed as the term project for DES422. It demonstrates key concepts of modern web development:

* **Front‑end**: React with TypeScript, responsive design, event‑driven UI
* **Back‑end**: FastAPI (Python) providing a RESTful API
* **Database**: SQLite seeded with mock data for June–July 2025
* **Authentication**: Signup/Login pages with token‑based auth
* **Integration**: React SPA served as static files by FastAPI
* **Deployment**: Single‑service cloud deployment with persistent storage

### Course Objectives

This project meets the learning outcomes of DES422, including:

* HTML, CSS, and JavaScript fundamentals
* React framework and component architecture
* REST API design and server‑side programming (FastAPI)
* Data modeling, persistence, and query logic with SQLAlchemy
* Program testing, debugging, and error handling
* Cloud deployment and environment configuration

---

## Requirements & Features

1. **Mock Data**

   * Room availability for June–July 2025: 20 Classic Rooms, 10 Deluxe Suites, 5 Executive Suites.
2. **Authentication**

   * Signup and Login pages; token scheme `fake-token-for-<username>`.
3. **Room Search & Filter**

   * Filter by check‑in/check‑out dates and guest count; shows remaining availability.
4. **Booking Workflow**

   * Add to cart, review nights and pricing, confirm booking via API, decrement availability.
5. **My Bookings**

   * List user bookings; cancel to restore availability per night.
6. **Single‑Service Deployment**

   * FastAPI serves both API endpoints and the compiled React app under one domain.
7. **Persistent Storage**

   * SQLite database file persists across service restarts via mounted volume.
8. **No Payment Integration**

   * Focus on booking pipeline without payment processing.

---

## Technology Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Front‑end      | React · TypeScript · CSS               |
| Back‑end       | FastAPI · Python · Uvicorn             |
| ORM / Database | SQLAlchemy · SQLite                    |
| Deployment     | Cloud Web Service with Persistent Disk |
| Version Ctrl.  | Git · GitHub                           |

---

## Local Setup & Development

### Backend

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

* API available at `http://localhost:8001`.

### Frontend

```bash
cd client
npm install
npm start
```

* React app at `http://localhost:3000`.

Use the UI to sign up, search for rooms, book, view and cancel bookings.

---

## Deployment

This project is deployed as a single web service that serves both API and static content:

1. **Cloud Service**: Render.com (or your chosen provider)
2. **Root**: `api/` directory
3. **Build**: `pip install -r api/requirements.txt`
4. **Start**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Static Files**: React `build/` copied to `api/app/static/`, mounted via `StaticFiles`
6. **Persistent Disk**: Mount `prisma/dev.db` so SQLite persists
7. **Env Vars**: `DATABASE_URL=sqlite:///prisma/dev.db`

After deployment, visit:
`https://<your-service>.onrender.com/`
Your React UI and API endpoints (e.g. `/rooms/filter`, `/bookings/confirm`) share this domain.

---

## Deliverables

1. UI Mockups (Figma or similar)
2. Source code on GitHub (this repo)
3. Live demo URL (HTTPS)
4. Video walkthrough of all features

---

## Plagiarism Policy

All data, designs, and code are unique to Group 13. Per course policy, no content has been copied from other groups.

---

**Elysian Shores** — Term Project for DES422, 3rd‑Year Digital Engineering © 2025
