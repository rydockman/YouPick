const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session')

const mongoDB = 'mongodb+srv://desaidn:Familyisslife22@cluster0.btqa2.mongodb.net/Cluster0?retryWrites=true&w=majority';
const app = express()

const api = require('./api')
const passport = require("./api/passport/setup")

require('dotenv').config();

const port = process.env.PORT || 8000

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['somesupersecurekeyillfigureoutlater']
}))

app.use(passport.initialize());
app.use(passport.session());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use('/api', api)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});