
---

## 🧠 Fralon Peanuts – Backend

# 🧠 Fralon Peanuts – Backend API

This is the backend API for **Fralon Peanuts**, an eCommerce platform for selling peanut-based products. It handles user authentication, product and order management, and serves both the customer-facing and admin-facing applications.

---

## 🧪 Features

- 🔐 JWT-based authentication
- 🔐 Role-based access control
- 🧍 User registration and login
- 🛍 Product CRUD operations
- 🛒 Cart functionality
- 📦 Order creation and tracking
- ⚙️ Middleware for route protection and error handling

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **dotenv** for config management
- **CORS**, **Helmet** for security

---

## 📁 Folder Structure

```bash
src/
├── config/          # DB connection and app config
├── controllers/     # Route logic
├── models/          # MongoDB schemas
├── services/          # MongoDB schemas
├── views/          # MongoDB schemas
├── routes/          # Express route definitions
├── middlewares/     # Auth & error handling
├── utils/           # Helper functions
└── app.js        # App entry point

🏁 Getting Started

1. Clone the repo
git clone https://github.com/your-username/fralon-peanuts-backend.git
cd fralon-peanuts-backend

2. Install dependencies
npm install

3. Create a .env file
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

4. Start the server
npm run dev

The API will run at http://localhost:3500
