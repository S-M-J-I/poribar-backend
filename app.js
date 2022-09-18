require("dotenv").config({ path: `${__dirname}/configs/env.env` })
require('./db/mongoose')
const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')
const app = express()


const userAuthRoutes = require('./routes/userApi')
const nurseAuthRoutes = require('./routes/nurseApi')
const eventRoutes = require('./routes/eventApi')
const paymentRoutes = require('./routes/paymentsApi')
const appointmentRoutes = require('./routes/appointmentApi')
const forumPostRoutes = require('./routes/forumPostApi')
const reviewRoutes = require('./routes/reviewApi')
const reportApi = require('./routes/reportsApi')

// app.use(express.json())
app.use(cors({ origin: '*' }))
// app.use(bodyParser.urlencoded())
// app.use(express.urlencoded({ extended: true }))
app.post("/findAllNurses", (req, res) => {
    res.json([{
        "name": "Rajina Khatun",
        "rating": "67",
        "hospitalname": "Square Hospital Lt.",
    },
    {
        "name": "Rajina Khatun",
        "rating": "45",
        "hospitalname": "Square Hospital Lt.",
    },
    {
        "name": "Rijia Khatun",
        "rating": "87",
        "hospitalname": "Lab Aid Hospital",
    },
    {
        "name": "Rajina Khatun",
        "rating": "96",
        "hospitalname": "Square Hospital Lt.",
    },


    ])
})
app.use('/api/auth/user/', userAuthRoutes)
app.use('/api/auth/nurse/', nurseAuthRoutes)
app.use('/api/events/', eventRoutes)
app.use('/api/appointments/', appointmentRoutes)
app.use('/api/payments/', paymentRoutes)
app.use('/api/forums/post/', forumPostRoutes)
app.use('/api/review/', reviewRoutes)
app.use('/api/reports/', reportApi)

app.use('*', (req, res) => {
    res.status(404).send({ messsage: 'Not Found' })
})

app.listen(process.env.PORT, () => {
    console.log("Server is up")
    console.log("running on port" + process.env.PORT)
})