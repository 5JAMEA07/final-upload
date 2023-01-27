require('dotenv').config();
const path = require("path");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require('./models/User');
app.set('view engine', 'ejs');

const userController = require("./controllers/users");
const songController = require("./controllers/song");

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/hitastic', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log("We're connected to the hitastic database!")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession({ secret: 'advassessment', cookie: { expires: new Date(253402300000000) } }))

global.user = false;

app.use("*", async (req, res, next) => {
    if (req.session.userID && !global.user) {
      const user = await User.findById(req.session.userID);
      global.user = user;
    }
    next();
})

const authMiddleware = async (req, res, next) => {
    if (!global.user || global.user.username != "admin") {
        return res.redirect('/login');
    };
    next()
}

app.get('/', (req, res) => {
    res.render('index', { title: 'My App' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'My App' });
});
app.post("/login", userController.login);

app.get('/register', (req, res) => {
    res.render("register", {errors: {} });
});
app.post("/register", userController.register);

app.get("/songs", songController.allSongs);


app.get("/allUsers", authMiddleware, userController.allUser);

app.post('/editUserDetails', authMiddleware, (req, res) => {
    id = req.body.id
    username = req.body.updateUsername
    balance = req.body.updatePrice

    res.render('editUserDetails', {username:username, balance:balance, id:id});
});

app.post('/updateBalance', authMiddleware, userController.update);
app.post("/delete", authMiddleware, userController.delete);

app.get('/addSong', authMiddleware, (req, res) => {
    res.render('addSong');
});
app.post("/addSong", authMiddleware, songController.add);

app.post('/logout', (req, res) => {
    req.session.destroy();
    global.user = false;
    res.redirect('/')
}) 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
