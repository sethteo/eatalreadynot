const express = require('express');
const router = express.Router();


const Foodloc = require('../models/foodloc');
const {locationSchema} = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateLocation = (req, res, next) => {
    const { error } = locationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const foodlocs  = await Foodloc.find({});
    res.render('locations/index', {foodlocs})
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('locations/new')
})


router.post('/', isLoggedIn, validateLocation, catchAsync(async(req, res, next) => {
    const location = new Foodloc(req.body.foodlocation);
    await location.save();
    req.flash('success', 'Successfully made a new location');
    res.redirect(`/locations/${location._id}`)
}))


router.get('/:id', catchAsync(async (req, res) => {
    const location = await Foodloc.findById(req.params.id).populate('reviews');
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/show', {location});
}))


router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/edit', {location});
}))


router.put('/:id',  isLoggedIn, validateLocation, catchAsync(async(req, res) => {
    const location = await Foodloc.findByIdAndUpdate(req.params.id, {...req.body.foodlocation});
    req.flash('success', 'Successfully updated the location');
    res.redirect(`/locations/${location._id}`);
}))


router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Foodloc.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location');
    res.redirect('/locations')
}))


module.exports = router;