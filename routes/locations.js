const express = require('express');
const router = express.Router();
const Foodloc = require('../models/foodloc');
const { isLoggedIn, validateLocation, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const locations = require('../controllers/locations')

router.route('/')
    .get(catchAsync(locations.index))
    .post(isLoggedIn, validateLocation, catchAsync(locations.createLocation));


router.get('/new', isLoggedIn, locations.renderNewForm);


router.route('/:id')
    .get(catchAsync(locations.showLocation))
    .delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation))
    .put(isLoggedIn, isAuthor, validateLocation, catchAsync(locations.updateLocation));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm));


module.exports = router;