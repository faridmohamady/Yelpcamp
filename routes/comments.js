var express	= require('express'),
	router = express.Router({mergeParams: true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware')

//Comment New
router.get('/new', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render('comments/new', {campground: campground})
		}
	})
})

//Comment Create
router.post('/', middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Something went wrong!')
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'successfully added comment')
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	})	
})

//Edit Route
router.get('/:cm/edit', middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.cm, function(err, foundComment){
		if(err){
			res.redirect('back')
		}else{
			res.render('comments/edit', {comment: foundComment, campground_id:req.params.id});
			}
	})
		
})

//Update Route
router.put('/:cm', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.cm, req.body.comment , function(err, 
																		  updatedComment){
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

// Delete Route

router.delete('/:cm', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.cm, function(err){
		if(err){
			console.log(err);
		}else{
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})


module.exports= router;