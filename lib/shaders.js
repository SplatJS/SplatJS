"use strict";

function compile(gl, type, src) {
	if (!type) {
		console.error("Invalid shader type: " + type);
		return null;
	}
	var shader = gl.createShader(gl[type]);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

var shaderTypes = {
	"x-shader/x-fragment": "FRAGMENT_SHADER",
	"x-shader/x-vertex": "VERTEX_SHADER"
};

var shaderSrc = {
	"fragment.glsl": {
		type: "x-shader/x-fragment",
		src: "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void) {\n\tgl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n};",
	},
	"vertex.glsl": {
		type: "x-shader/x-vertext",
		src: "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n}"
	}
};

function get(gl, id) {
	var shaderScript = shaderSrc[id];
	if (!shaderScript) {
		return null;
	}
	return compile(gl, shaderTypes[shaderScript.type], shaderScript.src);
}

function link(gl, shaders, vertexAttribArrays, uniformVars) {
	var program = gl.createProgram();

	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, shaders[i]);
	}

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Could not initialise shaders");
		return null;
	}

	gl.useProgram(program);

	bindVertexAttribArrays(gl, program, vertexAttribArrays);
	bindUniformVars(gl, program, uniformVars);

	return program;
}

function bindVertexAttribArrays(gl, shaderProgram, vertexAttribArrays) {
	Object.keys(vertexAttribArrays).forEach(function(key) {
		shaderProgram[key] = gl.getAttribLocation(shaderProgram, vertexAttribArrays[key]);
		gl.enableVertexAttribArray(shaderProgram[key]);
	});
}

function bindUniformVars(gl, shaderProgram, uniformVars) {
	Object.keys(uniformVars).forEach(function(key) {
		shaderProgram[key] = gl.getUniformLocation(shaderProgram, uniformVars[key]);
	});
}

module.exports = {
	compile: compile,
	get: get,
	link: link
};
