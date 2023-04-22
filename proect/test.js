const canvas = document.querySelector("canvas");
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const gl = canvas.getContext("webgl");

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();

function drawSquare(gl, x0, y0, size, color) {
    let x = 2 * x0 / (canvasWidth / cellSize);
    x--;
    let y = 2 * y0 / canvasHeight;
    y--;
    y = y * -1;

    let sizeX = 2 * size / (width + padding/cellSize - 1);
    let sizeY = 2 * size / canvasHeight;

    const positions = [
        x,  y,
        x ,  y - sizeY,
        x + sizeX,  y,
        x + sizeX,  y - sizeY
      ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}