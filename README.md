
---

# 🧠 Fralon Peanuts – Backend

This is the backend API for **Fralon Peanuts**, an eCommerce platform for selling peanut-based products. It handles user authentication, product and order management, and serves both the customer-facing and admin-facing applications.

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **cloudinary** for cloud image storage 
- **nodemailer** for sending emails 
- **ejs** for email templating 
- **multer** for file uploading
- **multer** for data validation
- **dotenv** for config management
- **CORS**, **Helmet** for security

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

## 📁 Folder Structure

```bash
src/
├── config/          # DB connection and app config
├── controllers/     # Route logic
├── models/          # MongoDB schemas
├── services/          # api Business logic
├── views/          # Email screens
├── routes/          # Express route definitions
├── middlewares/     # Auth & error handling
├── utils/           # Helper functions
└── app.js        # App entry point

🏁 Getting Started

1. Clone the repo
git clone https://github.com/alphy1027/fralon-peanuts-app-backend.git
cd fralon-peanuts-backend

2. Install dependencies
npm install

3. Create a .env file
PORT=port
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

4. Start the server
npm run dev

The API will run at http://localhost:3500
