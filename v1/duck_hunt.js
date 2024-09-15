var canvas;
var gl;

var vPosition;
var gun;
var ducks;
var bullets;

class Gun {
    constructor(webGl, vPosition) {
	this.buffer = webGl.createBuffer();
	this.v = [
	    vec2(-0.1, -0.9),
	    vec2( 0.0, -0.7),
	    vec2( 0.1, -0.9),
	];
    }

    move(webGl, offsetX) {
	var xmove = 2*(offsetX - mouseState.mouseX)/canvas.width;
        mouseState.mouseX = offsetX;
        for(let i = 0; i< this.v.length; i++) {
            this.v[i][0] += xmove;
        }
	webGl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	webGl.bufferData(gl.ARRAY_BUFFER, flatten(this.v), gl.DYNAMIC_DRAW);
    }

    render(webGl, vPosition) {
	webGl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	webGl.bufferData(gl.ARRAY_BUFFER, flatten(this.v), webGl.DYNAMIC_DRAW);
	webGl.vertexAttribPointer(vPosition, 2, webGl.FLOAT, false, 0, 0);
	webGl.enableVertexAttribArray(vPosition);
	webGl.drawArrays(webGl.TRIANGLES, 0, 3);
    }
}

class Bullet {
    constructor(webGl) {
	this.is_activated = false;
	this.buffer = webGl.createBuffer();
    }

    activate(gun) {
	const a = 0.05;
	const x = gun.v[1][0];
	const y = gun.v[1][1];
	this.v = [
	    vec2(x, y - a),
	    vec2(x, y),
	    vec2(x + a, y),
	    vec2(x + a, y - a),
	];
	this.is_activated = true;
    }

    deactivate() {
	this.is_activated = false;
    }

    is_active() {
	return this.is_activated && this.v[0][1] < 1;
    }

    move() {
	for (let i = 0; i < this.v.length; i++) {
	    this.v[i][1] += 0.075;
	}
    }

    render(webGl, vPosition) {
	this.move();
	webGl.bindBuffer(webGl.ARRAY_BUFFER, this.buffer);
	webGl.bufferData(webGl.ARRAY_BUFFER, flatten(this.v), webGl.DYNAMIC_DRAW);
	webGl.vertexAttribPointer(vPosition, 2, webGl.FLOAT, false, 0, 0);
	webGl.enableVertexAttribArray(vPosition);
	webGl.drawArrays(webGl.TRIANGLE_FAN, 0, 4);
    }
}


class Duck {
    constructor(webGl, direction) {
	this.direction = direction;
	if (this.direction < 0) {
	    this.direction = -2;
	} else {
	    this.direction = 1;
	}
	this.activate();
	this.buffer = webGl.createBuffer();
    }

    activate() {
	const a = 0.1;
	const x = this.direction;
	const y = Math.random();
	this.v = [
	    vec2(x, y - a),
	    vec2(x, y),
	    vec2(x + a, y),
	    vec2(x + a, y - a),
	];
	this.speed = Math.random() * (0.02 - 0.015) + 0.015;
	if (this.direction > 0) {
	    this.speed = -this.speed;
	}
	this.is_activated = true;
    }

    deactivate() {
	this.is_activated = false;
    }

    is_active() {
	if (this.direction > 0) {
	    return this.is_activated && this.v[2][0] > -1;
	} else {
	    return this.is_activated && this.v[0][0] < 1;
	}
    }

    move() {
	for (let i = 0; i < this.v.length; i++) {
	    this.v[i][0] += this.speed;
	}
    }

    render(webGl, vPosition) {
	this.move();
	webGl.bindBuffer(webGl.ARRAY_BUFFER, this.buffer);
	webGl.bufferData(webGl.ARRAY_BUFFER, flatten(this.v), webGl.DYNAMIC_DRAW);
	webGl.vertexAttribPointer(vPosition, 2, webGl.FLOAT, false, 0, 0);
	webGl.enableVertexAttribArray(vPosition);
	webGl.drawArrays(webGl.TRIANGLE_FAN, 0, 4);
    }
}

var mouseState = {
    mouseX: null,
    movement: false,
};

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    gun  = new Gun(gl);
    ducks = [new Duck(gl, 1), new Duck(gl, -1)];
    bullets = [new Bullet(gl), new Bullet(gl), new Bullet(gl)];
    
    canvas.addEventListener("mousedown", (event) => {
        mouseState.movement = true;
        mouseState.mouseX = event.offsetX;
    });

    canvas.addEventListener("mouseup", (event) => {
        mouseState.movement = false;
    });

    canvas.addEventListener("mousemove", (event) => {
        if(mouseState.movement) {
	    gun.move(gl, event.offsetX);
        }
    });

    document.addEventListener("keydown", (event) => {
	if (event.key === " ") {
	    for (let i = 0; i < bullets.length; i++) {
		if (!bullets[i].is_active()) {
		    bullets[i].activate(gun);
		    break;
		}
	    }
	    bullets.forEach((bullet) => {
		if (bullet.is_active()) {
		    bullet.render(gl, vPosition);
		}

	    });
	}
    });
    
    render();
}

function to_regtangle(elem) {
    const r = {
	x1: elem.v[0][0], y1: elem.v[0][1],
	x2: elem.v[2][0], y2: elem.v[2][1],
    };
    return {
	x: r.x1,
	y: r.y1,
	w: r.x2 - r.x1,
	h: r.y2 - r.y1,
    };
}

function rectangles_collide(p1, p2) {
    if (p1.v === undefined || p2.v == undefined) {
	return false;
    }
    r1 = to_regtangle(p1);
    r2 = to_regtangle(p2);
    return !(r1.x + r1.w < r2.x ||
	     r1.x > r2.x + r2.w ||
	     r1.y + r1.h < r2.y ||
	     r1.y > r2.y + r2.h);
	    
}

function render() {
    setTimeout(() => {
	gl.clear(gl.COLOR_BUFFER_BIT);

	gun.render(gl, vPosition);

	ducks.forEach((duck) => {
	    if (!duck.is_active()) {
		duck.activate();
	    }
	});

	ducks.forEach((duck) => {
	    duck.render(gl);
	});

	bullets.forEach((bullet) => {
	    if (bullet.is_active()) {
		bullet.render(gl, vPosition);
	    }
	});

	bullets.forEach((bullet) => {
	    ducks.forEach((duck) => {
		if (duck.is_active() && bullet.is_active()) {
		    if (rectangles_collide(duck, bullet)) {
			duck.deactivate();
			bullet.deactivate();
			console.log("hit");
		    }
		}

	    });
	});
	
	window.requestAnimFrame(render);

    }, 10);
}
