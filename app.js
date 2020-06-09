var express    = require("express"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	passport   = require("passport"),
	flash      = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User 	   = require("./models/user"),
	seedDB     = require("./seeds"),
	methodOverride = require("method-override");
	
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

//seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp_v2", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(require("express-session")({
	secret:"god I love pizza so god damn much",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("YelpCamp listening on port 3000");
});