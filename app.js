const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const locations = require('./routes/locations');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/food-where')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/locations", locations)
app.use('/locations/:id/reviews', reviews)


app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('On port 3000')
}) 