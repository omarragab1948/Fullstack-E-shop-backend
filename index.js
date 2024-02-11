const express = require("express");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || "https://fullstack-e-shop.onrender.com";

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable credentials (cookies, headers) for cross-origin requests
  })
);
app.use(bodyParser.json());
const signupRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

app.use("/", signupRouter);
app.use("/", categoryRouter);
app.use("/", userRouter);
app.use("/", productRouter);

app.use((error, req, res, next) => {
  res
    .status(error.status)
    .json({ status: error.status, message: error.message });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
