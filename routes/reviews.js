const express = require('express');
const router = express.Router({mergeParams: true});
const Joi = require('joi');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const Review = require('../models/review');
const Campground = require('../models/campground');
const {reviewSchema} = require('../schemas');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "New Review Created");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}}) // Find the Campground by its ID and remove the specified review ID from the review db
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;