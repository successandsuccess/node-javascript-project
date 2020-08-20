const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log('Calling Home page')
    res.render('patient/home');
})

router.get('/userprofile', isLoggedIn, (req, res) => {
    res.render('userProfile');
});

function isLoggedIn(req, res, next) {
    console.log("Is Logged In Called")
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;