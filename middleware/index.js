var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// middlewareObj.passwordValidate = function validatePassword(){
// 		var password = document.getElementById("txtPassword")
//   , confirm_password = document.getElementById("txtConfirmPassword");

//   if(password.value != confirm_password.value) {
//     confirm_password.setCustomValidity("aksljdfalskdjf");
//   } else {
//     confirm_password.setCustomValidity('');
//   }
// }

// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
          console.log(err);
          req.flash('error', 'Sorry, that campground does not exist!');
          res.redirect('/campgrounds');
      } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
          req.campground = foundCampground;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/campgrounds/' + req.params.id);
      }
    });
  }



middlewareObj.checkCommentOwner = function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  }

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
}

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.comments.some(function (comment) {
                    return comment.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review. Try updating your comment instead!");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;