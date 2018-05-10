var	vertexShaderSource,
	fragmentShaderSource,
	vertexShader,
	fragmentShader,
	shaderProgram,
	positionAttr,
	normalAttr,
	luzUniform,
	luz,
	canvas,
	gl,
	buffer,
	nBuffer,
	data,
	camera
	camX = 0,
	camY = 0,
	camZ = 50,
	lookTime = 0,
	lookLeft = false,
	lookRight = false,
	lookUp = false,
	lookDown = false,
	lookBack = false,
	currentSide = 1,
	comidas = 0;

/* MATRIZES */
var projection,
	projectionUniform,
	view,
	viewUniform,
	model,
	model2,
	modelUniform,
	cobra = [];

var l1 = new Lado(1,l5,l4,l3,l2,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]),
		l2 = new Lado(2,l5,l4,l1,l6,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]),
		l3 = new Lado(3,l5,l4,l6,l1,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]),
		l4 = new Lado(4,l6,l1,l2,l3,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]),
		l5 = new Lado(5,l6,l1,l3,l2,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]),
		l6 = new Lado(6,l5,l4,l2,l3,
									[[0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0],
									 [0, 0, 0, 0, 0, 0]
									]);
var pause = false;
var tick = 0; // contador de frame

function Snake (head, pos, face){
	this.pos = pos;// Y, X
	this.face = face;
	this.sentido = 'd';
	this.head = head;

	this.adv = function(){
		/*if(!pause){
			switch (this.sentido) {
				case 'd':
					if (this.pos[0] == 5) {
						//this.face = this.face.down;
						this.pos[0] = 0;
					}else if (this.head) {
						if (this.pos[0]+1 == 2){
							var p = cobra[cobra.length-1].pos;
							cobra.push(new Snake(false, p));
							this.pos[0] ++;
						}
					}else{
						this.pos[0] ++;
					}
					break;
				case 'r':
					if (this.pos[1] == 5) {
						this.face = this.face.right;
						this.pos[1] = 0;
					}else if (this.head) {
						if (this.pos[1]+1 == 2){
							var p = cobra[cobra.length-1].pos;
							cobra.push(new Snake(false, p));
							this.pos[1] ++;
						}
					}else{
						this.pos[1] ++;
					}
					break;
				case 't':
					if (this.pos[0] == 0) {
						this.face = this.face.top;
						this.pos[0] = 5;
					}else if (this.head) {
						if (this.pos[0]-1 == 2){
							var p = cobra[cobra.length-1].pos;
							cobra.push(new Snake(false, p));
							this.pos[0] --;
						}
					}else{
						this.pos[0] --;
					}
					break;
				case 'l':
					if (this.pos[1] == 0) {
						this.face = this.face.left;
						this.pos[1] = 5;
					}else if (this.head) {
						if (this.pos[1]-1 == 2){
							var p = cobra[cobra.length-1].pos;
							cobra.push(new Snake(false, p));
							this.pos[1] --;
						}
					}else{
						this.pos[1] --;
					}
					break;
			}

			if (this.head) {
				this.face.side[this.pos[0]][this.pos[1]] = -1;
			}else{
				this.face.side[this.pos[0]][this.pos[1]] = -2;
			}
		}*/
		switch (this.sentido) {
			case 'd':
				if(this.afrente() == 1){	//colidiu com parede
					console.log("parede");
				}
				else if (this.afrente() == 2) {	//colidiu com comida
					console.log("comida");
				}
				else {
					this.pos[0] ++;
				}
				break;
			case 'r':
				if(this.afrente() == 1){	//colidiu com parede
					console.log("parede");
				}
				else if (this.afrente() == 2) {	//colidiu com comida
					console.log("comida");
				}
				else {
					this.pos[1] ++;
				}
				break;
			case 't':
				if(this.afrente() == 1){	//colidiu com parede
					console.log("parede");
				}
				else if (this.afrente() == 2) {	//colidiu com comida
					console.log("comida");
				}
				else {
					this.pos[0] --;
				}
				break;
			case 'l':
				if(this.afrente() == 1){	//colidiu com parede
					console.log("parede");
				}
				else if (this.afrente() == 2) {	//colidiu com comida
					console.log("comida");
				}
				else {
					this.pos[1] --;
				}
				break;

		}
		this.face.side[this.pos[0]][this.pos[1]] = -1;
	}
	this.afrente = function(){
		switch (this.sentido) {
			case 'd':
				if (this.pos[0] == 5){
					console.log("Transicao");
				}else {
					return this.face.side[this.pos[0]+1][this.pos[1]];
				}
				break;
			case 'l':
				return this.face.side[this.pos[0]][this.pos[1]-1];
				break;
			case 't' :
				return this.face.side[this.pos[0]-1][this.pos[1]];
				break;
			case 'r' :
				return this.face.side[this.pos[0]][this.pos[1]+1];
				break;
		}
	}

}

function Lado (id, top, down, left, right, v){
	this.id = id;
	this.top = top;
	this.down = down;
	this.left = left;
	this.right = right;
	this.side = v;
}

//Sistema de arquivos
window.addEventListener("SHADERS_LOADED", main);
loadFile("vertex.glsl","VERTEX",loadShader);
loadFile("fragment.glsl","FRAGMENT",loadShader);
function loadFile(filename, type, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET",filename,true);
	xhr.onload = function(){callback(xhr.responseText,type)};
	xhr.send();
}

function getGLContext(){
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	//gl.viewport(0, 0, canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);
}

function loadShader(text,type){
	if(type == "VERTEX") vertexShaderSource = text;
	if(type == "FRAGMENT") fragmentShaderSource = text;
	if(vertexShaderSource && fragmentShaderSource) window.dispatchEvent(new Event("SHADERS_LOADED"));
}

function compileShader(source,type){
	shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(shader));
	return shader;
}

function linkProgram(vertexShader,fragmentShader){
	var program	= gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.log("Error: Program Linking.");
	return program;
}

function getData(){
	var p = [
		[-1,1,-1],
		[1,1,-1],
		[1,1,1],
		[-1,1,1],
		[-1,-1,-1],
		[1,-1,-1],
		[1,-1,1],
		[-1,-1,1]
	];

	var n = [
		//topo
		[0,1,0],
		//esquerda
		[-1,0,0],
		//fundo
		[0,0,-1],
		//direita
		[1,0,0],
		//abaixo
		[0,-1,0],
		//frente
		[0,0,1]
	];

	var c = [
		[1.0,0.0,0.0],
		[0.0,1.0,0.0],
		[0.0,0.0,1.0],
		[1.0,1.0,0.0],
		[1.0,0.0,1.0],
		[0.0,1.0,1.0]
	];

	var normais = [
		n[0],n[0],n[0],
		n[0],n[0],n[0],

		n[1],n[1],n[1],
		n[1],n[1],n[1],

		n[2],n[2],n[2],
		n[2],n[2],n[2],

		n[3],n[3],n[3],
		n[3],n[3],n[3],

		n[4],n[4],n[4],
		n[4],n[4],n[4],

		n[5],n[5],n[5],
		n[5],n[5],n[5]
	];

	var faces = [
		p[0],p[1],p[2],
		p[0],p[2],p[3],

		p[0],p[3],p[4],
		p[3],p[4],p[7],

		p[0],p[1],p[4],
		p[1],p[4],p[5],

		p[1],p[2],p[5],
		p[2],p[5],p[6],

		p[4],p[5],p[6],
		p[4],p[6],p[7],

		p[2],p[3],p[6],
		p[3],p[6],p[7],

		//Paredes

	];

	var cores = [
		c[0],c[0],c[0],
		c[0],c[0],c[0],

		c[1],c[1],c[1],
		c[1],c[1],c[1],

		c[2],c[2],c[2],
		c[2],c[2],c[2],

		c[3],c[3],c[3],
		c[3],c[3],c[3],

		c[4],c[4],c[4],
		c[4],c[4],c[4],

		c[5],c[5],c[5],
		c[5],c[5],c[5],

		c[6],c[6],c[6],
		c[6],c[6],c[6]
	];

	return {
		"points": new Float32Array(flatten(faces)),
		"normais": new Float32Array(flatten(normais)),
		"color" : new Float32Array(flatten(cores))
	};
}

function flatten(nested){
	var flat = [];
	for(var i=0; i < nested.length; i++){
		flat = flat.concat(nested[i]);
	}
	return flat;
}

function main() {

	cobra.push(new Snake(true, [2,2], l1));
	cobra.push(new Snake(false, [1,2], l1));
	cobra.push(new Snake(false, [0,2], l1));

	/* LOAD GL */
	getGLContext();

	/* COMPILE AND LINK */
	vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
	fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
	shaderProgram = linkProgram(vertexShader,fragmentShader);
	gl.useProgram(shaderProgram);

	/* PARAMETERS */
	data = getData();

	positionAttr = gl.getAttribLocation(shaderProgram, "position");
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttr);
	gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);

	normalAttr = gl.getAttribLocation(shaderProgram, "normal");
	nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.normais, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(normalAttr);
	gl.vertexAttribPointer(normalAttr, 3, gl.FLOAT, false, 0, 0);

	colorAttr = gl.getAttribLocation(shaderProgram, "color");
	cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.color, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(colorAttr);
	gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 0, 0);

	/* UNIFORM */
	luzUniform = gl.getUniformLocation(shaderProgram,"luz");
	luz = new Float32Array([10,10,10]);
	gl.uniform3fv(luzUniform, luz);

	projectionUniform = gl.getUniformLocation(shaderProgram,"projection");

	viewUniform = gl.getUniformLocation(shaderProgram,"view");

	modelUniform = gl.getUniformLocation(shaderProgram,"model");


	projection = mat4.perspective([],Math.PI/4, window.innerWidth/window.innerHeight, 0.1, 1000);

	camera = [0,0,50];

	view = mat4.lookAt([],camera,[0,0,0],[0,1,0]);

	model = [
			5,0,0,0,
			0,5,0,0,
			0,0,5,0,
			0,0,0,1
	];

	gl.uniformMatrix4fv(projectionUniform,gl.FALSE,new Float32Array(projection));

	gl.uniformMatrix4fv(viewUniform,gl.FALSE,new Float32Array(view));

	gl.uniformMatrix4fv(modelUniform,gl.FALSE,new Float32Array(model));

	/* DRAW */
	//gl.lineWidth(5.0);
	//gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES
	resize();
	animate();

}

function animate(){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	gl.uniformMatrix4fv(modelUniform,gl.FALSE,new Float32Array(model));
	gl.drawArrays(gl.TRIANGLES, 0, data.points.length/3);
	window.requestAnimationFrame(animate);
	if (tick > 60){
		if(!pause){

			console.log(l1.side);
			cobra[0].adv();
			for (var i = cobra.length-1; i > 0 ; i--) {
				cobra[i].pos = cobra[i-1].pos;
			}
		}
		tick = 0;
	}else{
		tick++;
	}
	moveCamera();
	comida();
}

function resize(){
	var w  = window.innerWidth;
	var h  = window.innerHeight;
	aspecto = w/h;
	//gl.uniformMatrix4fv
	projection = mat4.perspective([],Math.PI/4, aspecto, 0.1, 1000);

	gl.uniformMatrix4fv(projectionUniform,gl.FALSE,new Float32Array(projection));
	canvas.setAttribute("width",w);
	canvas.setAttribute("height",h);
	gl.viewport(0, 0, w, h);
}

function keyPressed(e){
	switch (e.keyCode) {
		case 32:
			lookBack = true;
			break;
		case 87:
			lookUp = true;
			break;
		case 65: // a
			lookLeft = true;
			break;
		case 83: // s
			lookDown = true;
			break;
		case 68: // d
			lookRight = true;
			break;
		case 49: // 1
			currentSide = 1;
			camX = 0;
			camY = 0;
			camZ = 50;
			break;
		case 50: // 2
			currentSide = 2;
			camX = 50;
			camY = 0;
			camZ = 0;
			break;
		case 51: // 3
			currentSide = 3;
			camX = -50;
			camY = 0;
			camZ = 0;
			break;
		case 52: // 4
			currentSide = 4;
			camX = 0;
			camY = 50;
			camZ = 0;
			break;
		case 53: // 5
			currentSide = 5;
			camX = 0;
			camY = -50;
			camZ = 0;
			break;
		case 54: // 6
			currentSide = 6;
			camX = 0;
			camY = 0;
			camZ = -50;
			break;
		case 33:	//PageUp

			break;
		case 34:	//PageDown

			break;
		case 37:	//esquerda

			break;
		case 38:	//cima

			break;
		case 39:	//direita

			break;
		case 40: //baixo

			break;
		case 13:	//enter
			console.log("pause");
			if(pause == false){
				velocidadeTemp = Snake.velocidade;
				Snake.velocidade = 0;
				pause = true;
			}
			else if(pause == true){
				Snake.velocidade = velocidadeTemp;
				velocidadeTemp = 0;
				pause = false;
			}
			break;
	}
}

function keyReleased(e){
	switch (e.keyCode) {
		case 32:
			lookBack = false;
			break;
		case 87:
			lookUp = false;
			break;
		case 65: // a
			lookLeft = false;
			break;
		case 83: // s
			lookDown = false;
			break;
		case 68: // d
			lookRight = false;
			break;
		case 49: // 1
			currentSide = 1;
			break;
		case 50: // 2
			currentSide = 2;
			break;
		case 51: // 3
			currentSide = 3;
			break;
		case 52: // 4
			currentSide = 4;
			break;
		case 53: // 5
			currentSide = 5;
			break;
		case 54: // 6
			currentSide = 6;
			break;
	}
}

function moveCamera(){

	var up = [0,1,0];

	if (currentSide == 4 || currentSide == 5) {
		up = [0,0,-1];
	}else {
		up = [0,1,0];
	}

	//console.log("X:" + camX + " Y:" + camY + " Z:" + camZ + " cS:" + currentSide);
	switch (currentSide) {
		case 1:
			if (lookUp) {
				if (lookTime < 10) {
					camY -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camY += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camX -= 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camX += 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camZ = -50;
			}else{
				if (camX > 0) {
					camX -= 2;
				}else if (camX < 0) {
					camX += 2;
				}else if (camY > 0) {
					camY -= 2;
				}else if (camY < 0) {
					camY += 2;
				}else if (camZ != 50) {
					camZ = 50;
				}
				lookTime = 0;
			}
			break;

		case 2:
			if (lookUp) {
				if (lookTime < 10) {
					camY -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camY += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camZ += 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camZ -= 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camX = -50;
			}else{
				if (camZ < 0) {
					camZ += 2;
				}else if (camZ > 0) {
					camZ -= 2;
				}else if (camY > 0) {
					camY -= 2;
				}else if (camY < 0) {
					camY += 2;
				}else if (camX != 50) {
					camX = 50;
				}
				lookTime = 0;
			}
			break;

		case 3:
			if (lookUp) {
				if (lookTime < 10) {
					camY -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camY += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camZ -= 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camZ += 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camX = 50;
			}else{
				if (camZ < 0) {
					camZ += 2;
				}else if (camZ > 0) {
					camZ -= 2;
				}else if (camY > 0) {
					camY -= 2;
				}else if (camY < 0) {
					camY += 2;
				}else if (camX != -50) {
					camX = -50;
				}
				lookTime = 0;
			}
			break;

		case 4:
			if (lookUp) {
				if (lookTime < 10) {
					camZ -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camZ += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camX -= 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camX += 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camY = -50;
			}else{
				if (camX > 0) {
					camX -= 2;
				}else if (camX < 0) {
					camX += 2;
				}else if (camZ > 0) {
					camZ -= 2;
				}else if (camZ < 0) {
					camZ += 2;
				}else if (camY != 50) {
					camY = 50;
				}
				lookTime = 0;
			}
			break;

		case 5:
			if (lookUp) {
				if (lookTime < 10) {
					camZ -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camZ += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camX -= 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camX += 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camY = -50;
			}else{
				if (camX > 0) {
					camX -= 2;
				}else if (camX < 0) {
					camX += 2;
				}else if (camZ > 0) {
					camZ -= 2;
				}else if (camZ < 0) {
					camZ += 2;
				}else if (camY != 50) {
					camY = -50;
				}
				lookTime = 0;
			}
			break;

		case 6:
			if (lookUp) {
				if (lookTime < 10) {
					camY -= 2;
					lookTime ++;
				}
			}else if (lookDown) {
				if (lookTime < 10) {
					camY += 2;
					lookTime ++;
				}
			}else if (lookLeft) {
				if (lookTime < 10) {
					camX += 2;
					lookTime ++;
				}
			}else if (lookRight) {
				if (lookTime < 10) {
					camX -= 2;
					lookTime ++;
				}
			}else if (lookBack) {
				camZ = 50;
			}else{
				if (camX > 0) {
					camX -= 2;
				}else if (camX < 0) {
					camX += 2;
				}else if (camY > 0) {
					camY -= 2;
				}else if (camY < 0) {
					camY += 2;
				}else if (camZ != -50) {
					camZ = -50;
				}
				lookTime = 0;
			}
			break;
	}

	camera = [camX,-camY,camZ];																//altera o numero para afastar a camera
	view = mat4.lookAt([],camera,[0,0,0],up);

	gl.uniformMatrix4fv(viewUniform,gl.FALSE,new Float32Array(view));
}

function comida(){
	var d = Math.floor(Math.random() * 6) + 1;
	var i = Math.floor(Math.random() * 6), j = Math.floor(Math.random() * 6);
	if (comidas < 3) {
		switch (d) {
			case 1:
				while (l1.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l1.side[i][j] = 2;
				comidas ++;
				break;

			case 2:
				while (l2.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l2.side[i][j] = 2;
				comidas ++;
				break;

			case 3:
				while (l3.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l3.side[i][j] = 2;
				comidas ++;
				break;

			case 4:
				while (l4.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l4.side[i][j] = 2;
				comidas ++;
				break;

			case 5:
				while (l5.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l5.side[i][j] = 2;
				comidas ++;
				break;

			case 6:
				while (l6.side[i][j] != 0) {
					i = Math.floor(Math.random() * 6);
					j = Math.floor(Math.random() * 6);
				}
				l6.side[i][j] = 2;
				comidas ++;
				break;
		}
	}
}

window.addEventListener("resize",resize);
window.addEventListener("keyup",keyReleased);
window.addEventListener("keydown",keyPressed);
