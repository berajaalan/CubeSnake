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
	camera;

/* MATRIZES */
var projection,
	projectionUniform,
	view,
	viewUniform,
	model,
	modelUniform;

var pause = false;
var velocidadeTemp = 0;
var tick = 0;																																		//contador de frame
var lCubo = 6; 																																	//tamanho dado ao "model" para os lados do cubo +1
var Snake = {
	pos : [0,0,6],
	velocidade : 30,																															//quando o contador "tick" atinge este numero o objeto é deslocado
	direction : [12,13,14],																												// eixos[X,Y,Z]
	axis : 0,																																			//posicao no vetor direction
	sentido : 1,																																	// qual sentido ele anda sobre o eixo (-1 ou 1)
	tamanho : 2,
	modelHead : [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,6,1
	],
	frente : function(){
		return (this.axis+1)*this.sentido;
	},
	direcAtual : function(){
		return this.direction[this.axis];
	},
	draw(){
		gl.uniformMatrix4fv(modelUniform,gl.FALSE,new Float32Array(this.modelHead));
		gl.drawArrays(gl.TRIANGLES, 0, data.points.length/3);
	}
};

var bodyList = [];
bodyList.push( new SnakeBody([-1,0,6],Snake));
bodyList.push( new SnakeBody([-2,0,6],bodyList[0]));
bodyList.push( new SnakeBody([-3,0,6],bodyList[1]));

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
		p[3],p[6],p[7]
	];
	return {
		"points": new Float32Array(flatten(faces)),
		"normais": new Float32Array(flatten(normais))
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
	/*
	Snake.modelHead = [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,6,1
	];
	*/

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
	Snake.draw();
	window.requestAnimationFrame(animate);
	auto();
	DrawBody(Snake.tamanho);
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

function moveCamera(evt){
	var y = (evt.y / window.innerHeight) * 20 -10;
	var x = (evt.x / window.innerWidth) * 20 -10;
	camera = [x,-y,50];																//altera o numero para afastar a camera
	view = mat4.lookAt([],camera,[0,0,0],[0,1,0]);

	//camera = [x,-y,0];
	//view = mat4.lookAt([],[0,0,10],camera,[0,1,0]);

	gl.uniformMatrix4fv(viewUniform,gl.FALSE,new Float32Array(view));
}

function andaManual(evt){
	console.log(evt.keyCode);
	switch (evt.keyCode) {
		case 33:	//PageUp
			Snake.axis = 2;
			Snake.sentido = -1;
			break;

		case 34:	//PageDown
			Snake.axis = 2;
			Snake.sentido = 1;
			break;

		case 37:	//esquerda
			Snake.axis = 0;
			Snake.sentido = -1;
			break;

		case 38:	//cima
			Snake.axis = 1;
			Snake.sentido = 1;
			break;

		case 39:	//direita
			Snake.axis = 0;
			Snake.sentido = 1;
			break;

		case 40: //baixo
			Snake.axis = 1;
			Snake.sentido = -1;
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

function moveAdv(evt){
	if(evt.keyCode == 37){
		switch (Snake.frente()) {
			case 1:
				if(Snake.modelHead[13] != 0 || Snake.modelHead[14] != 0){
					Snake.axis = 1;
				}
				break;
			case -1:
				Snake.axis = 1;
				break;

			case 2:
				Snake.axis = 1;
				break;
			case -2:
				Snake.axis = 1;
				break;

			case 3:
				Snake.axis = 1;
				break;
			case -3:
				Snake.axis = 1;
				break;

			default:

		}

	}
}

function auto(){
	tick +=1	//soma a cada frame

	if(pause == true){
		tick = 0;
	}
	else if(tick > Snake.velocidade){
		Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
		switch (Snake.direcAtual()) {
			case 12:
				Snake.pos[0] = Snake.modelHead[12];
				break;
			case 13:
				Snake.pos[1] = Snake.modelHead[13];
				break;
			case 14:
				Snake.pos[2] = Snake.modelHead[14];
				break;
			default:

		}

		tick = 0;
		console.log("X:" + Snake.modelHead[12] + " Y:" + Snake.modelHead[13] + " Z:" + Snake.modelHead[14]);

		if(Snake.modelHead[Snake.direcAtual()] >= lCubo || Snake.modelHead[Snake.direcAtual()] <= -lCubo){		//atingiu o limete da face
			//se esta andando em X troca para Z ou Y
			if(Snake.direcAtual() == 12){
				// se verdadeiro troca para Z
				if(Snake.modelHead[13] > -lCubo && Snake.modelHead[13] < lCubo){
					//checa se esta na face da frente
					if(Snake.modelHead[14] == lCubo){
						Snake.axis = 2;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//Presume que esta na face de tras
					else{
						Snake.axis = 2;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}
				//então troca para Y
				else{
					//checa se esta na face de cima
					if (Snake.modelHead[13] == lCubo){
						Snake.axis = 1;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//Presume que esta na face de baixo
					else{
						Snake.axis = 1;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}
			}

			//se esta andando em Y troca para Z ou X
			else if (Snake.direcAtual()  == 13) {
				//se verdadeiro troca para Z
				if(Snake.modelHead[12] > -lCubo && Snake.modelHead[12] < lCubo){
					//checa se esta na face da frente
					if(Snake.modelHead[14] == lCubo){
						Snake.axis = 2;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//então Presume que esta na face de tras
					else{
						Snake.axis = 2;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}

				//então troca para X
				else{
					//checa se esta na face da direita (inicial)
					if(Snake.modelHead[12] == lCubo){
						Snake.axis = 0;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//Presume que esta na face de esquerda (inicial)
					else{
						Snake.axis = 0;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}
			}

			// presume que esta andando em Z e troca para X ou Y
			else if (Snake.direcAtual()  == 14) {
				//se verdadeiro troca para Y
				if(Snake.modelHead[12] > -lCubo && Snake.modelHead[12] < lCubo){
					//checa se esta na face de cima
					if (Snake.modelHead[13] == lCubo){
						Snake.axis = 1;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//Presume que esta na face de baixo
					else{
						Snake.axis = 1;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}
				//então troca para X
				else{
					//checa se esta na face da direita (inicial)
					if(Snake.modelHead[12] == lCubo){
						Snake.axis = 0;
						Snake.sentido = -1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
					//Presume que esta na face de esquerda (inicial)
					else{
						Snake.axis = 0;
						Snake.sentido = 1;
						Snake.modelHead[Snake.direcAtual()] += 1*Snake.sentido;
					}
				}
			}
		}

		bodyList[0].nextStep = Snake.pos;
		/*		adicionar novo "corpo"
		for (i = 0;i < Snake.tamanho; i ++){
			bodyList[i] = new corpoSnake
		}*/
	}
}

function SnakeBody(pos,next){
	this.prox = next;
	this.pos = pos;
	this.nextStep = this.prox.pos;
	this.SnakeBody = [
		0.75,0,0,0,
		0,0.75,0,0,
		0,0,0.75,0,
		this.pos[0],this.pos[1],this.pos[2],1
	];
	this.setProx = function(snk) {this.prox = snk;};
	this.passo = function(){
		this.pos = this.nextStep;
		this.nextStep = this.prox.pos;
		this.SnakeBody[12] = this.pos[0];
		this.SnakeBody[13] = this.pos[1];
		this.SnakeBody[14] = this.pos[2];
		this.draw();
	};
	this.draw =	function(){
		gl.uniformMatrix4fv(modelUniform,gl.FALSE,new Float32Array(this.SnakeBody));
		gl.drawArrays(gl.TRIANGLES, 0, data.points.length/3);
	}
}

function DrawBody(qtd){
	for(i = 0; i < qtd; i++){
		bodyList[i].draw();
	}
}

window.addEventListener("resize",resize);
window.addEventListener("mousemove",moveCamera);
window.addEventListener("keydown",andaManual);
