const express = require("express")

const router = express.Router()

// API/ACCOUNTS ALREADY ADDED IN SERVER.JS

//  @route  GET api/accounts
//  @desc    Get all accounts of user
//  @access PUBLIC
router.get("/", (req, res) => {
  res.send("Get all accounts of user")
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
