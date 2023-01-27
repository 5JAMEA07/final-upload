const User = require('../models/User');
const bcrypt = require('bcrypt');
 
exports.login = async (req, res) => {
    try {
        
        if (req.body.username == "admin" && req.body.password == "admin"){
            const user = new User({ username: req.body.username, password: req.body.password, balance: 10000000, type_of_user: "admin" });
            global.user = user
            req.session.userID = 1;
            res.redirect('/')
            return
        }
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.render('login', { _pageName: "login", errors: { message: 'Email not found' }, message: null })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/')
            return
        }

        res.render('login', { _pageName: "login", errors: { message: 'Incorrect Password' }, message: null })


    } catch (e) {
        console.log("Error");
        console.log(e);
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.register = async (req, res) => {
    try {
        if(req.body.confirm_password == req.body.password){
            const user = new User({ username: req.body.username, password: req.body.password, balance: req.body.balance });
            await user.save();
            req.session.userID = user._id;
            res.redirect('/')
        }
        else{
            console.log("Passwords don't match");
            res.render('register', { _pageName: "register", errors: { message: "passwords don't match" }});
        }
    } catch (e) {
        console.log("error: ---")
        console.log(e);
        if (e.error || e.errors) {
            console.log("mongoose error");
            res.render('register', { _pageName: "register", errors: e.error || e.errors || e.MongoError})
            return;
        }
        else if((e.name==='MongoError' || e.name ==='MongoServerError') && e.code === 11000 ){
            res.render('register', { _pageName: "register", errors: {message: "Duplicate Email Error"}})
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.allUser = async(req, res) => {
    try{
        const user_list = await User.find({});
        res.render('viewAllUser', {users: user_list})
    }catch(e){
        res.status(404).send({message: "could not list users"});
    }
}

exports.update = async(req, res) => {
    try{
        id = req.body.id
        newBalance = req.body.newBalance
        console.log(id, newBalance)
        await User.findByIdAndUpdate(id, { $set: { balance: newBalance } }, { new: true, runValidators: true });
        
        res.redirect('/allUsers')
        
    }catch(e){
        res.status(404).send({message: "could not list users"});
    }
}

exports.delete = async(req, res) => {
    try{
        id = req.body.id
        await User.findByIdAndRemove(id);
        
        res.redirect('/allUsers')
        
    }catch(e){
        res.status(404).send({message: e});
    }
}

