const express = require('express');
const router = express.Router({ mergeParams: true });


const { reviewSchema } = require('../schemas.js');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Foodloc = require('../models/foodloc');
const Review = require('../models/reviews');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.post('/', catchAsync(async(req, res) => {
    const location =  await Foodloc.findById(req.params.id);
    const review = new Review(req.body.review);
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Created new review');
    res.redirect(`/locations/${location._id}`)
 }))
 
 
router.delete('/:reviewId', catchAsync(async(req, res) => {
     const { id, reviewId } = req.params;
     await Foodloc.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/locations/${id}`);
}))

module.exports = router;