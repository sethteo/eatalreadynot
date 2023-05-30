const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodLocationSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
});

module.exports = mongoose.model('Foodloc', FoodLocationSchema);
