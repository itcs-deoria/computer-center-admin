const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.locals.formatDate = app.locals.formatDate;
  next();
});

app.locals.formatDate = function (date) {
  if (!date) return '';
  return new Date(date)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
    .replace(/ /g, '-');
};
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
);
app.use('/fees', require('./routes/fees'));
app.use('/student', require('./routes/studentPortal'));
app.use('/', require('./routes/admin'));
app.use('/students', require('./routes/students'));
app.use('/courses', require('./routes/courses'));

app.get('/', (req, res) => res.redirect('/login'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
