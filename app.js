require('dotenv').config()


const express = require('express')
const app = express()
const port = 3001
const indexRoute = require('./routes/userRoute')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',indexRoute)

app.listen(port, () => console.log(`app running in  http://localhost:${port}/`))
