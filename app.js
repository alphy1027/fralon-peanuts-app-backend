require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const clientRoutes = require("./routes/clientRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const profileRoutes = require("./routes/profileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./middleware/authMiddleware");
const { USER_ROLES, verifyRoles } = require("./middleware/roles");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again after one hour",
});

// express app
const app = express();

// Apply the rate limiting middleware to all requests.
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be included
  })
);

const connectDB = async () => {
  const PORT = process.env.PORT || 3000;
  try {
    await mongoose
      .connect(
        process.env.MONGO_URI /*  {
            useUnifiedTopology: true,
            useNewUrlParser: true
        } */
      )
      .then((result) => {
        app.listen(PORT, () => {
          console.log(`listening to requests on port:${PORT}`);
        });
        console.log("connected to local mongoDB successfully");
      })
      .catch((err) => console.log("Failed to connect to the database", err));
  } catch (error) {
    console.log("Connection Error : ", error);
  }
};
connectDB();

app.use(morgan("dev")); // log every request to the console
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static("public")); // middleware & static files
app.use(cookieParser());
app.use((req, res, next) => {
  console.log({ message: "first middleware executed" });
  next();
});
app.use("/auth", authRoutes);
app.use(checkAuth);
app.use("/cart", verifyRoles(USER_ROLES.CLIENT), cartRoutes);
app.use("/products", productRoutes);
app.use("/clients", verifyRoles(USER_ROLES.ADMIN), clientRoutes);
app.use("/purchases", verifyRoles(USER_ROLES.ADMIN), purchaseRoutes);
app.use("/orders", orderRoutes);
app.use("/notifications", verifyRoles(USER_ROLES.ADMIN), notificationRoutes);
app.use("/favourites", favouriteRoutes);
app.use("/transactions", transactionRoutes);
app.use("/contact-us", verifyRoles(USER_ROLES.CLIENT), contactRoutes);
app.use("/profile", verifyRoles(USER_ROLES.CLIENT, USER_ROLES.ADMIN), profileRoutes);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);
