var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment   = require('./models/comment')

function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
	})
}
module.exports = seedDB;