const express = require("express");
const userRegService = require("../services/registration.services");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newUser = await userRegService.userLogin(req.body);
    // console.log("new user =>>>", newUser);

    if (newUser.error) {
      res.status(200).json({ message: "No User found", success: false });
    } else {
      res.status(201).json({
        success: true,
        message: "User Login Successful",
        userInformation: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while user was trying to login",
    });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const result = await userRegService.forgotPassword(req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
