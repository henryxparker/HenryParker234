//Henry Parker
//Assignment 4: I did everything required for assignment 4
//Assignment 3: I did some extra work on this assignment to serve as my submission for assignment 3
//  Buttons: I didn't create the buttons in the html. No points.
//  Utilize a slider: I made the slider for scale and translation. Full points
//  Utilize a menu: I made a menu. Full points
//  Key controls: too lazy. No points
//  Uniform variable: I didn't implement it. No points
//Assignment 2: I technically made something with triangles (plus I did the paper). Half points?
"use strict";

var canvas;
var gl;

var NumVertices  = 60;

var points = [];
var colors = [];
var randColors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 15, 0 ];  //rotation angles
var trans = [0, 0, 0];     //translation values
var scale = [1, 1, 1];     //scale values

var thetaLoc;   //bridges to vectors in shaders
var transLoc;
var scaleLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorIcosohedron();


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 0.7, 0.7, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    transLoc = gl.getUniformLocation(program, "trans");
    scaleLoc = gl.getUniformLocation(program, "scale");

    //event listeners for buttons
    //adjust the theta values so that cube rotations look neat
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
        theta[xAxis] = 0;
        theta[yAxis] = 15;
        theta[zAxis] = 0;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
        theta[xAxis] = 45;
        theta[yAxis] = 0;
        theta[zAxis] = 0;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
        theta[xAxis] = 45;
        theta[yAxis] = 45;
        theta[zAxis] = 0;
    };
    document.getElementById( "tslider" ).oninput = function () {
        trans[0] = parseFloat(event.target.value);
    };
    document.getElementById( "sslider" ).oninput = function () {
        scale[0] = parseFloat(event.target.value);
        scale[1] = parseFloat(event.target.value);
        scale[2] = parseFloat(event.target.value);
    };

    // Initialize event handler (menu)
    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                //Why doesn't this work correctly? beats the FUCK out of me. colors and points haven't changed. I even tried creating the vBuffer again and that did diddly fuckin squat. I EVEN TRIED MAKING THE POLYGON AGAIN WITH colorIcosohedron(). buffer bullshit if you ask me
                var cBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

                var vColor = gl.getAttribLocation(program, "vColor");
                gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(vColor);
                break;
            case 1:
                randColors = [];
                for (var i = 0; i < 60; i++) {
                  randColors.push(vec3(Math.random(),Math.random(),Math.random()))
                }
                var cBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(randColors), gl.STATIC_DRAW);

                var vColor = gl.getAttribLocation(program, "vColor");
                gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(vColor);
                break;
            default:
                break;
        }
      };

    render();
}

function colorIcosohedron()
{
    quad(1,0,1,2);
    quad(2,0,1,3);
    quad(3,0,2,4);
    quad(4,7,0,3);
    quad(5,0,4,7);
    quad(2,1,5,6);
    quad(1,1,3,6);
    quad(2,3,6,8);
    quad(3,3,8,7);
    quad(4,8,7,11);
    quad(3,7,11,4);
    quad(6,4,11,9);
    quad(1,4,9,2);
    quad(5,9,2,5);
    quad(3,2,5,1);
    quad(1,5,6,10);
    quad(5,6,8,10);
    quad(6,8,11,10);
    quad(1,11,9,10);
    quad(2,9,5,10);
    console.log(points);

}

function quad(color,a,b,c)
{
    var vertices = [
        vec4(  0.0,  0.309,    0.5, 1.0 ),
        vec4(  0.0, -0.309,    0.5, 1.0 ),
        vec4( -0.5,    0.0,  0.309, 1.0 ),
        vec4(  0.5,    0.0,  0.309, 1.0 ),
        vec4( -0.309,  0.5,    0.0, 1.0 ),
        vec4( -0.309, -0.5,    0.0, 1.0 ),
        vec4(  0.309, -0.5,    0.0, 1.0 ),
        vec4(  0.309,  0.5,    0.0, 1.0 ),
        vec4(  0.5,    0.0, -0.309, 1.0 ),
        vec4( -0.5,    0.0, -0.309, 1.0 ),
        vec4(  0.0, -0.309,   -0.5, 1.0 ),
        vec4(  0.0,  0.309,   -0.5, 1.0 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[color]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(transLoc, trans);
    gl.uniform3fv(scaleLoc, scale);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
