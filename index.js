"use strict"
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
/*
    $ npm i express dotenv mongoose express-async-errors
    $ npm i cookie-session
    $ npm i jsonwebtoken
*/

const express = require('express')
const app = express()

/* ------------------------------------------------------- */
require('dotenv').config()
const PORT = process.env?.PORT || 8000

require("express-async-errors")

const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()
// continue from here...

app.use(express.json())

app.use(require('cookie-session'))
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------------------------- */
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to PERSONNEL API',
    })
})
// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()