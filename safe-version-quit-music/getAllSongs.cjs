//here's where we'll set up MONGOOSE!

async function getAllSongs(array) {

    
const mongoose = require('mongoose')
const SongModel = require('./songModel.cjs')


// await SongModel.updateMany({}, {deleted: false})
//the above line is how i reset the deleted flag for my entire collection. nifty!


SongModel.find({deleted: false}, function (err, data) {
    if (err) {
        console.log(err)
    } else {
        for (const item of data) {
            //then, let's try to get a signed url for each song cloudFilePath:

            async function generateV4ReadSignedUrl() {
                // These options will allow temporary read access to the file
                const options = {
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 60 * 60 * 1000 // 60 minutes
                }

                // Get a v4 signed URL for reading the file
                const [url] = await storage
                    .bucket(quitMusic)
                    .file(item.cloudFileName)
                    .getSignedUrl(options)

                item.signedUrl = url
                //this is a lean query, so we can add a property to the items it returns
                array.push(item)
                //then we'll push each item into our fuckItPlaylist array, where we can now get at its url!
            }

            generateV4ReadSignedUrl().catch(console.error)
        }
    }
}).lean()
//soooo.... if you use find().lean() it'll return a "leaner", actual Javascript object, as opposed to an item of the Mongoose Document class! wow!

const quitMusic = 'quit-music'
//this is the bucket name

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
// just created a client! this must be where the async keyword lives, since we use await just below
const bucket = storage.bucket('quit-music')

const [files] = await storage.bucket(quitMusic).getFiles()

}

module.exports = getAllSongs