var express                = require('express'),
    app                    = express(),
    passport               = require("passport"),
    bodyParser             = require("body-parser"),
     mongoose              = require('mongoose'),
     User                  = require("./models/user"),
     LocalStrategy         = require("passport-local"),
     passportLocalMongoose = require("passport-local-mongoose")



     app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/auth_demo_app',  { useUnifiedTopology: true } ); 
app.use(require("express-session")({
    secret: "Rusty is a weird name for a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/register", function(req, res){

    res.render("register");
});
app.post("/register", function(req, res){
   
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }    
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
app.get("/login", function(req, res){
   res.render("login");
    
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});

//LOGOUT ROUTES
app.get("/logout", function(req, res){
    
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT||3000, function(){
    console.log("The  Server has started");
});
