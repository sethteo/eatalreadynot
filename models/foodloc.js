const mongoose = require('mongoose');
const Review = require('./reviews')
const Schema = mongoose.Schema;

const FoodLocationSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

FoodLocationSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Foodloc', FoodLocationSchema);
