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

module.exports = middlewareObj;