const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const confKeys = require('./config/keys');
const passport = require('passport');
var createError = require('createerror');
var MyError = createError({
  name: 'MyError',
  // Used when no message is handed to the constructor:
  message: 'A slightly longer description of the error'
});
// Express Route
const studentRoute = require('../backend/routes/student.route')
const auth = require('../backend/routes/auth.route')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(confKeys.db, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true 
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/students', studentRoute)
app.use('/api/auth', auth)


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
  console.log()
  if (req.status === 404) {
      return res.status(400).send('404');
  }

  if (req.status === 500) {
      return res.status(500).send('500');
  }

 next();
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
