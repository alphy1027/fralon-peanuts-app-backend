const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI /*  {
            useUnifiedTopology: true,
            useNewUrlParser: true
        } */
    );
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("MongoDB Connection Error :: ", error);
  }
};

module.exports = connectDB;
