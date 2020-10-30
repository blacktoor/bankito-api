const express = require("express")

const router = express.Router()

// API/AUTH ALREADY ADDED IN SERVER.JS

//  @route  GET api/auth
//  @desc    Get logged in user
//  @access Private
router.get("/", (req, res) => {
  res.send("Get logged in user")
})

//  @route  POST api/auth
//  @desc    Log in a user
//  @access Public
router.post("/", (req, res) => {
  res.send("Log in user")
})

module.exports = router
