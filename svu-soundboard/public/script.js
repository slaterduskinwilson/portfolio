const sounds = ['one', 'two', 'three', 'four', 'five']
//this is just an array of names. we'll stick them to buttons that we're about to create, and then append to our div with the id "buttons"
const characters = ['benson', 'cabot', 'cragen', 'huang', 'ice-t', 'stabler']
//and here's an array with our initial character names

createPlayButtons()

createTallButtons()
// give our tall buttons a background image


//ok, how bout that konami code now?

var pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
var current = 0;



var keyHandler = function (event) {

	// If the key isn't in the pattern, or isn't the current key in the pattern, reset
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}

	// Update how much of the pattern is complete
	current++;

	// If complete, alert and reset
	if (pattern.length === current) {
		current = 0;
		window.alert('YOU ARE... ESPECIALLY HEINOUS! Medical Examiner Dr Melinda Warner would like to have a word with you.')
        document.getElementsByTagName('body')[0].style.backgroundImage = 'url("./images/svu.png")'
        //grab our 'body' element, I guess this is a kind of clunky way to select it, but whatever. getElementsByTagName returns an array-like object, and we want element 0 which is the body

        //then, add warner to the characters array:
        characters.push('warner')
        //then we need to remove our existing tall buttons, so we don't duplicate
        removeTallButtons()
        //and then create the tall buttons again, this time including warner, our "secret character!"
        createTallButtons()
        
	}

};





function createPlayButtons(character = 'stabler') {
    //set up our audio elements and create buttons for them, default speaker is stabler
    sounds.forEach(sound => {
        const btn = document.createElement('button')
        btn.classList.add('btn')
        btn.innerText = sound
        btn.addEventListener('click', () => {
            stopSongs() //stop the currently playing "song"
            document.getElementById(sound).play()
            //play the audio element with the corresponding id

            // play and pause are built into the html/js audio api, so as long as you have an audio element, you can call them
            //our audio elements are present on our HTML page, but they don't display as anything
        })

        document.getElementById('buttons').appendChild(btn)
    })
}

function changeCharacter(event) {
    let audioElements = document.getElementsByTagName('audio')
    audioElements = [...audioElements]
    //spread each audio element on the page into an array
    let characterButtons = [...document.getElementsByClassName('tallbutton')]
    //and do the same with the tall buttons, this time with one less line of code.
    //but with one more line of comment...

    audioElements.forEach((audioElement, index) => {
        audioElement.src = 'sounds/' + event.target.id + '/' + index + '.mp3'
        //set the source of each audio element to the filepath
        // 'sounds/character/index.mp3'
    })

    if (!event.target.classList.contains('hilited')) {
        characterButtons.forEach(button => {
            button.classList.remove('hilited')
        })
        event.target.classList.add('hilited')
        //if the button you clicked isn't highlighted, first remove the hiliting from all the other buttons, then "hilite" the one you clicked
    }
}

function stopSongs() {
    // this function makes it so that if you hit play while another thing is playing, the first thing stops playing!
    sounds.forEach(sound => {
        const song = document.getElementById(sound)
        song.pause()
        song.currentTime = 0
        //pause the "song," and then set it back to the beginning, so if we click it again, it plays from the start

        //currentTime is a property of html audio elements, it's a number in SECONDS (not milliseconds)
    })
}

function createTallButtons() {

    let lineup = document.getElementById('lineup')
    //first, we'll target our #lineup div

    characters.forEach( character => {
        //for each character in the characters array, create a button
       let thisButton = document.createElement('button')
       thisButton.classList.add('tallbutton')
       thisButton.textContent = character
       //now we have a button with the class .tallbutton, with the name of each character
       lineup.appendChild(thisButton)
       //then stick the button to the "lineup" div on our page



    })
    
    let tallButtons = [...document.getElementsByClassName('tallbutton')]
    // we're using the spread operator here to turn the array-like-object which is the html collection into a real array

    tallButtons.forEach((button, index) => {
        button.style.backgroundImage = `url('./images/${characters[index]}.png')`
        // loop through the tallbuttons, and for each one, assign the background image to be the corresponding name in the characters array, but written as though it's a path from the images folder
        button.id = characters[index]
        //set the id of each individual button to be the name of the character at that index

        button.addEventListener('click', changeCharacter)
        //run the changeCharacter function when you click any of these buttons
    })
}

function removeTallButtons() {
    let tallButtons = [...document.getElementsByClassName('tallbutton')]
    tallButtons.forEach( button => button.remove())
    //spread all of the tall buttons into an array, then iterate through that array and remove each one!
}


// Listen for keydown events
document.addEventListener('keydown', keyHandler, false);

