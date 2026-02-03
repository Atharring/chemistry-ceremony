const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();

// ✅ Render / proxies (important when behind HTTPS reverse proxy)
app.set("trust proxy", 1);

// ✅ Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Parsers (ONLY ONCE)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Static (ONLY ONCE)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session (ONLY ONCE)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // Render uses HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Routes (make sure these files exist)
const ceremonyRoutes = require("./routes/ceremonyRoutes");
app.use(ceremonyRoutes);

// ⚠️ IMPORTANT: only require authRoutes if the file EXISTS.
// If your file is routes/index.js then use: require("./routes")
// If your file is routes/auth.js then use: require("./routes/auth")
const authRoutes = require("./routes/auth");
app.use(authRoutes);

// ✅ Root redirect
app.get("/", (req, res) => {
  if (req.session?.attendeeId) return res.redirect("/welcome");
  return res.redirect("/login");
});

app.get("/dashboard", (req, res) => res.redirect("/welcome"));

// ✅ 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ✅ Render PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
