var express	   = require('express'),
	router     = express.Router(),
  	passport   = require('passport'),
	User       = require('../models/user');


//Root Route
router.get('/', function(req,res){
	res.render('landing')
})

// Register Form
router.get('/register', function(req,res){
	res.render('register');
})

//Sign Up Logic
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to Yelpcamp ' + user.username)
			res.redirect('/campgrounds');
		})
	})
})

//Logic Form
router.get('/login', function(req, res){
	res.render('login')
})

//Login Logic
router.post('/login', passport.authenticate('local',{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), function(req,res){
})

//Logout Route
router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'You logged out')
	res.redirect('/campgrounds');
})

module.exports= router;