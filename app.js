import express from "express";
import mongoose from "mongoose";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import categoryRoutes from "./routes/categories.js";
import productsRoutes from "./routes/product.js";
import dashboardRoutes from "./routes/dashboard.js";
import bannersRoutes from "./routes/banner.js"
import 'dotenv/config'

const app = express();

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
mongoose.connection.once("open", () => console.log("✅ MongoDB connected"));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(expressLayouts);
app.set("layout", "layout"); 

// Routes
app.use("/categories", categoryRoutes);
app.use("/products", productsRoutes);
app.use("/banners", bannersRoutes);
app.use("/", dashboardRoutes);
// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
