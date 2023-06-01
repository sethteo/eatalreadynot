const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {locationSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Foodloc = require('./models/foodloc');
const Review = require('./models/reviews');


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


const validateLocation = (req, res, next) => {
    const { error } = locationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home')
})   


app.get('/locations', catchAsync(async (req, res) => {
    const foodlocs  = await Foodloc.find({});
    res.render('locations/index', {foodlocs})
}))


app.get('/locations/new', (req, res) => {
    res.render('locations/new')
})  


app.post('/locations', validateLocation, catchAsync(async(req, res, next) => {

    const location = new Foodloc(req.body.foodlocation)
    await location.save();
    res.redirect(`/locations/${location._id}`)
}))


app.get('/locations/:id', catchAsync(async (req, res) => {
    const location = await Foodloc.findById(req.params.id).populate('reviews');
    res.render('locations/show', {location});
}))


app.get('/locations/:id/edit', catchAsync(async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    res.render('locations/edit', {location});
}))


app.put('/locations/:id', validateLocation, catchAsync(async(req, res) => {
    const location = await Foodloc.findByIdAndUpdate(req.params.id, {...req.body.foodlocation});
    res.redirect(`/locations/${location._id}`);
}))


app.delete('/locations/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Foodloc.findByIdAndDelete(id);
    res.redirect('/locations')
}))


app.post('/locations/:id/reviews', catchAsync(async(req, res) => {
   const location =  await Foodloc.findById(req.params.id);
   const review = new Review(req.body.review);
   location.reviews.push(review);
   await review.save();
   await location.save();
   res.redirect(`/locations/${location._id}`)
}))




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