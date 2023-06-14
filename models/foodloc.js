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
    return this.url.replace('/upload', '/upload/w_200,h_200');
});


const opts = { toJSON: { virtuals: true } };

const FoodLocationSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
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
}, opts);


FoodLocationSchema.virtual('properties.popUpMarkup').get(function() {
    return `<a href="/locations/${this._id}">${this.title}</a>`
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
