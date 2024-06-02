const moongose = require('mongoose');
const Schema = moongose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = moongose.model('Campground', CampgroundSchema);