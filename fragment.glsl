precision highp float;

// near, far, fovy, aspect
uniform mat4 projection;

// camera position, up, target (lookAt)
uniform mat4 view;

// posicao, rotacao e escala (e cisalhamento) do objeto no espaco
uniform mat4 model;

uniform vec3 luz;

varying vec3 vpos;

varying vec3 vnormal;

void main() {

	vec3 dir = normalize(luz - vpos);

	vec3 normal = normalize(vnormal);

	float lambert = dot(dir, normal);

	float ambiente = 0.2;

	float total = max(ambiente, lambert);

	gl_FragColor = vec4(total * vec3(1.0, 0.0 , 0.0) , 1.0);
}
