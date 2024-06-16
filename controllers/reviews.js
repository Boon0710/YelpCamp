const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "New Review Created");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}}) // Find the Campground by its ID and remove the specified review ID from the review db
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete review');
    res.redirect(`/campgrounds/${id}`);
}