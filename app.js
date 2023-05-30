const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Foodloc = require('./models/foodloc')


mongoose.connect('mongodb://127.0.0.1:27017/food-where')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get('/', (req, res) => {
    res.render('home')
})   

app.get('/locations', async (req, res) => {
    const foodlocs  = await Foodloc.find({});
    res.render('locations/index', {foodlocs})
})   

app.get('/locations/new', (req, res) => {
    res.render('locations/new')
})  

app.post('/locations', async(req, res) => {
    const location = new Foodloc(req.body.foodlocation)
    await location.save();
    res.redirect(`/locations/${location._id}`)
})

app.get('/locations/:id', async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    res.render('locations/show', {location});
})  

app.get('/locations/:id/edit', async (req, res) => {
    const location = await Foodloc.findById(req.params.id);
    res.render('locations/edit', {location});
})   

app.put('/locations/:id', async(req, res) => {
    const location = await Foodloc.findByIdAndUpdate(req.params.id, {...req.body.foodlocation});
    res.redirect(`/locations/${location._id}`);
})

app.delete('/locations/:id', async(req, res) => {
    const {id} = req.params;
    await Foodloc.findByIdAndDelete(id);
    res.redirect('/locations')
})



app.listen(3000, () => {
    console.log('On port 3000')
}) 