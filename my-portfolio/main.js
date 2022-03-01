// https://www.youtube.com/watch?v=YK1Sw_hnm58

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// console.log(GLTFLoader)
import * as dat from 'dat.gui'
import gsap from 'gsap'

const gui = new dat.GUI()
const world = {
    plane: {
        width: 86,
        height: 292,
        widthSegments: 200,
        heightSegments: 150
    },

    colors: {
        shape: '#92a32b',
        hover: '#1AE0C8',
        trail: '#ff0067'
    }
}

let currentTheme = 0

const themes = [
    {
        shape: '#92a32b',
        hover: '#1AE0C8',
        trail: '#ff0067'
    },

    { shape: '#2672e8', hover: '#4bd9ef', trail: '#adadad' },

    { shape: '#fdfffb', hover: '#f9e842', trail: '#6b0091' },

    { shape: '#a32b64', hover: '#ebed44', trail: '#56f4ff' }
]

let currentMove = 0
//we need to remember to increment our index AFTER we've animated, so we don't skip the first move in the list

const cameraMoves = [
    {
        position: {
            x: 0.01 , y: -101.51, z: -21.15
        },
        rotation: {
            x: 1.79,
            y: 0,
            z: -3.14
        }
    },
    {
        position: {
            x: -0.5,
            y: 4,
            z: -53
        },
        rotation: {
            x: 3.11,
            y: 0,
            z: -3.14
        }
    },
    //x: 0.006639061713842827 , y: -76.84965623151145, z: -13.335661962538065
   
    {
        position: {
            x: 16.25,
            y: 10,
            z: -8.3
        },
        rotation: {
            x: 3.03,
            y: 1.092,
            z: 3.049
        }
    },

    {
        position: {
            x: 0.00156,
            y: -12,
            z: -3.013
        },
        rotation: {
            x: 1.736,
            y: 0,
            z: -3.14
        }
    },

    {
        position: {
            x: -0.04301093802784941 , y: 28.448426915157665, z: -7.447806296223387
        },
        rotation: {
            x: -1.8435210815291905, y: -0.0015555272486780874, z: -3.1360311770623106
        }
    }
]

//gui.add takes 4 arguments: the object you're manipulating, the property of that object you're manipulating, and the min and max values you want to put on the manipulation slider!
gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
//we've abstracted our long-ass height/width change duplicate code into one function: generatePlane, defined below!
gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 200).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 200).onChange(generatePlane)
// gui.add(world.plane, 'red', 0, 1).onChange(generatePlane)

gui.addColor(world.colors, 'shape').name('shape color').onChange(generatePlane)
gui.addColor(world.colors, 'hover').name('hover color').onChange(generatePlane)
gui.addColor(world.colors, 'trail').name('trail color').onChange(generatePlane)

function generatePlane() {
    mesh.geometry.dispose()
    //dispose excises that mesh geometry from our scene, just gets rid of it
    mesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    )
    //now, when we change that 'width' slider, we scuttle the old mesh geometry and create a new one, using the value of the width slider as the new geometry's width!

    //BEGIN PASTE

    //VERTEX POSITION RANDOMIZATION:
    const { array } = mesh.geometry.attributes.position
    //let's destructure that long-ass object, so we can pass it into a for loop much cleaner! (more cleanly? cleanlier?)

    //we're gonna create a buffer, aka geometry info stored in an array, that's going to represent our randomization of vertex values that we'll animate with a cosine function below. Heyo.
    const randomValues = []

    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
            //we changed our incrementation from i+=3 to i++, so we could get a full set of random values. We're adding this if condition so that we only update our array position in groupings of 3. Make sense? If the iterator divided by 3 has no remainder, that's the same thing as increasing the iterator by 3 loop
            const x = array[i]
            const y = array[i + 1]
            const z = array[i + 2]
            //on each iteration of the loop, we set x, y, and z to be the first, second, and third elements. Then we increment our index by 3, which takes us to the next x value, and so on. Make sense? Yes? Good.
            // console.log(x, y, z)

            array[i] = x + (Math.random() - 0.5) * 3
            //this is how we manipulate the x values of our vertices. Think about it: Math.random() returns a number between 0 and 1. If we subtract 0.5 from any value in that range, we're left with a number between positive and negative 0.5. If we want a bigger range of numbers than that, we just multiply that expression by a larger number... which gives us a "more negative" number on one end, and a "more positive" number on the other. Math!
            array[i + 1] = y + (Math.random() - 0.5) * 3
            array[i + 2] = z + (Math.random() - 0.5) * 3
            // play around with these z values, think about what values we're returning. If we want z to move in both directions, we'll subtract 0.5 from Math.random(), and if we want more drastic changes in this value, we can multiply this entire thing by a bigger number, e.g (Math.random() -0.5 )  * 3

            //notice how we use array[i + 2] to refer to the z coordinate at that specific iteration, and the constant "z" to refer to that z coordinate's initial value. We do math on that initial value, and then change array[i +2] to that new value!
        }

        //let's try making this movement random over the FULL range of motion for each vertex, as opposed to limiting it to values between 0 and 1. We need to multiply our random amount by twice pi.... which is TAU aka 6.28... Check it:
        randomValues.push(Math.random() * (Math.PI * 2))

        //below is our old randomization code:
        // randomValues.push(Math.random() - 0.5); //this will populate our randomValues array with a bunch of random values, one for each set of x,y,z coordinates in our mesh
        //and subtracting 0.5 from our Math.random() return value gives us a random value between -0.5 and 0.5, remember this cool trick? Yes? Cool!
    }

    // console.log('randomvalues', randomValues);

    //let's create a randomValues property on our position object!
    mesh.geometry.attributes.position.randomValues = randomValues
    //let's create a new property of our mesh position object, so we can reference the original position of this object and animate from there!
    mesh.geometry.attributes.position.originalPosition =
        mesh.geometry.attributes.position.array

    // console.log('mesh position: ', mesh.geometry.attributes.position)

    //END PASTE

    //NOW, FOR THE COLORCHANGEY:
    // we're going to set each individual vertex to a specific color, thereby coloring the whole shape (instead of setting the color when we define our meshphongmaterial), and then we can change the color of individual vertices when we point the raycaster at them aka hover over them!
    //ADDING COLOR ATTRIBUTE:
    const colors = []

    const newColor = new THREE.Color(world.colors.shape)
    //make a new color from our dat.gui color picker

    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
        // colors.push(world.plane.red, world.plane.green, world.plane.blue)
        colors.push(newColor.r, newColor.g, newColor.b)
        //pull in the color values from dat.gui color picker. The value of this field is an object with r/g/b values!
    }

    // console.log(mesh.geometry.attributes)
    //check out the attributes of our mesh geometry: they're Float32BufferAttributes, that contain Float32Arrays. Which is to say... they contain typed arrays, where the data type is 32-bit-floating-point-numbers

    mesh.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    )
    //ok, this is confusing.... but: the first argument in new Float32Array is an untyped array, which will be type-converted to a Float32Array, and the second argument refers to the grouping, it's saying "group by 3," or "how many of these array elements consist of one value?" The answer is 3, because we're talking r, g, and b attributes to denote a specific color. OK!

    //note: these rgb values range from 0 to 1, not 0 to 255 like you might expect! unexpected!

    //then, we need to go back to our plane material and set vertexColors to true!
}

//we always need a scene, a camera, and a renderer:
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
)
//FieldOfView in degrees, aspect ratio, near clipping plane, far clpping plane
//we don't need to specify window.innerWidth or window.innerHeight, because we're already working with the window object! cooL!

// const cameraHelper = new THREE.CameraHelper(camera)
// scene.add(cameraHelper)
//this gives us a lil widget to show us where our camera is at

const raycaster = new THREE.Raycaster()
//a raycaster is like... a little laser pointer that's always being pointed at something. We'll move it around with our mouse! WHAT?!

const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
//we don't need to specify window.innerWidth or window.innerHeight, because we're already working with the window object! cooL!
renderer.setPixelRatio(devicePixelRatio)
//setting the pixel ratio reduces the jagged-ness of our 3d shape SIGNIFICANTLY
document.body.appendChild(renderer.domElement)
//we appended a canvas element to the body of our html!

//let's position our camera somewhere cool:
//  { x: 0.058991773097945004, y: -6.384716906143697, z: -3.9242363137500984 }
camera.position.x = 0.0015
camera.position.y = -18
camera.position.z = -3.013

// camera.position.z = 50
//this moves our camera back, so we can see our plane!

//NOTE: calling orbitcontrols before or after creating the camera can sometimes affect how the mesh renders
const controls = new OrbitControls(camera, renderer.domElement)
//we've instatiated an OrbitControls object, which takes a camera and a renderer argument. Now, when we drag around on our screen, we move our camera, so it looks like the plane is rotating! Note: we won't be able to see the back side of this plane unless we put a light source there

// controls.addEventListener('change', event => {
//     console.log('camera position from orbitcontrols: ', controls.object.position)
// }) //this will log our our camera position, whenever we manipulate the orbit controls, so we can plug that value back in wherever we want! YES!

//let's make a PLANET!
// const sphereGeometry = new THREE.SphereGeometry();
// const sphereMaterial = new THREE.MeshPhongMaterial()
// const planet = new THREE.mesh(sphereGeometry, sphereMaterial);
// scene.add(planet)

const jupiterTexture = new THREE.TextureLoader().load('./jupiter.jpg')
// we're also gonna ad  a "normal map", which is a weird colored image that gives the appearance of texture
// const normalTexture = new THREE.TextureLoader().load('../normal.png')
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    new THREE.MeshStandardMaterial({
        map: jupiterTexture
        // normalMap: normalTexture
    })
)
scene.add(jupiter)
// jupiter.position.z = 30
// jupiter.position.setX(-10)
jupiter.position.setY(40)
jupiter.position.setZ(-5)
jupiter.position.setX(-22)
jupiter.rotateX(-1.6)
//yo, rotation is in radians!
jupiter.rotateZ(0.75)
jupiter.rotateY(-1)

//
//
//

//add the tie fighter!
let tieFighter
//declare it first, so we can assign the loaded object to it

const loader = new GLTFLoader()
loader.load(
    'tieFighter.glb',
    function (gltf) {
        tieFighter = gltf.scene
        scene.add(tieFighter)
        tieFighter.position.setY(60)
        tieFighter.position.setZ(-5)
        tieFighter.position.setX(22)
        tieFighter.rotateX(-1.5)
        tieFighter.rotateY(-2)
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    function (error) {
        console.error(error)
    }
)

const geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
) //width, height, width segments, height segments
//we're creating a plane, and for its dimensions, instead of providing concrete values, we're referencing the values that we're using in our dat.gui interface, all the way up at the top
//so NOW... if we want to change our default plane dimensions, all we have to do is set them in one place: in the plane object which is inside the world object~!

//see: https://threejs.org/docs/index.html#api/en/geometries/PlaneGeometry
const material = new THREE.MeshPhongMaterial({
    // color: 0xffaa11,
    //we commented out the above color, because we're setting our vertex colors below, which interferes with this initial color and we wind up with a weird half-way color. Yeah? Great.
    side: THREE.DoubleSide,
    //by default, the back sides of shapes aren't rendered, in order to save memory. We need to specify that the shape is doublesided if we want the back of the thing to show up when we rotate it!
    flatShading: THREE.FlatShading,
    //flatShading gives us some geometric depth when we start messing with the z vertices below! COOL!
    vertexColors: true
})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
// console.log(mesh)
//if we look inside our mesh object, we can drill down to attributes-> position-> array
//it's a HUGE array. Open [0...99] to see the first 100 elements. These represent the positions of ALL THE VERTICES that make up this plane. 0: first x, 1: first y, 3: first z. Note that each third element in this array has a value of zero, because planes have no depth, so the z value of every vertex is going to be zero! NEAT!

// console.log(mesh.geometry.attributes.position.array)
//this is just drilling down to that specific property discussed above

generatePlane()
//we need to call this function, which sets up our plane according to the dat.gui values AND sets its colors, EVERY time we instantiate our mesh object. So... the above call happens when we load the page, and then it also gets called whenever we change our dat.gui values! Intuitive!

//light takes two arguments: color, intensity (between 0 and 1)
const light = new THREE.DirectionalLight(0xffffff, 1)

//set functions take 3 args: x, y, z
light.position.set(0, -1, 1) //we can change the angle that the light shines down at by setting the y coordinate. y=1 will give us a 45degree angle, as opposed to y=1 which will just be straight down. this will affect our shadows. SICK!

scene.add(light)
//and let's add a helper for this light source, too
// const lightHelper = new THREE.DirectionalLightHelper(light, 1)
// scene.add(lightHelper)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
//this is the light at the BACK of our plane, so we can see this side when we move the camera! alright!
light.position.set(0, 0, -1)
scene.add(backLight)

let frame = 0
//initialize this variable, and then each time we call the animate function, we add to this number to represent which frame we're on

function animate() {
    requestAnimationFrame(animate)
    //this recursive function loops again and again into infity, so the animation never ends!
    renderer.render(scene, camera)
    // mesh.rotation.x += 0.001
    // mesh.rotation.y += 0.006
    raycaster.setFromCamera(mouse, camera)
    //since this is set from camera, when we move our camera with orbit controls, it'll take that into account! so when we hover over an area where the "plane used to be but isn't anymore," it'll no longer count that as intersecting!

    frame += 0.01 //this represents how many times we've called this animate function!

    const { array, originalPosition, randomValues } =
        mesh.geometry.attributes.position
    //destructuring our mesh.geometry.attributes.position object, to more easily work with the properties inside it

    for (let i = 0; i < array.length; i += 3) {
        // //we're gonna loop through the array that contains the vertices that make up the plane's position, and each iteration groups the values by 3 for x, y, and z
        array[i] =
            originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005
        //we're changing each x value in our vertices array... adding the corresponding value from the random values array to the cosine function, and then multiplying that value by 0.01 or 0.001 or whatever, so the movement isn't too drastic!

        //NOTES:
        //array[i] is our x value, remember? array[i+1] would be y, etc

        //Math.cos() is a cosine function, which takes an argument in radians, and will return "pulsing" values between -1 and 1 over time. If we want this periodic value to be smaller (which we do), we can multiply it by a really small number (like 0.01)

        //YO: if we just want our plane to move back and forth, we could use this line of code:
        //array[i] = originalPosition[i] + Math.cos(frame) * 0.01

        //here's where we randomize movement in the y direction! Great!
        array[i + 1] =
            originalPosition[i + 1] +
            Math.sin(frame + randomValues[i + 1]) * 0.005
        //we have to change i to i+1 each time, to get y as opposed to x
        //we're also gonna use a sine function as opposed to cosine. Sine and Cosine work together to give us full circular motion. Try toggling between Math.sin and Math.cos, see how the motion is slightly different. Spicy!
    }

    mesh.geometry.attributes.position.needsUpdate = true //this line updates our shape, redrawing it when its vertex values change!

    const intersects = raycaster.intersectObject(mesh)
    //intersects is... whether or not our raycaster is pointing at our plane
    if (intersects.length > 0) {
        //intersects.length is actually an array, because check it: you could potentially intersect multiple objects
        // console.log(intersects[0].object.geometry.attributes.color)

        const { color } = intersects[0].object.geometry.attributes
        // destructure that whole intersects[0].object.geometry.attributes.color object, so we can actually the fuck read our code

        //vertex 1:
        color.setX(intersects[0].face.a, 0)
        // arguments for setX are: index grouping (which element do you want to set), value you want to set it to
        //and remember, our "x" value here is our "r" value in rgb
        //ok, but WHAT IS FACE?!
        //we're looking at a, b, and c vertex values for the "face" of the 3d shape, so changing the color of the "a" property refers to the first vertex
        color.setY(intersects[0].face.a, 1)
        color.setZ(intersects[0].face.a, 1)

        //vertex 2:
        color.setX(intersects[0].face.b, 0)
        color.setY(intersects[0].face.b, 1)
        color.setZ(intersects[0].face.b, 1)

        //vertex 3:
        color.setX(intersects[0].face.c, 0)
        color.setY(intersects[0].face.c, 1)
        color.setZ(intersects[0].face.c, 1)

        color.needsUpdate = true
        //this tells our object that it needs to update itself based on the new properties we just defined

        //apparently this is the easiest way to change colors on hover. LOOOOOLZ.
        //but yeah, so... we set the color of our shape by changing the color of individual vertices, so when our raycaster intersects with specific faces of our shape, we change the colors of the 3 points associated with that face!

        const initialColor = {
            r: 0.6,
            g: 0.1,
            b: 0.4
        } //these are the initial rgb values of our shape, its initial color!
        //NOTE: if we don't specify world.plane.red/blue/green for these values, then our shape will revert to whatever we specify here when we're no longer hovering. this is... actually a pretty cool effect!

        const hoverColor = new THREE.Color(world.colors.hover)

        const trailColor = new THREE.Color(world.colors.trail)

        // const hoverColor = {
        //     r: world.colors.hover.r,
        //     g: world.colors.hover.g,
        //     b: world.colors.hover.b
        // }
        // console.log('hoverColor ', hoverColor)

        //we'll use the gsap library to animate our hovercolor back to our initial color when we move the mouse away!
        gsap.to(hoverColor, {
            r: trailColor.r,
            g: trailColor.g,
            b: trailColor.b,
            onUpdate: () => {
                //we need to make sure to actually set these vertex colors in our mesh:

                //vertex 1:
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)

                //vertex 2:
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)

                //vertex 3:
                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)

                color.needsUpdate = true

                //YES! AWESOME!
            }
        })
    }

    // JUPITER ANIMATION
    jupiter.position.x += 0.01
    jupiter.position.y -= 0.02
    // jupiter.rotateX(0.002)
    jupiter.rotateY(0.002)

    camera.position.y += 0.01

    // mesh.rotateX(0.00001)

    // console.log(
    //     `camera position x: ${camera.position.x} , y: ${camera.position.y}, z: ${camera.position.z}`
    // )
    // console.log('camera rotation: ', camera.rotation)

    //TIE ANIMATION
    if (tieFighter) {
        //if we've loaded our tie fighter...
        tieFighter.position.x -= 0.1
        tieFighter.position.y -= 0.1

        if (tieFighter.position.x < -100) {
            //if the tie fighter flies off the screen, plop it back to its original position
            tieFighter.position.setY(60)
            tieFighter.position.setZ(-5)
            tieFighter.position.setX(22)
            tieFighter.rotateX(-1.5)
        }
    }
}
// end of animate function

const mouse = {
    //we're creating a mouse object, and we're gonna set its x and y properties to be the mouse's position in the browser window, every time we move the mouse
    x: undefined,
    y: undefined
    //but we're gonna have to make an adjustment: browser origin is at the top left, but THREE's origin is in the center of the screen. We want mouse x and y to be relative to the plane, right? Right!
}

animate()

//now we want to create our hover effect
//we'll add an event listener to the window object:
addEventListener('mousemove', event => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    //spoiler alert: this math gives us normalized coordinates, with x= 0 in the middle of the screen, and values of -1 and +1 at either edge of the window
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
    //we need to reverse the math we did for x, because the browser gives us negative values of y as we go up, but THREE wants positive values for y as we go up, like in regular, sensical math.
    // console.log(mouse)

    //awesome! now we have normalized mouse coordinates!
})

const otherButton = document.getElementById('other-button')

// const guiBox = document.querySelector('.dg.main.a')
// const guiButton = document.querySelector('#gui-button')

// guiButton.addEventListener('click', () => {
//     return guiBox.classList.toggle('show')
// })

function moveCameraRightQuick(position, rotation) {
    //let's make this function take two objects: one for position, one for rotation
    //animate camera position to x,y, and z values determine by the position object we pass in
    gsap.to(camera.position, { duration: 10, x: position.x })
    gsap.to(camera.position, { duration: 10, y: position.y })
    gsap.to(camera.position, { duration: 10, z: position.z })
    //  console.log(controls.target)
    // console.log(camera.position)
    //yes!!!!

    //similarly, animate camera rotation according to x,y, and z values in the rotation argument
    gsap.to(camera.rotation, { duration: 10, x: rotation.x })
    gsap.to(camera.rotation, { duration: 10, y: rotation.y })
    gsap.to(camera.rotation, { duration: 10, z: rotation.z })
}

function changeColorTheme() {
    currentTheme++
    if (currentTheme === themes.length) {
        currentTheme = 0
        //if after incrementing, our number is higher than the length of our themes list, go back to the first theme
    }
    world.colors = themes[currentTheme]
    generatePlane()
}

const cameraPosition = {
    x: -0.5,
    y: 4,
    z: -53
}

const cameraRotation = {
    x: 3.11,
    y: 0,
    z: -3.14
}

otherButton.addEventListener('click', () => {
    let moves = cameraMoves[currentMove]
    //currentMove is defined at the very top, initialized to 0
    let { position, rotation } = moves
    //destructure the object in the cameraMoves array at the index of currentMove, which has keys of position and rotation, each of which has a value that's an object itself with x, y, z properties

    changeColorTheme()
    moveCameraRightQuick(position, rotation)

    currentMove++
    if (currentMove === cameraMoves.length) {
        currentMove = 0
    }
})