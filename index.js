const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnect();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/user', authRouter)
app.use('/', (req, res) => {
    res.send('Hello from server side!')
})
app.use(notFound)
app.use(errorHandler)



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})