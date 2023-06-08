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
            author: "6480639753bf2582bcf34d12",
            title: `${title[random75]}`,
            location: `${cities[random75].city}`,
            description: `${sample(descriptors)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dy2tygj6t/image/upload/v1686204991/eatalreadynot/u655hmacmerflyxbusxo.jpg',
                  filename: 'eatalreadynot/u655hmacmerflyxbusxo',
                }
                
              ]
        })
        await location.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})


"6480639753bf2582bcf34d12"