HELLO!

This app is an mp3 player. It pulls audio files from a Google Cloud database, displays a playlist of available songs, and allows the user to change each song's metadata. The user can also add new songs, and delete existing ones. 

It's designed to be used by bands who are developing and recording their own music, to share between members of the ensemble as they're working.

The "Metadata" we're using are 4 totally arbitrary fields: Superhero, Planet, Beatle, and Artifact. The idea was to add some creative "on-the-fly" categorization for home recordings: situations in which the traditional "Artist," "Title," and "Album" aren't very helpful. In fact, they can be a little bit hurtful. The last thing you should be deciding when you're in the midst of the creative process is the title of the album that may or may not come out if you ever finish, and if you're workshopping a song called "I Want To Hold Your Hand"... you may soon wind up with 100 different songs called "I Want To Hold Your Hand 1" and "I Want To Hold Your Hand 2" etc. Similarly, the "Artist" would be the same every time. 


My idea was to be able to query the database by metadata fields. Unfortunately, I was midway through the project when I realized that there's no way to query the Google Cloud database by anything other than file name. So at this point, the metadata fields are for demonstration purposes. Each field can be edited using the updatesongs.ejs script. 



APP STRUCTURE: 

app.js - this is our backend, where our CRUD routes live. Once the user is authenticated, visiting the "/home" route pulls the list of playable songs from Google Cloud, and generates a "Signed URL" for each one. This url is good for 15 minutes and allows anyone with the link to play that song. The playable songs are objects with various data properties, the signed url is appended to each object under the key "yourSecretUrl." Then these objects are collected into an array and passed to the front end. The front end creates a single html audio element, whose source can be changed. When the user tells the app to play a specific song, the app locates the signed url property of that song object, and sets that url as the audio element's source. 

auth.cjs - user authorization logic. users long in with Google OAuth. I used Passport. 

home.ejs - this is our single, main page. 

head.ejs/foot.ejs - our header and footer for the main page. (foot.ejs contains a script tag with our playerscript inserted inside)

player.ejs - this is our html music player, with the standard PLAY/STOP NEXTTRACK PREVIOUSTRACK VOLUME SEEK transport controls

playerscript.ejs - the javascript logic for player.ejs. When the entire app renders, this script lives between script tags at the bottom of our index.html page. This script creates a single html audio element, and then changes its source attribute when you "load" or "play" different tracks. 

playlist.ejs - a scrollable list of all the playable songs and their metadata, with a button to play each respective song

uploader.ejs - a form with a file input that allows you to upload an mp3 audio file from your local disk and specify the metadata that will be sent with it

updater.ejs - this is a dropdown menu that contains a form that allows you to update the metadata of a song already in the playlist, or delete that song

updatesongs.ejs - a script that contains the actual javascript logic for updating song metadata or deleting the song, as opposed to the html dropdown 


There are still some improvements to be made to this app. The player script can be tweaked to specify asynchronous behavior, for example to make sure that no track duration is displayed until a track is loaded and its duration ascertained (to avoid the brief flash of "NaN" that sometimes happens when you load and play a new track). The UI can be cleaned up a bit (for example: in the update songs dropdown, you need to click the song title itself and not the selection icon), and it would be nice to add a progress bar or some kind of animation during the database calls. I'd also like to add "track art" functionality, as opposed to always displaying that one triumphant photo of actor Christopher Meloni. And then there's the Google Cloud problem... ideally I'd like to make the playlist queryable by any of the metadata fields. This would seemingly require changing the database I'm using, as well as implementing a search bar or drop-down filters. As it is, the app queries the database and displays all the datafields when it loads, which works fine for a small playlist, but I'm going to look into hosting the database somewhere else. Lastly, the app doesn't refresh when you update the database: so if you add or delete a bunch of songs or change anything's name... you need to restart the server in order to see any of these changes. I'm going to look into rebuilding the entire thing in React, knowing what I know now, and see if I can't make it faster/sleeker/cleaner/better. 


Thanks for all your help. It's been a great class. 
-Matt Wilson


