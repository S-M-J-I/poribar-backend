require("dotenv").config({ path: `${__dirname}/configs/env.env` })
require('./db/mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()


const userAuthRoutes = require('./routes/userApi')
const nurseAuthRoutes = require('./routes/nurseApi')
const eventRoutes = require('./routes/eventApi')
const appointmentRoutes = require('./routes/appointmentRoutes')

app.use(express.json())
app.use(cors({ origin: '*' }))
app.use(bodyParser.urlencoded())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth/user/', userAuthRoutes)
app.use('/api/auth/nurse/', nurseAuthRoutes)
app.use('/api/events/', eventRoutes)
app.use('/api/appointments/', appointmentRoutes)

// module.exports = app
app.listen(process.env.PORT, () => {
    console.log("Server is up")
})