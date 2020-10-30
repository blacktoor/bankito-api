const express = require("express")

const router = express.Router()

// API/USERS ALREADY ADDED IN SERVER.JS

//  @route  POST api/users
//  @desc    Register a user
//  @access PUBLIC
router.post("/", (req, res) => {
  res.send("Register a user")
})

module.exports = router
