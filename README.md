# N12398063_IFN636_1.2

# Community Garden Manager (IFN636 Assessment 1.2)

This project is a full-stack web application developed for managing community garden plots. It allows users to register, log in, and book plots, while administrators can manage plots and users.

---

## Features

- User Authentication (Register and Login)
- Role-based Access Control (Admin and User)
- Plot Management (CRUD operations)
- Booking System
- User and Admin Dashboards

---

## Tech Stack

Frontend:

- React.js
- Axios

Backend:

- Node.js
- Express.js

Database:

- MongoDB Atlas

---

## Project Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/reformedbrush/N12398063_IFN636_1.2.git
cd N12398063_IFN636_1.2
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

Run the backend:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Running the Application

Frontend:
http://localhost:3000

Backend:
http://localhost:5001

---

## Public URL

https://n12398063-ifn-636-1-2-4sr7n4myt-reformedbrushs-projects.vercel.app

Note: The frontend is deployed using Vercel with CI/CD integration via GitHub Actions. The backend is deployed on AWS EC2 and connected to MongoDB Atlas. Due to restricted inbound network policies, some backend endpoints may not be publicly accessible.

---

## Test Credentials

Admin Account:
Email: admin@gmail.com  
Password: Admin@123

User Account:
Email: test2@gmail.com  
Password: 1234

---

## CI/CD Pipeline

The project uses GitHub Actions and Vercel for CI/CD:

- Code is pushed to GitHub
- GitHub Actions runs automated build steps
- Vercel automatically deploys the frontend
- Backend is hosted on AWS EC2 and managed using PM2

---

## Author

Akshai Rekha Sangeeth  
Student ID: N12398063

---
