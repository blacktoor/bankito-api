const mongoose = require("mongoose")

const AccountSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  savings: {
    accountNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  loan: {
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
  },
})

module.exports = mongoose.model("account", AccountSchema)
