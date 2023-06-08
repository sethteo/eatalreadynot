const express = require('express');
const router = express.Router();
const Foodloc = require('../models/foodloc');
const { isLoggedIn, validateLocation, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const locations = require('../controllers/locations');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(locations.index))
    .post(isLoggedIn, upload.array('locationImage'), validateLocation, catchAsync(locations.createLocation))


router.get('/new', isLoggedIn, locations.renderNewForm);


router.route('/:id')
    .get(catchAsync(locations.showLocation))
    .put(isLoggedIn, isAuthor, upload.array('locationImage'), validateLocation, catchAsync(locations.updateLocation))
    .delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm));


module.exports = router;