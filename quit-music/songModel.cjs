//this has our songs schema and model, so we don't have to keep looking at it in our app file

const mongoose = require('mongoose');

const uri = process.env.URI

mongoose
  .connect(uri)
  .then(() => console.log('Connected!'))
  .catch((err) => `Error connecting to db: ${err}`);

  let SongSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "You need to name this masterpiece!"]
    },
    superhero: {
        type: String,
        required: [true, "C'mon, any superhero at all. Marvel? DC? Sports? Political?"]

    },
    planet: {
        type: String,
        required: [true, "You need to specify a planet that this music is from. Could be any planet, real, fictitious, or Pluto."]

    },

    beatle: {
        type: String,
        required: [true, "Specify a Beatle to associate with this song. Stu Sutcliffe? Pete Best? Brian Epstein? Any of them."]
    },

    artifact: {
        type: String,
        required: [true, "An artifact (or artifact creature). An important object, imbued with magical, cultural, or other significance. The One Ring? Davey Crockett's crock-ring? Doesn't even have to be a ring. Just has to be something. "]
    },

    image: {
        type: String,
    },
    
    created: {
        type: Date,
        default: Date.now()
    },

    cloudFileName: {
        type: String,
        required: [true, "We need to associate this Mongo data with a file name in Google Cloud, please try again"]
    },

    deleted: {
        type: Boolean,
        default: false
    }

    

  })
  

  SongSchema.index({title: 1, superhero: 1, planet: 1, beatle: 1, artifact: 1, cloudFileName: 1}

  )

const SongModel = mongoose.model('songs', SongSchema)

module.exports = SongModel
