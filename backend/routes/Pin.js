const router = require("express").Router();

const Pin = require("../models/Pin");

//create a pin

router.post("/", async (req, res) => {
  const newPin = await Pin.create(req.body);
  res.status(200).json({
    status: "success",
    newPin,
  });
});

// get all pins
router.get("/", async (req, res) => {
  const pins = await Pin.find();
  res.status(200).json({
    status: "success",
    pins,
  });
});

module.exports = router;
