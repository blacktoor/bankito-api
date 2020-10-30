const express = require("express")

const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")

const User = require("../models/User")
const Account = require("../models/Account")

const router = express.Router()

// API/ACCOUNTS ALREADY ADDED IN SERVER.JS

//  @route  GET api/accounts
//  @desc    Get all accounts of user
//  @access   PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const account = await Account.findById({ user: req.user.id })
    res.json(account)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

//  @route  POST api/accouts
//  @desc    Add new accounts
//  @access PRIVATE
router.post("/", (req, res) => {
  res.send("Add accounts")
})

//  @route  PUT api/accounts/:id
//  @desc   UPDATE accounts
//  @access PRIVATE
router.put("/:id", (req, res) => {
  res.send("Update accounts")
})

//  @route  DELETE api/accounts/:id
//  @desc   DELETE accounts
//  @access PRIVATE
router.delete("/:id", (req, res) => {
  res.send("Delete accounts")
})

module.exports = router
