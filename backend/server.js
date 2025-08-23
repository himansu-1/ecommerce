import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global middlewares
// app.use(cors());
app.use(cors({
  origin: 'https://ecommerce-pi-neon.vercel.app',
  // origin: process.env.FRONT_ENDPOINT,
  credentials: true,
}));

app.use(express.json());

// Serve static files for product images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));
// app.use(
//   "/uploads/products",
//   express.static(path.join(__dirname, "uploads/products"))
// );

// Routes
app.use("/api/auth", routes.authRoutes);
app.use("/api/products", routes.productRoutes);
app.use("/api/admin", routes.adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
