require('dotenv').config({path: __dirname + '/.env'});
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GEO_KEY,
	formatter: null
}

var geocoder = NodeGeocoder(options);

router.get("/", function(req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
			Campground.find({name: regex}, function(err, allCampgrounds){
			if(err){
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds});	
			}
	});
	} else {
	Campground.find({}).sort({date: -1}).exec(function(err, allCampgrounds){
			if(err){
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds});	
			}
	});
	}
});



router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;	
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			req.flash('error', 'invalid address');
			return res.redirect('back');
		} 
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {name: name, image: image, description: desc, author:author, price: price, location: location, lat:lat, lng: lng};
		Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else {
				console.log("NEW CAMPGROUND ADDED");
				console.log(newlyCreated);
				res.redirect("/campgrounds");
			}
		});
	});
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate({path:"comments", options: {sort: { "createdAt": -1 }}}).exec(function(err, foundCampground, process){
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

//Edit campground route
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res){
  //render edit template with that campground
  res.render("campgrounds/edit", {campground: req.campground});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//destroy router
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;