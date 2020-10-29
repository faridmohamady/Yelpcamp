var express	= require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware')

//Index Route
router.get('/', function(req,res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/index', {campgrounds:campgrounds})
		}
	})
})

 // new route
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new')
})

// create Route
router.post('/', middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price:price, image: image, description:description, author: author};
	Campground.create(newCampground, function(err, newCreated){
		if(err){
			console.log(err)
		}else{
			res.redirect('/campgrounds')
		}
	})
})


// show
router.get('/:id', function(req, res){
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/show', {campground:foundCampground});
		}
	})
})

//Edit Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/edit', {campground:foundCampground});
		}
	})})

// Update Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, editedCampground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds')
		}else{
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

// Destroy Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect('/campgrounds');
		}
	})
})



module.exports= router;