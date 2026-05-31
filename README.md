# Community Garden Manager (IFN636 Assessment 2)

A full-stack web application developed for IFN636 Software Life Cycle Management. The system enables community garden members to manage plots, submit garden activity requests, participate in community events, and interact through a role-based management platform.

---
## Test Credentials

For demonstration and assessment purposes, the following administrator account can be used:

### Administrator Account

```text
Email: admin@gmail.com
Password: Admin@123
```

This account provides access to administrative functionality including:

* User Management
* Plot Management
* Garden Activity Request Management
* Community Event Management
* Dashboard Analytics

Note: These credentials are intended for assessment and demonstration purposes only.

## Features

### User Management

* User Registration and Login
* JWT Authentication
* Role-Based Access Control (Admin/User)

### Plot Management

* View Available Plots
* Book Garden Plots
* Cancel Plot Bookings
* Admin Plot Management

### Garden Activity Requests

Users can submit requests related to garden maintenance and support.

Request Types:

* Watering Request
* Compost Request
* Tool Request
* Maintenance Request
* Harvest Assistance

Request Status Workflow:

* Pending
* Approved
* Rejected
* Completed

Admin Features:

* View All Requests
* Approve Requests
* Reject Requests
* Mark Requests as Completed

### Community Events

Users can participate in community garden activities.

User Features:

* View Upcoming Events
* Register for Events
* Cancel Event Registration

Admin Features:

* Create Events
* Update Events
* Delete Events
* View Event Participants

### Dashboard

* Admin Dashboard
* User Dashboard
* Plot Occupancy Overview
* User Management

---

## Technology Stack

### Frontend

* React.js
* Axios
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### DevOps & Deployment

* GitHub Actions
* Vercel
* AWS EC2
* PM2

---

## Software Engineering Concepts Implemented

### Design Patterns

* MVC Architecture
* Middleware Chain (Chain of Responsibility)
* Module Pattern
* Repository-style Data Access (Mongoose Models)
* React Context Pattern

### OOP Principles

* Encapsulation
* Abstraction
* Modular Design
* Separation of Concerns

---

## Project Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js

frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── axiosConfig.js
│   └── App.js
```

---

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

Start Backend:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Application URLs

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5001
```

---

## Testing

### API Testing

* User Authentication Endpoints
* Plot Management Endpoints
* Garden Activity Request Endpoints
* Community Event Endpoints

### Functional Testing

* User Registration
* Login
* Plot Booking
* Request Submission
* Event Registration
* Admin Management Functions

---

## CI/CD Pipeline

The project uses GitHub Actions and Vercel for continuous integration and deployment.

Workflow:

1. Developer pushes code to GitHub.
2. GitHub Actions executes automated build checks.
3. Frontend is automatically deployed through Vercel.
4. Backend is deployed on AWS EC2 using PM2.

---

## Deployment

Frontend:

* Vercel

Backend:

* AWS EC2
* MongoDB Atlas

---

## Team Members

* Akshai Rekha Sangeeth 
* Athira Susan lalu
* Leya Sebastian
* Sivapriya Punnasseril

* Team Members as applicable

---

## Assessment

Queensland University of Technology (QUT)

IFN636 – Software Life Cycle Management

Assessment 2 – Group 26 Project
