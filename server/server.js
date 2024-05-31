const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configs/db.js");
const authRoutes = require("./routes/authRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const ingredientRoutes = require("./routes/ingredientRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const likeRoutes = require("./routes/likeRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const searchRoutes = require("./routes/searchRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
dotenv.config();

//database config
connectDB();

const app = express();
// Init middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/ingredient", ingredientRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

//routes

//PORT
const PORT = process.env.PORT || 4000;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
