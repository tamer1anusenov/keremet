const express = require('express');
const app = express();
const { pool } = require('./dbConfig');  // Import PostgreSQL connection
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const initializePassport = require('./passportConfig');
initializePassport(passport);

const PORT = process.env.PORT || 4000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_if_env_not_loaded',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true if using HTTPS
  })
);

app.use(passport.session());
app.use(passport.initialize());

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success_msg = req.flash('success_msg');
  next();
});

// Routes
app.get('/', (req, res) => res.render("index"));
app.get("/users/register", (req, res) => res.render("register"));
app.get("/users/login", (req, res) => {
  const error = req.flash('error')[0]; // Get the first error message
  const success_msg = req.flash('success_msg')[0];
  
  res.render("login", {
    error,
    success_msg
  });
});
app.get("/users/dashboard", (req, res) => res.render("dashboard", { user: req.user.firstName }));

app.post("/users/register", async (req, res) => {
    let { firstName, lastName, email, phone, dob, password, password2 } = req.body;
    
    console.log("Received Registration Data:", { firstName, lastName, email, phone, dob, password, password2 });

    let errors = [];

    // 🛑 Validate input
    if (!firstName || !lastName || !email || !password || !password2) {
        errors.push({ message: "Please enter all required fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        return res.render("register", { errors });
    }

    try {
        // Check if email already exists
        const existingUser = await pool.query(
            `SELECT * FROM keremet_schema.users WHERE email = $1`, 
            [email]
        );

        if (existingUser.rows.length > 0) {
            errors.push({ message: "Email already registered" });
            return res.render("register", { errors });
        }

        // 🔐 Hash password before storing
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);

        // 🟢 Insert user into database
        const newUser = await pool.query(
            `INSERT INTO keremet_schema.users (first_name, last_name, email, phone, date_of_birth, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, 'User') RETURNING id, email`,
            [firstName, lastName, email, phone, dob, hashedPassword]
        );

        console.log("User added to database:", newUser.rows[0]);

        // ✅ Flash message & Redirect
        req.flash("success_msg", "You are now registered. Please log in");
        return res.redirect("/users/login");

    } catch (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("Database error");
    }
});



app.post(
  "/users/login",
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: 'Invalid email or password' // Custom message
  })
);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
