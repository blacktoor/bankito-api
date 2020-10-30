const express = require("express")

const app = express()

app.get("/", (req, res) => {
  res.json({ msg: "Hello there" })
})

// DEFINING ROUTES
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/accounts", require("./routes/accounts"))
const PORT = process.env.port || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
