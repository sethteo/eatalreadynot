const Foodloc = require('../models/foodloc');
const Review = require('../models/reviews');

module.exports.createReview = async(req, res) => {
    const location =  await Foodloc.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Created new review');
    res.redirect(`/locations/${location._id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Foodloc.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/locations/${id}`);
};