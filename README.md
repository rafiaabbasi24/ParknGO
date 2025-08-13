# ParkNGo: A Full-Stack Urban Parking & Reservation Platform

**Live Demo:** [https://park-n-go-eosin.vercel.app/](https://park-n-go-eosin.vercel.app/)

ParkNGo is a comprehensive MERN-stack application designed to modernize and simplify urban parking. It provides a seamless interface for users to find, book, and pay for parking spots in real-time, while offering a powerful dashboard for administrators to manage locations, bookings, and users.

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Installation Guide](#️-installation-guide)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🚀 Key Features

### For Users:
- **Secure Authentication:** Robust user registration and login system using JWT and Google OAuth.
- **Interactive Location Map:** Browse available parking locations with details on pricing and slot availability.
- **Seamless Booking:** A simple, multi-step form to book a parking spot for a specific vehicle and time.
- **Secure Payments:** End-to-end payment processing integrated with the PayU payment gateway (in Test Mode).
- **Booking Management:** View past and upcoming bookings in a personal dashboard.
- **User Profile Management:** Update personal details and change passwords securely.

### For Admins:
- **Separate Admin Login:** Secure and distinct authentication for administrators.
- **Comprehensive Dashboard:** An overview of total bookings, revenue, user registrations, and parking lot occupancy.
- **Parking Lot Management:** Easily add, update, and manage parking locations, including total slots and pricing.
- **User Management:** View and manage the list of all registered users.
- **Booking Reports:** Generate and view detailed reports of all bookings across the platform.

---

## ⚙️ Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion |
| **Backend** | Node.js, Express.js                           |
| **Database** | MySQL (managed with Prisma ORM)               |
| **Payments** | PayU (Test Mode Integration)                  |
| **Auth** | JWT (JSON Web Tokens), Google OAuth, bcrypt   |
| **Deployment**| **Frontend:** Vercel, **Backend:** Render, **Database:** Aiven |

---

## 🛠️ Installation Guide

### Clone the Repo

### 1️⃣ Backend Setup

Bash

    cd backend
    npm install

Create a `.env` file in the `backend` directory and add the required environment variables (see below).

Run the database migration to create your tables:

Bash

    npx prisma db push

Run the server:

Bash

    npm run dev

* * *

### 2️⃣ Frontend Setup

Bash

    cd frontend
    npm install

Create a `.env` file in the `frontend` directory and add your backend URL: `VITE_BACKEND_URL=http://localhost:3000`

Run the client:

Bash

    npm run dev

* * *

## 🧾 Environment Variables

Your backend `.env` file must contain the following keys:

Code snippet

    DATABASE_URL="your_mysql_connection_string_from_aiven"
    JWT_SECRET="your_jwt_secret"
    JWT_PAYMENT_SECRET="your_jwt_payment_secret"
    PAYU_KEY="your_payu_test_key"
    PAYU_SALT="your_payu_test_salt"
    GOOGLE_CLIENT_ID="your_google_client_id"
    FRONTEND_URL="http://localhost:5173"
    BACKEND_URL="http://localhost:3000"

* * *

## 🌱 Database Seeding

To populate your database with sample data (admins, users, locations, etc.), run the seed script from the `backend` directory:

Bash

    npm run seed

* * *

## 📁 Project Structure
```bash
parkngo/
    ├── backend/
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── seed.js
    │   ├── routes/
    │   ├── controllers/
    │   └── index.js
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   └── App.tsx
    └── README.md
```
* * *

## 📄 License

This project is licensed under the MIT License.
