// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =    `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let identityM;

let cursorPosition = [0, 0];
let g_globalAngle = 0;
let g_globalRot = 0;

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
            currpos.x = newpos[0];
            currpos.y = newpos[1];
            dx = 0;
            dy = 0;
            document.getElementById('angleValue').innerText = Math.floor(g_globalAngle) % 360;
            renderAllShapes();
        }
    }

}

function main() {
    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Button and Sliders
    addActionsForHTMLUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    renderScene();
    
    // requestAnimationFrame(tick);
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

// function tick() {
//     // Update
//     g_seconds = performance.now()/1000.0 - g_startTime;
//     renderScene();
//     requestAnimationFrame(tick);
// }

function renderScene() {
    renderAllShapes();
}

function renderAllShapes() {
    console.log("renderAllShapes called");
    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    var viewMat = identityM;
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements)
    var projMat = identityM;
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var body = new Cube();
    body.color = [1, 0, 0, 1];
    body.matrix.translate(-.25, -.5, 0.0);
    body.matrix.scale(0.5, 1, .5);
    body.render();

    var leftArm = new Cube();
    leftArm.color = [1, 1, 0, 1];
    leftArm.matrix.translate(0.7, 0, 0.0);
    leftArm.matrix.rotate(45, 0, 0, 1);
    leftArm.matrix.scale(0.25, 0.7, 0.5);
    leftArm.render();

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) +
                    " fps: " + Math.floor(10000/duration),
                    "numdot");


}



function sendTextToHTML(text, htmlID) {
    var htmlElement = document.getElementById(htmlID);
    if (!htmlElement) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElement.innerHTML = text;
}