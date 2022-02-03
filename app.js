const dotenv = require("dotenv").config();
const helmet = require("helmet");
const toobusy = require("toobusy-js");
const express = require("express");

const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

// Middlewares
app.use(
   // for cookie protection
   session({
      resave: true,
      saveUninitialized: true,
      secret: "your-secret-key",
      key: "cookieName",
      cookie: { secure: true, httpOnly: true, path: "/user", sameSite: true },
   })
);
app.use(helmet()); // for security
app.use(function (req, res, next) {
   // for dos attack
   if (toobusy()) {
      res.send(503, "I'm busy right now, sorry.");
   } else {
      next();
   }
});

app.use((req, res, next) => {
   // avoid Cors errors
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
   next();
});

app.use(express.json({ limit: "1kb" })); // for parsing application/json and limit the size of the body
app.use(mongoSanitize()); // for sanitize the data from sql injection

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
