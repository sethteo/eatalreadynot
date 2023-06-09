const Foodloc = require('../models/foodloc');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});


module.exports.index = async (req, res) => {
    const foodlocs  = await Foodloc.find({});
    res.render('locations/index', {foodlocs})
};

module.exports.renderNewForm = (req, res) => {
    res.render('locations/new')
};

module.exports.createLocation = async(req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.foodlocation.location ,
        limit: 1
    }).send();

    const location = new Foodloc(req.body.foodlocation);
    // Maybe include error checking
    location.geometry = geodata.body.features[0].geometry;
    location.images = req.files.map(f => ({url:f.path, filename:f.filename}));
    location.author = req.user._id;
    await location.save();
    req.flash('success', 'Successfully made a new location');
    res.redirect(`/locations/${location._id}`)
};

module.exports.showLocation = async (req, res) => {
    // populate is used to add the review and author elements just from id
    const location = await Foodloc.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/show', {location});
};

module.exports.renderEditForm = async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    if (!location) {
        req.flash('error', 'Cannot find that location');
        return res.redirect('/locations');
    }
    res.render('locations/edit', {location});
};

module.exports.updateLocation = async(req, res) => {
    const { id } = req.params;	
    const geodata = await geocoder.forwardGeocode({
        query: req.body.foodlocation.location ,
        limit: 1
    }).send();
    const location = await Foodloc.findByIdAndUpdate(id, { ...req.body.foodlocation });	
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    location.images.push(...imgs);
    location.geometry = geodata.body.features[0].geometry;
    await location.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await location.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully updated location!');	
    res.redirect(`/locations/${location._id}`)
};

module.exports.deleteLocation = async(req, res) => {
    const {id} = req.params;
    await Foodloc.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted location');
    res.redirect('/locations')
};