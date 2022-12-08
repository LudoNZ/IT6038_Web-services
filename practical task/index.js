require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes')
const users = require('./routes/users');
const Joi = require('joi');
mongoose.set('strictQuery', true);

Joi.objectId = require('joi-objectid')(Joi);
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());
app.use('/api', routes)
app.use('/api/users', users);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
