require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
const cors       = require('cors')
const path       = require("path")


mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://rentit-project.herokuapp.com'],
    credentials: true
  })
)
app.use(express.static(path.join(__dirname, 'public')))

// Enable authentication using session + passport
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
app.use(flash());
require('./passport')(app);

app.use('/api/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/product', require('./routes/product'));
app.use('/api/rent', require('./routes/rent'));
app.use('/api/question', require('./routes/question'));
app.use('/api/review', require('./routes/review'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

module.exports = app;