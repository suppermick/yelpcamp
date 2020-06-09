var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	rating: Number,
	createdAt: {
		type: Date,
		default: Date.now
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);