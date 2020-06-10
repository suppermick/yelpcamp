var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
		default: 0
    },
    // review text
    text: {
        type: String
    },
    // author id and username fields
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // campground associated with the review
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Comment", commentSchema);