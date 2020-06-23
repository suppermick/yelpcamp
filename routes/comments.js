var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/:commentId/edit', middleware.isLoggedIn, middleware.checkCommentOwner, function(
	req,
	res
) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('comments/edit', {
				campground_id: req.params.id,
				comment: req.comment,
				campground: campground
			});
		}
	});
});

//This route is a GET request that displays the "Add new comment" page

router.get('/new', middleware.isLoggedIn, middleware.checkReviewExistence, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec(function(err, campground) {
			if (err) {
				console.log(err);
				res.redirect('/campground');
			} else {
				Comment.create(req.body.comment, function(err, comment) {
					if (err) {
						console.log(err);
					} else {
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						campground.comments.push(comment);
						campground.rating = calculateAverage(campground.comments);
						campground.save();
						req.flash('success', 'Comment Added!');
						res.redirect('/campgrounds/' + campground._id);
					}
				});
			}
		});
});

//Comment Update
router.put('/:comment_id', function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
		err,
		updatedComment
	) {
		if (err) {
			res.redirect('back');
		} else {
			Campground.findById(req.params.id)
				.populate('comments')
				.exec(function(err, campground) {
					if (err) {
						console.log(err);
						res.redirect('back');
					} else {
						campground.rating = calculateAverage(campground.comments);
						campground.save();
						req.flash('success', 'Comment Updated!');
						res.redirect('/campgrounds/' + req.params.id);
					}
				});
		}
	});
});

//comment delete router

router.delete('/:comment_id', function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			req.flash('success', 'Comment Deleted');
			res.redirect('back');
		}
	});
});

function calculateAverage(comments) {
	if (comments.length === 0) {
		return 0;
	}
	var sum = 0;
	comments.forEach(function(comment) {
		sum += comment.rating;
	});
	return sum / comments.length;
}

module.exports = router;