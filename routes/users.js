var express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User");
var jwt = require("jsonwebtoken");
let secret = "HosamEl-Behiry",
  hashedPassword;

/* GET All Users. */
router.get("/", async (req, res) => {
  await User.find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ err });
    });
});

/*Posting New User */
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check(
      "password",
      `password must be at least one upperCase, one lowerCase, one Digit, one special character, minimum length is 8`
    ).matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[# ?!@$%^&*-]).{8,}$/
    ),
    check("email", "Email is not valid").isEmail(),
    check("mobile", "mobile is not valid").matches(
      /^(010|011|012|015)[0-9]{8}/
    ),
  ],
  checkEmail,
  checkMobile,
  hashPassword,
  async (req, res) => {
    console.log("WElcome");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        mobile: req.body.mobile,
        location: req.body.location ? req.body.location : "",
        image: req.body.image ? req.body.image : "",
      });
      newUser
        .save()
        .then((data) => {
          jwt.sign({ data }, secret, (err, token) => {
            if (err) {
              res.status(403).json({ err });
            } else {
              res
                .status(201)
                .json({ message: "New User have been created", token });
            }
          });
        })
        .catch((err) => {
          res.status(404).json({ err });
        });
    }
  }
);

// check if email exists
async function checkEmail(req, res, next) {
  await User.find({ email: req.body.email })
    .then((data) => {
      if (data.length > 0) {
        res.status(403).json({ error: "This Email is already exists" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
}

// check if mobile exists
async function checkMobile(req, res, next) {
  await User.find({ mobile: req.body.mobile })
    .then((data) => {
      if (data.length > 0) {
        res.status(403).json({ error: "This Mobile is already exists" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.json({ err });
    });
}

//hashing password
async function hashPassword(req, res, next) {
  await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.status(404).json({ err });
    } else {     
      hashedPassword = hash;
      next();
    }
  });
}

// login using jwt with mobile number and password ..
router.post("/login", async (req, res) => {
  await User.findOne({ mobile: req.body.mobile })
    .then((data) => {
      if (data === null) {
        res.status(404).json({ message: "this mobile is not exist" });
      } else {
        bcrypt
          .compare(req.body.password, data.password)
          .then((response) => {
            if (response) {
              jwt.sign({ data }, secret, (error, token) => {
                if (error) {
                  res.status(403).json({ error });
                } else {
                  res.status(200).json({ message: "Success Operation", token });
                }
              });
            } else res.json({ message: "Password is incorrect" });
          })
          .catch((err) => {
            res.status(404).json({ err });
          });
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
});

//Find By Mobile
router.get("/getMobile", async (req, res) => {
  await User.findOne({ mobile: req.body.mobile })
    .then((data) => {
      if (data === null) {
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log("error at mobile .. ");
      res.json({ err });
    });
});

// logout from website ..
router.post("/logout", (req, res) => {
  delete req.authorization;
  console.log(req);
  res.status(200).json({ message: "successfully signed out" });
});

// Find User By Id ..
router.get("/:id", async (req, res) => {
  await User.findOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("error finding user ");
      res.json(err);
    });
});

// Delete User By Id
router.delete("/:id", async (req, res) => {
  await User.deleteOne({ _id: req.params.id })
    .then((data) => {
      console.log("user has been deleted ..");
      res.json(data);
    })
    .catch((err) => {
      console.log("error deleting user ..");
      res.json(err);
    });
});

// update User By IDs
router.put("/:id", async (req, res) => {
  User.updateOne({ _id: req.params.id }, { $set: req.body })
    .then((data) => {
      res.status(200).json({ message: "updated Successfully", data });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = router;
