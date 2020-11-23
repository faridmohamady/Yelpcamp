var express    				= require('express'),
    app        				= module.exports = express(),
    bodyParser 				= require('body-parser'),
    mongoose   				= require('mongoose'),
	flash                   = require('connect-flash'),
	methodOverride          = require('method-override'),
    Campground 				= require('./models/campground.js'),
	passport			 	= require('passport'),
	localStrategy 			= require('passport-local'),
	passportLocalMongoose 	= require('passport-local-mongoose'),
	User                    = require('./models/user'),
	Comment    				= require('./models/comment'),
	// seedDB     				= require('./seed'),
	indexRoutes             = require('./routes/index'),
	campgroundRoutes        = require('./routes/campgrounds'),
	commentRoutes           = require('./routes/comments');


// seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb+srv://farid:1234@cluster0.d78e3.gcp.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(express.static('public'));
app.locals.moment = require('moment');
mongoose.set('useFindAndModify', false);

app.use(methodOverride('_method'));

app.use(require('express-session')({
	secret: 'anything can be here!!',
	resave: false,
	saveUninitialized: false
}))
app.use(flash());

// passport config
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
	res.locals.currentUser = req.user
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	next();
})
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// requiring routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes)

app.listen(process.env.PORT, process.env.IP, function(){
	console.log('yelpCamp Server started')
});