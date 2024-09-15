var gl;
var locPosition;
var locColor;
var b1;
var b2;
var v1;
var v2;
var color = vec4(1.0, 0.0, 0.0, 1.0);

window.onload = () => {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
	alert("WebGl isn't available");
    }

    v1 = [
	vec2(-0.5, 0.0),
	vec2( 0.0, 0.5),
	vec2( 0.5, 0.0),
    ];

    v2 = [
	vec2(-0.25, -0.25),
	vec2( 0.0,  0.0),
	vec2( 0.25, -0.25),
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    b1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(v1), gl.STATIC_DRAW);

    b2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(v2), gl.STATIC_DRAW);

    locPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(locPosition);

    locColor = gl.getUniformLocation(program, "color");

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    color = vec4(1.0, 0.0, 0.0, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b1);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(color));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    color = vec4(0.0, 0.0, 0.0, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, b2);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(color));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimFrame(render);
}
