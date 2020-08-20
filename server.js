if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    console.log('development')
}
console.log(process.env.DATABASE_URL);
const express = require('express')
const app = express()
    // const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const path = require('path');

app.use(require('express-session')({
    secret: "Any normal Word",
    resave: false,
    saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

// View Setting
// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views',
    path.join(__dirname, 'views/'),
);

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(passport.initialize());
app.use(passport.session());
// app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/auth', authorRouter);

app.listen(process.env.PORT || 3000, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server Started At Port ${process.env.PORT}`)
    }
});