var express = require("express");
var session = require("express-session");
var router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./users");
const { isLoggedIn } = require("./checkAuth");

const Note = require("./Notes");
const mongoose = require("mongoose");
const Notes = require("./Notes");

// Initialize Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "523449926470-3ffns138l3crvq9g0ov53hr00n8mqjkd.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          profileImage: profile.photos[0].value,
        };

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        done(error, null);
      }
    }
  )
);

// Initialize Express application
var app = express();

// Session configuration
app.use(
  session({
    secret: "your_session_secret_here",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Serialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    done(err, null);
  }
});

// Routes
router.get("/", function (req, res, next) {
  res.render("index", { title: "टिप्पणी - Notes App" });
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const notes = await Note.find({});

    res.render("dashboard", {
      title: "टिप्पणी - Dashboard",
      notes,
      userName: req.user.firstName,
    });
  } catch (error) {
    console.log("err", + error);

  }
});

router.get("/dashboard/item/:id", isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id }).lean();
    
    if (note) {
      res.render('view-notes', { 
        title: "टिप्पणी - View Notes",
        noteID: req.params.id,
        note,
      });
    } else {
      res.status(404).send("Note not found");
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).send("Something went wrong");
  }
});


// router.get("/dashboard/item/:id", isLoggedIn, async (req, res) => {
//   res.render("index", { title: "टिप्पणी - Notes App" });
// });


// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback route after Google authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Route if something goes wrong during authentication
router.get("/login-failure", (req, res) => {
  res.send("Something went wrong...");
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error in logout:", error);
      res.send("Error logging out");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
