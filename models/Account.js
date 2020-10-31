const mongoose = require("mongoose")
const autoIncrement = require("mongoose-auto-increment")

const AccountSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  accountNumber: {
    type: Number,
    default: 0,
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
})

// INITIALISING THE AUTO INCREMENT PLUGIN
autoIncrement.initialize(mongoose.connection)
AccountSchema.plugin(autoIncrement.plugin, {
  model: "Account",
  field: "accountNumber",
  startAt: 1001,
  incrementBy: 1,
})

module.exports = mongoose.model("account", AccountSchema)
