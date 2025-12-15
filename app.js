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

// authenticate or login
// post requst - reason why is because when you login you are creating what we call a new "session"
router.post('/auth', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
        return 
    }
    // try to find the username in the database, then see if it matches with a username and password
    // await finding a user
    let user = await User.findOne({ username: req.body.username })   // FIX #1: removed callback

    // connection or server error
    if (!user) {
        res.status(401).json({ error: "Bad username"})
    }
    // check to see if the users password matches the requests password
    else {
        if (user.password !== req.body.password) {                   // FIX #2: corrected comparison
            res.status(401).json({ error: "Bad password"})
        }
        // successful login
        else {
            // create a token and send it back to the user
            // we also will send back as part of the token that you are authorized
            // we could be this with a boolean or a number value
            // auth = 0, you are not authorized, auth = 1, you are authorized

            username2 = user.username
            const token = jwt.encode({ username: user.username}, secret)
            const auth = 1

            // respond with the token
            res.json({
                username2,
                token: token,
                auth: auth
            })
        }
    }
})

// check status of user with a valid token
router.get("/status", async (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth"})
    }
    
    // if x-auth contains the token (it should)
    const token = req.headers["x-auth"]
    try {
        const decoded = jwt.decode(token, secret)

        // send back all username and status fields to the user or front end
        let users = await User.find({}, "username status")
        res.json(users)
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid jwt token"})
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

async function createSeedUser() {
    const existing = await User.findOne({ username: "admin" });

    if (!existing) {
        await User.create({
            username: "timscott",
            password: "booya",
            status: 1
        });
    }
}

// runs when server starts
createSeedUser();

// start the server
app.listen(3000);