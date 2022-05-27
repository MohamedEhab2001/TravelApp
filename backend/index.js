require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const pinRouter = require("./routes/Pin");
const userRouter = require("./routes/Users");
app.use(express.json());
app.use("/api/pins", pinRouter);
app.use("/api/users", userRouter);
app.listen(5000, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
  console.log("started");
});
