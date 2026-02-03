const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  

app.use(session({
  secret: 'superSecretKey',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "x", resave: false, saveUninitialized: true }));

app.use(express.static(path.join(__dirname, 'public')));

const ceremonyRoutes = require("./routes/ceremonyRoutes");

// ...
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// make sure session is configured and attendeeId is set on login/register
app.use(ceremonyRoutes);

app.use('/', require('./routes/auth'));       
app.use('/', require('./routes/index'));      
app.use('/', require('./routes/dashboard'));  
app.use('/', require('./routes/expenses'));   
app.use('/', require('./routes/bills'));      
app.use('/', require('./routes/categories')); 
app.use('/', require('./routes/reports'));    
app.use( require('./routes/profile'));


app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
