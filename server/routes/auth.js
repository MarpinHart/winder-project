const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const router = express.Router();
const {isLoggedIn} = require("../middlewares")
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields:  ['email', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      let email = profile.emails[0].value
      User.findOne({email})
      .then(user => {
        if (user) {
          done(null, user)
        }
        else {
          User.create({
            email,
            name: profile.displayName,
          })
          .then(userCreated => {
            done(null, userCreated)
          })
        }
      })
    }
  )
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook")
);

router.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.FRONTEND_URI + "/success-login",
    failureRedirect: "/login"
  })
);

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res
      .status(400)
      .json({ message: "Please indicate email, name and password" });
    return;
  }
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc !== null) {
        res.status(409).json({ message: "This email is already registered" });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({ email, password: hashPass, name });
      return newUser.save();
    })
    .then(userSaved => {
      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userSaved, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userSaved.password = undefined;
        res.json(userSaved);
      });
    })
    .catch(err => res.json(err));
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // first check to see if there's a document with that email
  User.findOne({ email })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong (no document in database)
      if (!userDoc) {
        // create an error object to send to our error handler with "next()"
        next(new Error("Incorrect email"));
        return;
      }

      // second check the password
      // "compareSync()" will return false if the "password" is wrong
      if (!bcrypt.compareSync(password, userDoc.password)) {
        // create an error object to send to our error handler with "next()"
        next(new Error("Password is wrong"));
        return;
      }

      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userDoc, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userDoc.password = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

router.get('/connected-profile', isLoggedIn, (req, res, next) => {
  res.json(req.user)
})

router.get('/profile/:_id', (req, res, next) => {
  User.findById(req.params._id)
    .then(user => {
      res.json(user)})
    .catch(next)
})

router.put('/profile/:_id', (req, res, next) => {
  const name = req.body.newName
  User.findByIdAndUpdate(req.params._id,
   {name: name}, 
   {new: true}
  )
    .then(user=>{res.json(user)})
    .catch(next)
})

router.post("/login-with-passport-local-strategy", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong" });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, err => {
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
        return;
      }

      // We are now logged in (notice req.user)
      res.json(req.user);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "You are out!" });
});

module.exports = router;
