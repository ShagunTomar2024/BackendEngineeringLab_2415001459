const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();


app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false
    })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    if (!req.session.user && req.cookies.user) {
        return res.send("Welcome back! s " + req.cookies.user);
    }

    res.send("Welcome !");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/login", (req, res) => {
    const { username, role } = req.body;

    req.session.user = {
        username: username,
        role: role
    };

    res.cookie("user", username);

    res.send("Login successful");
});

app.get("/courses", (req, res) => {
    if (!req.session.user) {
        return res.send("Please login first");
    }

    res.send("You can view courses");
});

app.get("/create-course", (req, res) => {
    if (!req.session.user) {
        return res.send("Please login first");
    }

    if (req.session.user.role !== "instructor") {
        return res.send("Access denied");
    }

    res.send("You can create a course");
});

app.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.send("Please login first");
    }

    res.render("profile", {
        username: req.session.user.username,
        role: req.session.user.role
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.send("Logout successful");
    });
});

// server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});