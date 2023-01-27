const Song = require('../models/Song');
 
exports.add = async (req, res) => {
    try {
        const song = new Song({ title: req.body.title, artist: req.body.artist, quantity: req.body.quantity, price: req.body.price});
        await song.save()
        res.redirect('/songs')
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

exports.allSongs = async(req, res) => {
    try{
        const song_list = await Song.find({});
        res.render('songs', {songs: song_list})
    }catch(e){
        res.status(404).send({message: "could not list books"});
    }
}