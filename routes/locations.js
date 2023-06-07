const express = require('express');
const router = express.Router();
const Foodloc = require('../models/foodloc');
const { isLoggedIn, validateLocation, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const locations = require('../controllers/locations')


router.get('/', catchAsync(locations.index));


router.get('/new', isLoggedIn, locations.renderNewForm);


router.post('/', isLoggedIn, validateLocation, catchAsync(locations.createLocation));


router.get('/:id', catchAsync(locations.showLocation));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm));


router.put('/:id', isLoggedIn, isAuthor, validateLocation, catchAsync(locations.updateLocation));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(locations.deleteLocation));


module.exports = router;