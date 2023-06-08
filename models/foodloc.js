const mongoose = require('mongoose');
const Review = require('./reviews')
const Schema = mongoose.Schema;


const ImageSchema = new Schema(
    {
        url: String,
        filename: String,
    }
)

// Not actually stored in DB
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const FoodLocationSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
