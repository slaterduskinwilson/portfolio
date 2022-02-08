// https://www.youtube.com/watch?v=YK1Sw_hnm58

//ok! we're at 2:17, next step is HTML and CSS

//but for now: time to go to work at the feed store.

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// console.log(OrbitControls)
import * as dat from 'dat.gui'
// console.log(dat)
import gsap from 'gsap'
// console.log(gsap)

const gui = new dat.GUI()
const world = {
    plane: {
        width: 22,
        height: 1,
        widthSegments: 200,
        heightSegments: 1
    }
}
//try 22, 1, 200, and 1?


//i like these values a little better:
// plane: {
//     width: 6,
//     height: 50,
//     widthSegments: 139,
//     heightSegments: 126
// }

//gui.add takes 4 arguments: the object you're manipulating, the property of that object you're manipulating, and the min and max values you want to put on the manipulation slider!
gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
//we've abstracted our long-ass height/width change duplicate code into one function: generatePlane, defined below!
gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 200).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 200).onChange(generatePlane)

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

    if(i % 3 === 0) {
        //we changed our incrementation from i+=3 to i++, so we could get a full set of random values. We're adding this if condition so that we only update our array position in groupings of 3. Make sense? If the iterator divided by 3 has no remainder, that's the same thing as increasing the iterator by 3 loop
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    //on each iteration of the loop, we set x, y, and z to be the first, second, and third elements. Then we increment our index by 3, which takes us to the next x value, and so on. Make sense? Yes? Good.
    // console.log(x, y, z)

    array[i ] = x + (Math.random() - 0.5) * 3
    //this is how we manipulate the x values of our vertices. Think about it: Math.random() returns a number between 0 and 1. If we subtract 0.5 from any value in that range, we're left with a number between positive and negative 0.5. If we want a bigger range of numbers than that, we just multiply that expression by a larger number... which gives us a "more negative" number on one end, and a "more positive" number on the other. Math!
    array[i+1] = y + (Math.random() - 0.5) * 3
    array[i + 2] = z + (Math.random() -0.5 )  * 3
    // play around with these z values, think about what values we're returning. If we want z to move in both directions, we'll subtract 0.5 from Math.random(), and if we want more drastic changes in this value, we can multiply this entire thing by a bigger number, e.g (Math.random() -0.5 )  * 3

    //notice how we use array[i + 2] to refer to the z coordinate at that specific iteration, and the constant "z" to refer to that z coordinate's initial value. We do math on that initial value, and then change array[i +2] to that new value!

    }
    
    //let's try making this movement random over the FULL range of motion for each vertex, as opposed to limiting it to values between 0 and 1. We need to multiply our random amount by twice pi.... which is TAU aka 6.28... Check it:
    randomValues.push(Math.random() * (Math.PI *2))

    //below is our old randomization code:
   // randomValues.push(Math.random() - 0.5); //this will populate our randomValues array with a bunch of random values, one for each set of x,y,z coordinates in our mesh
    //and subtracting 0.5 from our Math.random() return value gives us a random value between -0.5 and 0.5, remember this cool trick? Yes? Cool!
}

// console.log('randomvalues', randomValues);

//let's create a randomValues property on our position object!
mesh.geometry.attributes.position.randomValues = randomValues
//let's create a new property of our mesh position object, so we can reference the original position of this object and animate from there!
mesh.geometry.attributes.position.originalPosition = mesh.geometry.attributes.position.array

console.log('mesh position: ', mesh.geometry.attributes.position)




//END PASTE


    //NOW, FOR THE COLORCHANGEY:
// we're going to set each individual vertex to a specific color, thereby coloring the whole shape (instead of setting the color when we define our meshphongmaterial), and then we can change the color of individual vertices when we point the raycaster at them aka hover over them!
//ADDING COLOR ATTRIBUTE:
const colors = []
for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    colors.push(0.6, 0.1, 0.4)
}
// console.log(colors)

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
camera.position.x = 0.058991773097945004
camera.position.y = -6.384716906143697
camera.position.z = -3.9242363137500

// camera.position.z = 50
//this moves our camera back, so we can see our plane!

//NOTE: calling orbitcontrols before or after creating the camera can sometimes affect how the mesh renders
const controls = new OrbitControls(camera, renderer.domElement)
//we've instatiated an OrbitControls object, which takes a camera and a renderer argument. Now, when we drag around on our screen, we move our camera, so it looks like the plane is rotating! Note: we won't be able to see the back side of this plane unless we put a light source there

controls.addEventListener('change', event => {
    console.log('camera position from orbitcontrols: ', controls.object.position)
}) //this will log our our camera position, whenever we manipulate the orbit controls, so we can plug that value back in wherever we want! YES!



const geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments) //width, height, width segments, height segments
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
    mesh.rotation.y += 0.006
    raycaster.setFromCamera(mouse, camera)
    //since this is set from camera, when we move our camera with orbit controls, it'll take that into account! so when we hover over an area where the "plane used to be but isn't anymore," it'll no longer count that as intersecting!

    frame += 0.01 //this represents how many times we've called this animate function!

    const {array, originalPosition, randomValues} = mesh.geometry.attributes.position
    //destructuring our mesh.geometry.attributes.position object, to more easily work with the properties inside it
    
    for (let i = 0; i < array.length; i += 3) {
        // //we're gonna loop through the array that contains the vertices that make up the plane's position, and each iteration groups the values by 3 for x, y, and z
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005
        //we're changing each x value in our vertices array... adding the corresponding value from the random values array to the cosine function, and then multiplying that value by 0.01 or 0.001 or whatever, so the movement isn't too drastic!

        //NOTES:
        //array[i] is our x value, remember? array[i+1] would be y, etc

        //Math.cos() is a cosine function, which takes an argument in radians, and will return "pulsing" values between -1 and 1 over time. If we want this periodic value to be smaller (which we do), we can multiply it by a really small number (like 0.01)

        //YO: if we just want our plane to move back and forth, we could use this line of code:
        //array[i] = originalPosition[i] + Math.cos(frame) * 0.01


        //here's where we randomize movement in the y direction! Great!
        array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1]) * 0.005
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

        const hoverColor = {
            r: 0,
            g: 1,
            b: 1
        }

        //we'll use the gsap library to animate our hovercolor back to our initial color when we move the mouse away!
        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
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
}
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
