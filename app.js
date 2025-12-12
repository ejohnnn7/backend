const express = require('express');
const Song = require('./models/songs.js');
var cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');
const User = require('./models/users.js');

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

const router = express.Router();
const secret = "supersecret"

// creating a new user
router.post('/users', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status

    })

    try {
        await newUser.save()
        res.status(201) // created
    }
    catch (err) {
        res.status(400).send(err)
    }
})

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

router.delete('/songs/:id', async (req, res) => {
    // method or function in mongoose/mongo to delete a single instance of a song or object
    try {
        const song = await Song.findById(req.params.id)
        console.log(song)
        await Song.deleteOne({ _id: req.params.id })
        res.sendStatus(204)
    }

    catch (err) {
        res.status(400).send(err)
    }
})

// all requests that usually use an api will start with /api... so the url would be localhost:3000/api/songs
app.use('/api', router);
app.listen(3000);