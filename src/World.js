// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =    `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_GlobalRotateMatrixY;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_GlobalRotateMatrixY * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor; // use color
    }
    else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0); // use uv debug color
    }
    else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV); // use texture0
    }
    else {
        gl_FragColor = vec4(1, 0.2, 0.2, 1); // error put a reddish color
    }

    // gl_FragColor = u_FragColor;
    // gl_FragColor = vec4(v_UV, 1.0, 1.0);
    // gl_FragColor = texture2D(u_Sampler0, v_UV);
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix; // eventually set by glPerspective()
let u_ViewMatrix; // eventually set by lookAt()

let u_GlobalRotateMatrix;
let u_GlobalRotateMatrixY;

let u_Sampler0;
let u_whichTexture;
let identityM;

let cursorPosition = [0, 0];

// camera rotation
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_globalRot = 0;

// perspective
let g_eye = [0, 0, -3];
let g_at = [0, 0, 100];
let g_up = [0, 1, 0];

//
let idleAnimate = false;
let flapAnimate = false;
let spinAnimate = false;
let g_legAngle = -10;
let g_earAngle = 40;
let g_trunkAngle = -35;

let g_trunk1Angle = -3;
let g_trunk2Angle = -3;
let g_trunk3Angle = -3;

let g_tailAngle = 0;
let g_headAngle = 0;
let g_testAngle = 0;


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    // no lag fix
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_GlobalRotateMatrixY = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrixY');
    if (!u_GlobalRotateMatrixY) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrixY');
        return;
    } 

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function addActionsForHTMLUI() {
    // Mouse rotation
        // Track mousedown, mouseup, mousemove
    var currpos = {
        x: 0,
        y: 0,
    }
    var downFlag = false;
    delta = 100;
    var dx, dy = 0;

    canvas.onmousedown = function (down) {
        //console.log('Mouse Down')
        downFlag = true;
        let omd = convertCoordinatesEventToGL(down)
        currpos.x = omd[0];
        currpos.y = omd[1];
        //console.log('x: ' + currpos.x + ' y: ' + currpos.y);
    }
    canvas.onmouseup = function (up) {
        //console.log('Mouse Up')
        downFlag = false;
        // newpos = convertCoordinatesEventToGL(up);
        // dx = newpos[0] - currpos.x;
        // dy = newpos[1] - currpos.y;
        // g_globalAngle += (dx * delta);
        // console.log('New Angle' + g_globalAngle);
    }
    canvas.onmousemove = function (move) {
        //console.log('Angle' + g_globalAngle);
        if (!downFlag) {
            return;
        }
        else {
            newpos = convertCoordinatesEventToGL(move);
            dx = newpos[0] - currpos.x;
            dy = newpos[1] - currpos.y;
            g_globalAngle -= (dx * delta);
            g_globalAngleY += (dy * delta);
            currpos.x = newpos[0];
            currpos.y = newpos[1];
            dx = 0;
            dy = 0;
            document.getElementById('angleValue').innerText = Math.abs(Math.floor(g_globalAngle) % 360);
            document.getElementById('angleValueY').innerText = Math.abs(Math.floor(g_globalAngleY) % 360);
        }
    }

    // Shift detection
    canvas.addEventListener("click", function (e) {
        if (e.shiftKey) {
            spinAnimate = true;
            document.getElementById('currentAnimation').innerText = "You Can't See Me"
            document.getElementById('elephName').innerText = "JOHNNNNN CENAAAAAAA"
        }
    })


    // Leg Segment Slider
    document.getElementById('legSlider').addEventListener('mousemove',
        function() {g_legAngle = this.value; renderAllShapes(); });

    // Ear Segment Slider
    document.getElementById('earSlider').addEventListener('mousemove',
        function() {g_earAngle = this.value; renderAllShapes(); })

    // Trunk Whole Slider
    document.getElementById('trunkSlider').addEventListener('mousemove',
        function() {g_trunkAngle = this.value; renderAllShapes(); })

    // Trunk Segments Sliders
    document.getElementById('trunk1Slider').addEventListener('mousemove',
        function() {g_trunk1Angle = this.value; renderAllShapes(); })
    document.getElementById('trunk2Slider').addEventListener('mousemove',
        function() {g_trunk2Angle = this.value; renderAllShapes(); })
    document.getElementById('trunk3Slider').addEventListener('mousemove',
        function() {g_trunk3Angle = this.value; renderAllShapes(); })

    // Tail Slider
    document.getElementById('tailSlider').addEventListener('mousemove',
        function() {g_tailAngle = this.value; renderAllShapes(); })

    // Head Segment Slider
    document.getElementById('headSlider').addEventListener('mousemove',
        function() {g_headAngle = this.value; renderAllShapes(); })

    // Buttons
    // idleButton
    idleAnimation = document.getElementById('idleButton');
    idleAnimation.addEventListener('click', function (e) {
        idleAnimate = true;
        if(flapAnimate) {
            flapAnimate = false;
        }
        if(spinAnimate) {
            spinAnimate = false;
        }
    })
    // flapButton
    flapAnimation = document.getElementById('flapButton');
    flapAnimation.addEventListener('click', function (e) {
        flapAnimate = true;
        if(idleAnimate) {
            idleAnimate = false
        }
        if(spinAnimate) {
            spinAnimate = false;
        }
    })
    // clearAnimations
    clearAnimations = document.getElementById('clearButton').addEventListener('click', function (e) {
        flapAnimate = false;
        idleAnimate = false;
        spinAnimate = false;

        g_legAngle = -10;
        g_earAngle = 15;
        g_trunkAngle = -20;
        g_tailAngle = 0;
        g_headAngle = 0;
        g_testAngle = 0;
        g_trunk1Angle = -3;
        g_trunk2Angle = -3;
        g_trunk3Angle = -3;
            // leg, ear trunk, t1, t2, t3, tail, head, 
        document.getElementById('sliderForm').reset();
    })

}

function initTextures() {
    // initTextures + sendTextoGLSL takes a gl context, creates a texture, gets location...
    // of uniform variable, initializes the image object...
    // sets up an event handler on image load for texture generation (runs after load)

    var image = new Image();
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    
    // Register the event handler to be called on loading an image
    // 'whenever done loading image, run sendTextureToGLSL to be rendered
    image.onload = function() { sendImageToTEXTURE0(image); }
    // Tell the browser to load image
    image.src = '../res/img/sky.jpg';

    // add other texture loaders if desired

    //

    return true;
}

function sendImageToTEXTURE0(image) {
    // creates texture that connects to GL object
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // Flip image's y axis to align with canvas
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);


    console.log('complete');
}

function main() {
    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Button and Sliders
    addActionsForHTMLUI();

    // Initialize and load textures
    initTextures();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //renderScene();
    
    requestAnimationFrame(tick);
}

function click(ev) {
    // Extract the event click and return it in WebGL coords
    [x, y] = convertCoordinatesEventToGL(ev);
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x,y]);
}

function tick() {
    // Update
    g_seconds = performance.now()/1000.0 - g_startTime;
    renderScene();
    requestAnimationFrame(tick);
    animate();
}

function renderScene() {
    renderAllShapes();
}

function animate() {
    if(idleAnimate) {
        idle();
    }
    if(flapAnimate) {
        flap();
    }
    if(spinAnimate) {
        spin();
    }
}

function idle() {
    g_headAngle = 10 * Math.cos(g_seconds);
    g_trunkAngle = 5 * Math.sin(g_seconds);
    g_tailAngle = 30 * Math.sin(g_seconds);
    g_legAngle = 5 * Math.sin(g_seconds / 2);
}

function flap() {
    g_earAngle = 30 * Math.cos(g_seconds * 2.1);
    g_headAngle = 10 * Math.cos(g_seconds * 2);
    g_trunkAngle = 10 * Math.sin(g_seconds * 2);
    g_legAngle = -10 * Math.abs(Math.sin(g_seconds));
    g_tailAngle = 1080 * Math.sin(g_seconds) * 2.5;
}

function spin() {
    g_trunkAngle = 45;
    g_legAngle = -50 * - Math.abs(Math.sin(g_seconds * 5));
    setTimeout(() => {
        spinAnimate = false;
        let reset = document.getElementById('clearButton');
        if(idleAnimate) {
            setTimeout(() => {
                document.getElementById('idleButton').click();
            }, 130)
        }
        else if (flapAnimate) {
            setTimeout(() => {
                document.getElementById('flapButton').click();
            }, 130)
        }
        else {
            reset.click();
        }
        document.getElementById('elephName').innerText = "Smarto the Elephant.";
    }, 1500);
}


function sendTextToHTML(text, htmlID) {
    var htmlElement = document.getElementById(htmlID);
    if (!htmlElement) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElement.innerHTML = text;
}

function m_left(){
    // vector delta with origin g_eye and end -> orthogonal through crossproduct of delta 
    // delta = at - eye
    // up = 
    // left = crossproduct of delta and up
}

function m_right(){

}

function m_back(){

}