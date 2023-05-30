const mongoose = require('mongoose');
const cities = require('./sg')
const {descriptors, title} = require('./seedHelpers')
const Foodloc = require('../models/foodloc')

mongoose.connect('mongodb://127.0.0.1:27017/food-where')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Foodloc.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random75 = Math.floor(Math.random() * 75);
        const location = new Foodloc({
            title: `${title[random75]}`,
            location: `${cities[random75].city}`,
            image: 'https://images.unsplash.com/flagged/photo-1562503542-2a1e6f03b16b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&w=1000&q=80',
            description: `${sample(descriptors)}`
        })
        await location.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})