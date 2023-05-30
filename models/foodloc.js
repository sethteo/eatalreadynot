const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodLocationSchema = new Schema({
    title: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Foodloc', FoodLocationSchema);
