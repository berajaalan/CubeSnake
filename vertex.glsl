precision highp float;

attribute vec3 position;

attribute vec3 normal;

attribute vec3 color;

// near, far, fovy, aspect
uniform mat4 projection;

// camera position, up, target (lookAt)
uniform mat4 view;

// posicao, rotacao e escala (e cisalhamento) do objeto no espaco
uniform mat4 model;

varying vec3 vnormal;

varying vec3 vpos;

varying vec3 fcolor;

void main() {

	fcolor = color;

	vec4 point = vec4(position, 1.0);

	vpos = vec3(model * point);

	vec4 rot_normal = vec4(normal, 0.0);

	vnormal = vec3(model * rot_normal);



	gl_Position =  projection * view * model * point;

}
