import { createRequire } from 'module'
const require = createRequire(import.meta.url)
//added this line from stackOverflow, to try and enable require AND import. I had to go into my package.json and add "type": "module" which enabled IMPORT but broke REQUIRE, now it all seems in order...

require('dotenv').config()
//now we can bury our secrets in process.env

const mongoose = require('mongoose')
const SongModel = require('./songModel.cjs')

const logger = require('morgan')
const chalk = require('chalk')
const express = require('express')
const fileUpload = require('express-fileupload')
//new NPM package! apparently it makes uploading files easier?
const session = require('express-session')
const { nanoid } = require('nanoid')
//nanoid generates unique ids! unfortunately, since we can't query Google Cloud by metadata... we're not using this feature currently

const passport = require('passport')
require('./auth.cjs')
//use our auth.js file. we dont need to use it as a variable, which is why we haven't put const auth = require('./auth')

function isLoggedIn(req, res, next) {
    //checking to see if the user is logged in. this is a middleware function, so it takes a request, a response, and a next to pass it along....
    req.user ? next() : res.sendStatus(401)
    //if the request has a user, bring it to the next point, otherwise send a 401 status code!
    //"the client request has not been completed because it lacks valid authentication credentials for the requested resource"
}

const app = express()
app.use(logger('dev'))
app.use(express.static('./public'))
app.use(
    session({
        secret: process.env.EXPRESS_SECRET, //secret has now been committed to an environment variable
        resave: false,
        saveUninitialized: true
    })
)
//check out the documentation at https://www.npmjs.com/package/express-session before deploying, secure cookies are a thing etc etc

app.use(
    express.urlencoded({
        extended: true
    })
) //if we comment out this section, we can't send a req.body to our server through our form....

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
//added this line per documentation on NPM website

app.get('/', (req, res) => {
    res.send(
        '<h1><a href="/auth/google">Authenticate with that creepy global behemoth inflicted upon us by Stanford University!</a></h1>'
    )
    //if the user isn't logged in, send them to the google login page
})

app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/auth/failure'
        //if login success, take the user to our homepage! if failure, we just set a up a route to handle it
    })
)

app.get('/auth/failure', (req, res) => {
    res.send('you failed to log in...')
})

app.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    //get rid of the logged in cookie info
    res.send('Smell ya later!')
})

app.get('/home', isLoggedIn, async (req, res) => {
    //add
    //we need to wrap this route function in ASYNC, because we have asyncronous mongoose calls that need to resolve before we pass our data to the html

    const fuckItPlaylist = []

    const getAllSongs = require('./getAllSongs.cjs')(fuckItPlaylist)
    //require IS a function, so we need to run it right out the gate, passing in our empty array, which this function will populate. This is why we need to define the fuckItPlaylist array in THIS scope, as opposed to in the module file!

    const superheroes = await SongModel.find()
        .distinct('superhero')
        .then(results => results)
        .catch(err => console.error(err))

    const planets = await SongModel.find()
        .distinct('planet')
        .then(results => results)
        .catch(err => console.error(err))

    const beatles = await SongModel.find()
        .distinct('beatle')
        .then(results => results)
        .catch(err => console.error(err))

    const artifacts = await SongModel.find()
        .distinct('artifact')
        .then(results => results)
        .catch(err => console.error(err))

    res.render('fake.ejs', {
        songs: fuckItPlaylist,
        planets: planets,
        superheroes: superheroes,
        beatles: beatles,
        artifacts: artifacts
    })
})

app.get('/search', isLoggedIn, async (req, res) => {
    // console.log(req.query.search)

    const fuckItPlaylist = []
    const getAllSongs = require('./getAllSongs.cjs')(fuckItPlaylist)
    const searchString = req.query.search

    const searchResults = await SongModel.find({
        title: { $regex: `${searchString}`, $options: 'i' }
    }) //we could've done toLowerCase(), but this basically means 'find song titles, case insensitive, that include the search string'
        //    .then (results => console.log('mongo search results ', results))
        //this is an array of objects from mongo db, there's a CLOUD FILE NAME, which is the field that we use to look up our google cloud file
        .then(results => results)
        .catch(err => console.error(err))

    //we need....
    //to filter our fuckItPlaylist array down to only entries where the TITLE attribute is contained in TITLE attributes in searchResults

    const arrayOfCloudFileNames = await searchResults.map(
        searchResult => searchResult.cloudFileName
    )
    //now we have an array of the cloud file names that fit our search string!

    const filteredPlaylist = await fuckItPlaylist.filter(item =>
        arrayOfCloudFileNames.includes(item.cloudFileName)
    )
    //we only want the items in fuckItPlaylist where their cloudFileName is included in our array of cloudFileNames that satisfy our search criteria

    await res.render('results.ejs', { songs: filteredPlaylist })
})

app.get('/filter', isLoggedIn, async (req, res) => {
    const fuckItPlaylist = []
    const getAllSongs = require('./getAllSongs.cjs')(fuckItPlaylist)
    //get all the songs and put em in our standard playlist, and then we can filter them

    let filterkey = Object.keys(req.query)[0]
    let value = Object.values(req.query)[0]

    //we should add isLoggedIn to this route when we're done testing

    const filterdata = await SongModel.find({ [`${filterkey}`]: `${value}` })
        //the dumb brackets around filterkey is known as a COMPUTED PROPERTY, think about how if you want to access a property of an object using a variable, it has to go in quotes inside a bracket... this is that same dealie

        .then(results => results)
        .catch(err => console.error(err))

    // await console.log(`heres our filter data: ${filterdata}`)

    // const data = [...filterdata]
    //turn that filter data object into an array

    const filteredPlaylist = fuckItPlaylist.filter(
        song => song[filterkey] == value
    )
    //filter our playlist by the search condition, so we only pass down those songs

    res.render('results.ejs', {
        //key: filterkey,
        //data: data,
        songs: filteredPlaylist
    })
    //we're passing down the key we're filtering by (superhero, beatle, etc), as well as the data we got back... and of course our playlist object so we can get at those sweet sweet signed urls
})

//here's the C in CRUD:
app.post('/upload', isLoggedIn, async (req, res) => {
    // const SongModel = require('./songModel.cjs')
    const { Storage } = require('@google-cloud/storage')
    const storage = new Storage()
    // just created a client! this must be where the async keyword lives, since we use await just below
    const bucket = storage.bucket('quit-music')

    if (!req.files) {
        return res
            .status(400)
            .send("Nah dude, didn't upload that file for whatever reason")
    }
    // console.log(req.files.myfile)
    // OK! WE CAN SEE THE FILE OBJECT!

    const thisFile = req.files.myfile.tempFilePath

    //YES! THIS WORKS!
    //i'm able to upload this file to the bucket, but i still need to specify its name and also that it's an mp3

    //set file options:
    const options = {
        // destination: req.body.songname.toLowerCase() + '.mp3'
        destination: nanoid() + '.mp3',
        //we'll use nanoid to get a unique character string, so we don't accidentally double up on file names in google cloud!

        metadata: {
            //we'll add the song title to our cloudbucket file's metadata, so when we're looking in our bucket we dont JUST see the nanoid string
            metadata: {
                title: req.body.songname
            }
        }
    }

    bucket.upload(thisFile, options, function (err, file) {
        console.log('heyoooo, just uploaded ', req.body)
    })

    let thisSong = new SongModel({
        title: req.body.songname,
        superhero: req.body.superhero,
        planet: req.body.planet,
        beatle: req.body.beatle,
        artifact: req.body.artifact,
        cloudFileName: options.destination //i think this is is an alright way to get the filename
    })

    thisSong.save(async (err, data) => {
        console.log(
            err ? `Oopsie! ${err}` : `Success! Here's your song: ${await data}`
        )
    })

    await res.redirect('/home')
})

//here's the D:

app.post('/delete', isLoggedIn, async (req, res) => {
    async function deleteFile(file) {
        //this function just sets a document's "deleted" field to true! Then we'll just make it so "deleted" documents don't get scooped up into our playlist when we load the app
        const mongoose = require('mongoose')
        const SongModel = require('./songModel.cjs')
        await SongModel.findOneAndUpdate(
            { cloudFileName: file },
            { deleted: true }
        )
    }
    deleteFile(req.body.delete).catch(err => console.log(err))

    await res.redirect('/home')
})

//below is how we'd actually delete something from our cloud storage bucket, if we wanted to:

// async function deleteFile() {
//     await storage.bucket(quitMusic).file(fileName).delete()
//     console.log(`deleted ${fileName}!!!!!`)
// }
// deleteFile().catch(console.error)
//delete the file whose name comes from the hidden input that we added to the form with the id "updater-form". That input has a name of "fileName", and it should be passed as req.body.fileName!

//HOORAY IT WORKS!

//aaaand here's the U in crud:
app.post('/update', isLoggedIn, async (req, res) => {
    //update code goes here
    console.log('check out req.body: ', req.body)

    let filter = {
        cloudFileName: req.body.cloudFileName
    }

    let updateKey = req.body.dataType
    let updateValue = req.body.dataValue

    let update = {
        [`${updateKey}`]: updateValue
    }


    let document = await SongModel.findOneAndUpdate(filter, update).catch(err =>
        console.error(err)
    )

    await console.log(
        `you changed the data! look at your document now: ${document}`
    )

    await res.render('success.ejs', {
        document: document,
        newKey: updateKey,
        newValue: updateValue
    })
})

const PORT = process.env.PORT || 3000
app.listen(3000, () => {
    console.log(
        chalk.magentaBright(
            `The app is listening on ${chalk.greenBright(PORT)}`
        )
    )
})
