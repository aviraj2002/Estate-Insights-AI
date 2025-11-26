🏡 Estate-Insights-AI

AI-powered real-estate analytics platform built using Django REST Framework (Backend) and React.js (Frontend).
Users can upload Excel datasets, analyze locality trends, view price growth, and compare regions with clean visual insights.

🚀 Live Demo
🔹 Frontend: https://estate-insights-ai-1.onrender.com
🔹 Backend API: https://estate-insights-ai.onrender.com/api/
📌 Features
✅ Excel Upload & Processing

Upload .xlsx datasets containing price/location information.

✅ Location List (Areas API)

Fetches all available areas extracted from the dataset.

✅ AI-Based Analysis

Compares two locations and returns insights like:

Average price difference

Trends

Variance

Demand ratios

✅ Price Growth Predictor

Returns estimated price growth for any selected location (default: last 3 years).

✅ Modern UI

Built with React + Tailwind + Axios for fast, responsive interactions.

✅ Deployed on Render

Backend → Django + Gunicorn

Frontend → React Static Site

CORS Enabled

Production ready

🗂️ Project Structure
Estate-Insights-AI/
│
├── backend/
│   ├── api/
│   ├── backend/
│   ├── media/
│   ├── datasets/
│   ├── manage.py
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│
└── reference/ (optional resources)

⚙️ Tech Stack
🖥 Backend

Django

Django REST Framework

Pandas

OpenPyXL

Gunicorn

CORS Headers

🌐 Frontend

React.js

Axios

Bootstrap / Tailwind (your choice)

☁ Deployment

Render Web Service (Backend)

Render Static Site (Frontend)
