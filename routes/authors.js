const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const app = express();
const LocalStrategry = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(require('express-session')({
    secret: 'Any normal Word',
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategry(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

// Login Route
router.get('/login', async(req, res) => {
    res.render('patient/auth/login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/userprofile',
    failureRedirect: '/auth/login'
}), function(req, res) {
    console.log('Login Success');
});

router.get('/register', (req, res) => {
    res.render('patient/auth/register');
});
router.post('/register', (req, res) => {

    console.log('Regiater DATA')
    console.log(req.body.username, req.body.phone, req.body.telephone, req.body.password);

    User.register(new User({
        username: req.body.username,
        phone: req.body.phone,
        telephone: req.body.telephone,
        password: req.body.password
    }), function(err, user) {
        if (err) {
            console.log(err);
            res.render('patient/auth/register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/auth/login');
        })
    })
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router