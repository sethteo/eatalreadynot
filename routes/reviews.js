const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const Foodloc = require('../models/foodloc');
const Review = require('../models/reviews');
const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
 
 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;