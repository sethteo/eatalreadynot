const express = require('express');
const router = express.Router();
const Foodloc = require('../models/foodloc');
const { isLoggedIn, validateLocation, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');


router.get('/', catchAsync(async (req, res) => {
    const foodlocs  = await Foodloc.find({});
    res.render('locations/index', {foodlocs})
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('locations/new')
})


router.post('/', isLoggedIn, validateLocation, catchAsync(async(req, res, next) => {
    const location = new Foodloc(req.body.foodlocation);
    location.author = req.user._id;
    await location.save();
    req.flash('success', 'Successfully made a new location');
    res.redirect(`/locations/${location._id}`)
}))


router.get('/:id', catchAsync(async (req, res) => {
    // populate is used to add the review and author elements just from id
    const location = await Foodloc.findById(req.params.id).populate('reviews').populate('author');
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/show', {location});
}))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/edit', {location});
}))


router.put('/:id', isLoggedIn, isAuthor, validateLocation, catchAsync(async(req, res) => {
    const { id } = req.params;	
    const location = await Foodloc.findByIdAndUpdate(id, { ...req.body.foodlocation });	
    req.flash('success', 'Successfully updated location!');	
    res.redirect(`/locations/${location._id}`)
}))


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Foodloc.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location');
    res.redirect('/locations')
}))


module.exports = router;