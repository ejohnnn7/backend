const express = require('express');
const Song = require('./models/songs.js');
var cors = require('cors');

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

const router = express.Router();

// grab all the songs in a database
router.get('/songs', async (req, res) => {
    try {
        const songs = await Song.find({})
        res.send(songs)
        console.log(songs)
    }
    catch (err) {
        console.log(err)
    }

})

// Grab a single song in the database
router.get('/songs/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
        res.json(song)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

// add a new song to the database
router.post('/songs', async (req, res) => {
    try {
        const song = await new Song(req.body)
        await song.save()
        res.status(201).json(song)
        console.log(song)
    }
    catch (err) {
        res.status(400).send(err)

    }


})

// update is to update an existing record
router.put("/songs/:id", async(req,res) => {
    try{
        const song = req.body
        await Song.updateOne({ _id: req.params.id }, song)
        console.log(song)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// all requests that usually use an api will start with /api... so the url would be localhost:3000/api/songs
app.use('/api', router);
app.listen(3000);