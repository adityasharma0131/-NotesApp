var express = require("express");
var session = require("express-session");
var router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./users");
const { isLoggedIn} = require('./checkAuth');

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "टिप्पणी - Notes App" });
});

router.get("/dashboard", isLoggedIn ,function (req, res, next) {
  res.render("dashboard", { title: "टिप्पणी - Dashboard" });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "523449926470-3ffns138l3crvq9g0ov53hr00n8mqjkd.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
    },

    async function (accessToken, refreshToken, profile, done) {
      console.log(profile)
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    })
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Route if something goes wrong
router.get("/login-failure", (req, res) => {
  res.send("Something went wrong...");
});


router.get('/logout', (req,res) =>{
  req.session.destroy(error =>{
    if(error){
      console.log(error);
      res.send('Error Logging out');
    } else {
      res.redirect('/');
    }
  })

});


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = router;
