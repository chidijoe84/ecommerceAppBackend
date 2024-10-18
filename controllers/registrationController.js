const express = require("express");
const userRegService = require("../services/registration.services");
const router = express.Router();

router.post("/registerUsers", async (req, res) => {
  try {
    const newUser = await userRegService.newUsercreation(req.body);

    if (newUser.success === false) {
      // Return 200 status but with success false
      res.status(200).json({ message: newUser.message, success: false });
    } else {
      res.status(201).json({
        success: true,
        message: "User Registration Successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating the user",
      success: false,
    });
  }
});


// router.post("/", async (req, res) => {
//   try {
//     // Create the user and get the new user data
//     const newUser = await userRegService.userLogin(req.body);

//     if (!newUser) {
//       res.status(404).json({ message: "No User found" });
//     } else {
//       res.status(201).json({
//         success: true,
//         message: "User Login Successful",
//         data: newUser, // Return the added user data as the response
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       error: "An error occurred while user was trying to login",
//     });
//   }
// });

router.get("/totalUsers", async (req, res) => {
  try {
    const totalUserCounts = await userRegService.getTotalUserCount();
    res.status(200).json({
      success: true,
      totalUserCounts: totalUserCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the total user count",
    });
  }
});

module.exports = router;
