const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

passport.use(
  new FacebookStrategy(
    {
      clientID: '390855841470886',
      clientSecret: '9c36be7b26a7938b6507928545b74ab5',
      callbackURL: `http://localhost:3000/`
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('getting here',profile)
      User.findOrCreate(profile.email, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    }
  )
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/login/facebook1", function(req, res) {
  console.log("joy")
})


router.get(
  "/return",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/",
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
    .catch(err => next(err));
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

router.get('/profile/:_id', (req, res, next) => {
  User.findById(req.params._id)
    .then(user => res.json(user))
    .catch(next)
})

router.put('/profile/:id', (req, res, next) => {
  console.log(req.body)
  User.findByIdAndUpdate({_id:req.params.id}, {
    name : req.body.name 
  })
    .then(res=>res.json(user))
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
