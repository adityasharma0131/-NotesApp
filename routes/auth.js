// var express = require('express');
// var session = require('express-session');
// var router = express.Router();
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;


// passport.use(new GoogleStrategy({
//     clientID: '523449926470-3ffns138l3crvq9g0ov53hr00n8mqjkd.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/google/callback'
//   },

//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile)
//   }
// ));

// router.get('/auth/google',
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// );

// router.get('/google/callback',
//     passport.authenticate('google', {
//       failureRedirect: '/login-failure',
//       successRedirect: '/dashboard',
//     })
// );
  
//   // Route if something goes wrong
// router.get('/login-failure', (req, res) => {
//     res.send('Something went wrong...');
// });



// module.exports = router;
