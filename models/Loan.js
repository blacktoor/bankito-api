const mongoose = require("mongoose")

const LoanSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  list: {
    type: Object,
    default: {},
  },
  active: {
    type: Object,
    default: {},
  },
  outstandingBalance: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  isOwing: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model("loan", LoanSchema)
