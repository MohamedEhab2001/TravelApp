const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// register
router.post("/register", async (req, res) => {
  // generating new pass
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user
  const newUser = await User.create({ ...req.body, password: hashedPassword });
  // send response
  res.status(201).json({
    status: "success",
    newUser: newUser._id,
  });
});

// login
router.post("/login", async (req, res) => {
  // find user
  const user = await User.findOne({ username: req.body.username });
  !user && res.status(404).json({ status: "fail", msg: "no user" });
  // validate passowrd
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  !validatePassword &&
    res.status(400).json({ status: "fail", msg: "wrong password" });

  // send response
  res.status(201).json({
    status: "success",
    user: user.username,
  });
});
module.exports = router;
