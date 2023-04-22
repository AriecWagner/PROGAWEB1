let cellSize = 3.5;
let padding = 250;
let width = Math.floor((window.innerWidth ) / cellSize);
let height = Math.floor(window.innerHeight / cellSize);
//const maxValue = Number.MAX_VALUE / 100000;
let arrayForTexture = createArrayForTexture();
const maxValue = 999999999999999999999;
let firstPusk = true;
//console.log(maxValue);

let c = false;
let maxStink = 25000;
let matrix = createMatrix(width, height);
let spawnX, spawnY;
let colorForTick;
let valueForTick;
let antN = 70;
let newAntN = antN;
let newCellSize = cellSize;
let brushSize = 21;
let pheromonesWay = createPheromones();
let pheromonesFood = createPheromones();
let start = [401,500]; //401, 5
//let finish = [505,1055];
let ants;
let evaporationRate = 0.999;
//pheromonesFood[finish[0]][finish[1]] = 9999999999999999;
//pheromonesWay[start[0]][start[1]] = 9999999999999999;
//matrix[start[0]][start[1]] = "START";
//matrix[finish[0]][finish[1]] = "FOOD";
let flairRadius = 15;
let startRadius = 30;
let ConditionForContinue = false;
let conditionForCellSize = false;

const canvas = document.querySelector("canvas");
//const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl2");

canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

window.addEventListener('resize', () => {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
});
/*const vertexShaderSource = `
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
*/

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform float width;
  uniform float height;

  void main() {
    float x = gl_FragCoord.x/width;
    float y = gl_FragCoord.y/height;
    vec4 m = texture2D(u_texture, vec2(x, y));
    //gl_FragColor = texture2D(u_texture, vec2(x, y));
    gl_FragColor = vec4(m.r, m.g, m.b, 1.0);
  }
`;
const vertexShaderSource = `
  attribute vec2 a_position; 

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

let program;
createProgram();
function createProgram() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    program = gl.createProgram();
    const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      )
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    )
  
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      gl.deleteShader(fragmentShader)
      gl.deleteShader(vertexShader)
      return null
    }

    gl.useProgram(program);

    let widthLocation = gl.getUniformLocation(program, "width");
    let heigthLocation = gl.getUniformLocation(program, "height");
    gl.uniform1f(widthLocation, canvas.width);
    gl.uniform1f(heigthLocation, canvas.height);
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    /*gl.shaderSource(shader, source);
    gl.compileShader(shader);
    /*
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }*/
    return shader;
}

const positionBuffer = gl.createBuffer();


const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;


function drawSquare(gl, x0, y0, size, color) {
    let x = 2 * x0 / (canvas.width / cellSize);
    x--;
    let y = 2 * y0 / height;
    y--;
    y = y * -1;

    let sizeX = 2 * size / (width + padding/cellSize - 1);
    let sizeY = 2 * size / height;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        x,  y,
        x ,  y - sizeY,
        x + sizeX,  y,
        x + sizeX,  y - sizeY
      ];
      
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);
  
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
//drawSquare(gl, 100, 243, 100, [0.09, 0.09, 0.09, 1]);

const mouse = myMouse(canvas);
let RAF;
let RAFChangeData = requestAnimationFrame(uploadData);

main();

const BarierButton = document.getElementById('BarierButton');
const StartButton = document.getElementById('StartButton');
const FinishButton = document.getElementById('FinishButton');
const StartAllButton = document.getElementById('StartAllButton');
const pointer = document.getElementById("pointer");
const more = document.getElementById("more");
const btn = document.getElementById("btn");
const EraserButton = document.getElementById('Eraser');
const Slider = document.getElementById('SliderId');
const Select = document.getElementById('SelectId');
const ValueSlider = document.getElementById('ValueId');


let step0 = 400 / 1000;
let step1 = 200 / 1000;
let step2 = 10 / 1000

let condSlider0 = true;
let condSlider1 = true;
let condSlider2 = true;

let counterForStartAll = 0;

function uploadData() {
    if(Select.value == 0) {
        if (condSlider0) {
            Slider.value = brushSize / step0;
            condSlider0 = false;
            condSlider1 = true;
            condSlider2 = true;
        }
        
        if(true) {
            brushSize = Math.floor(Slider.value * step0);
        }
        ValueSlider.innerHTML = brushSize;
    }

    else if(Select.value == 1) {
        if (condSlider1) {
            Slider.value = newAntN / step1;
            condSlider0 = true;
            condSlider1 = false;
            condSlider2 = true;
        }
        
        newAntN = Math.floor(Slider.value * step1);
        ValueSlider.innerHTML = newAntN;
    }

    else if(Select.value == 2) {
        if (condSlider2) {
            Slider.value = (newCellSize - 1.8) / step2;
            condSlider0 = true;
            condSlider1 = true;
            condSlider2 = false;
        }
        
        newCellSize = Slider.value * step2;
        newCellSize+= 1.8;
        let tempWidth = Math.floor((window.innerWidth ) / newCellSize)
        tempWidth += (4 - (tempWidth % 4));
        newCellSize = window.innerWidth / tempWidth;
        ValueSlider.innerHTML = Slider.value;
    }/*
    if(firstPusk) {
        antN = newAntN;
        let x = Math.log(evaporationRate / (1 - evaporationRate)) / Math.log(Math.E);
        if (cellSize / newCellSize < 1) {
            x -= 2 *(newCellSize / cellSize);
            evaporationRate = 1 / (1 + Math.pow(Math.E, -x));
        }
        else {
            x += (cellSize / newCellSize);
            evaporationRate = 1 / (1 + Math.pow(Math.E, -x));
        }
        cellSize = newCellSize;
        width = Math.floor((window.innerWidth ) / cellSize);
        height = Math.floor(window.innerHeight / cellSize);
        matrix = createMatrix(width, height);
        pheromonesWay = createPheromones();
        pheromonesFood = createPheromones();
    }*/
    RAFChangeData = requestAnimationFrame(uploadData);
}

let stopIt = true;
StartAllButton.addEventListener('click', StartAllButtonFunc);
async function StartAllButtonFunc() {
    firstPusk = false;
    conditionForButtonsEraser = false;
    conditionForButtonsBarier = false;
    conditionForButtonFood = false;
    conditionForButtonsStart = false;
    if(counterForStartAll % 2 == 0) {
        counterForStartAll++;
        antAlgorithm(spawnX, spawnY);
    }
    else {
        if(isNotWorkAnts) {
            isNotWorkAnts = false;
            stopIt = false;
        }
        else {
            counterForStartAll++;
            await delay(100);
            antN = newAntN;
            let x = Math.log(evaporationRate / (1 - evaporationRate)) / Math.log(Math.E);
            if (cellSize / newCellSize < 1) {
                x -= (newCellSize / cellSize);
                evaporationRate = 1 / (1 + Math.pow(Math.E, -x));
            }
            else {
                x += (cellSize / newCellSize);
                evaporationRate = 1 / (1 + Math.pow(Math.E, -x));
            }
            cellSize = newCellSize;
            width = Math.floor((window.innerWidth ) / cellSize);
            height = Math.floor(window.innerHeight / cellSize);
            matrix = createMatrix(width, height);
            pheromonesWay = createPheromones();
            pheromonesFood = createPheromones();
            clearAll();
        }
        //console.log(matrix);
    }
}


EraserButton.addEventListener('click', EraserButtonFunc);
function EraserButtonFunc() {
    firstPusk = false;
    stopIt = true;
    if(conditionForButtonsEraser == true) {
        conditionForButtonsEraser = false;
    }
    else {
        prevConditionForButtonsEraser = true;
        prevConditionForButtonFood = false;
        prevConditionForButtonsBarier = false;
        prevConditionForButtonsStart = false;
        conditionForButtonsEraser = true;
        conditionForButtonsBarier = false;
        conditionForButtonFood = false;
        conditionForButtonsStart = false;
    }
    colorForTick = "rgb(0, 0, 0)";
    valueForTick = true;
    //counterForButton++;
    RAF = requestAnimationFrame(tick);
}

BarierButton.addEventListener('click', BarierButtonFunc);
function BarierButtonFunc() {
    firstPusk = false;
    counterForButton++;
    stopIt = true;
    if(conditionForButtonsBarier == true) {
        conditionForButtonsBarier = false;
    }
    else {
        prevConditionForButtonsEraser = false;
        prevConditionForButtonFood = false;
        prevConditionForButtonsBarier = true;
        prevConditionForButtonsStart = false;
        conditionForButtonsEraser = false;
        conditionForButtonsBarier = true;
        conditionForButtonFood = false;
        conditionForButtonsStart = false;
    }
    colorForTick = "rgb(150, 110, 50)";
    valueForTick = false;
    //counterForButton++;
    RAF = requestAnimationFrame(tick);
}

StartButton.addEventListener('click', StartButtonFunc);
function StartButtonFunc() {
    firstPusk = false;
    counterForButton++;
    stopIt = true;
    if(conditionForButtonsStart == true) {
        conditionForButtonsStart = false;
    }
    else {
        prevConditionForButtonsEraser = false;
        prevConditionForButtonFood = false;
        prevConditionForButtonsBarier = false;
        prevConditionForButtonsStart = true;
        conditionForButtonsEraser = false;
        conditionForButtonsBarier = false;
        conditionForButtonFood = false;
        conditionForButtonsStart = true;
    }
    colorForTick = "blue";
    valueForTick = "START";
    //counterForButton++;
    RAF = requestAnimationFrame(tick);
    //antAlgorithm();
}

FinishButton.addEventListener('click', FinishButtonFunc);
function FinishButtonFunc() {
    firstPusk = false;
    counterForButton++;
    stopIt = true;
    if(conditionForButtonFood == true) {
        conditionForButtonFood = false;
    }
    else {
        prevConditionForButtonsEraser = false;
        prevConditionForButtonsBarier = false;
        prevConditionForButtonsStart = false;
        prevConditionForButtonFood = true;
        conditionForButtonsEraser = false;
        conditionForButtonsBarier = false;
        conditionForButtonFood = true;
        conditionForButtonsStart = false;
    }
    colorForTick = "red";
    valueForTick = "FOOD";
    //counterForButton++;
    RAF = requestAnimationFrame(tick);

}

function readMore() {
    if(pointer.style.display === "none") {
        pointer.style.display = "inline";
        btn.innerHTML = "Подробнее";
        more.style.display = "none";
    }
    else {
        pointer.style.display = "none";
        btn.innerHTML = "Скрыть";
        more.style.display = "inline";
    }
}

function main() {
    createAndShowTexture();
    /*let y = 0.993;
    let x = Math.log(y / (1 - y)) / Math.log(Math.E);
    console.log(x , "  ", y);

    x -= 0.02;
    y = 1 / (1 + Math.pow(Math.E, -x));

    console.log(x , "  ", y);

    console.log(width, height);*/

}

let isNotWorkAnts = true;

let counterForButton = 0;
let conditionForButtonsBarier = false;
let conditionForButtonFood = false;
let conditionForButtonsStart = false;
let conditionForButtonsEraser = false;

let prevConditionForButtonsBarier = false;
let prevConditionForButtonFood = false;
let prevConditionForButtonsStart = false;
let prevConditionForButtonsEraser = false;

async function createField() {
    //drawSquare(gl, 0, 0, width, [0.08, 0.08, 0.08, 1]);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.beginPath();
    context.rect(0, 0, window.innerWidth - 250, window.innerHeight);
    context.stroke();
    context.fillStyle = "rgb(10,10,10)";
    context.fill();
}

function createMatrix(width, height) {
    const matrix = [];

    for (let i = 0; i < height ;i++) {
        const row = []; 

        for(let j = 0; j < width; j++) {
            row.push(true);
        }
        matrix.push(row);
    }

    return matrix;
}

function createPheromones() {
    let pheromones = [];

    for(let i = 0; i < matrix.length; i++) {
        let row = [];
        for (let j = 0; j < matrix[i].length; j++) {
            row.push(0);
        }
        pheromones.push(row);
    }

    return pheromones;
}

function createCells() {
    let cells = [];
    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        for(let j = 0; j < matrix[i].length; j++) {
            let cell = {
                updateCell(i, j, time) {
                    
                    while(time > 0) {
                        setInterval( function() {
                        pheromonesFood[i][j] *= evaporationRate;
                        pheromonesWay[i][j] *= evaporationRate;
                        let blue = (255 * pheromonesWay[i][j]) / 10000;
                        let red = (255 * pheromonesFood[i][j]) / 10000;
                        draw(j, i, 1, 'rgb('+red+',0,'+blue+')');}, 100);
                        time -= 100;
                    }
                }
            }
            row.push(cell);
        }
        cells.push(row);
    }
    return cells;
}

function createAnts(coordinatsX, coordinatsY) {
    let ants = [];
    for (let i = 0; i < antN; i++) {
        let ant = {
            x: coordinatsX,
            y: coordinatsY,

            prevX: coordinatsX,
            prevY: coordinatsY,
    
            isFindFood: false
        };
        ants.push(ant);
    }
    return ants;
}

function createPrevDirection() {
    let prevDirection = [];
    let counterForPD = 1;
    let step = 360 / antN;
    for(let i = 0; i < 360; i+= step) {
        prevDirection.push(i);
    }
    return prevDirection;
}

function createArrayForTexture() {
    let arr = [];
    for(let i = 0; i < width * height * 3; i++) {
        arr.push(0);
    }
    return arr;
}

function updateArrayForTexuture() {
    let ind, row, col;
    let border = 8;
    let x;
    let redR, redG, redB;
    let blueR, blueG, blueB;
    for(let i = 0; i < width * height * 3; i+= 3) {
        ind = i / 3;
        row = Math.floor(ind / width);
        col = (ind % width);
        /*if(counterForStartAll % 2 == 0 && !isNotWorkAnts) {
            return;
        }*/
        if(matrix[row][col] == false) {
            arrayForTexture[i] = 150;
            arrayForTexture[i + 1] = 110;
            arrayForTexture[i + 2] = 50;
        }
        else if(matrix[row][col] == "FOOD") {
            pheromonesFood[row][col] = maxValue;
            arrayForTexture[i] = 220;
            arrayForTexture[i + 1] = 30;
            arrayForTexture[i + 2] = 40;
        }
        else if (matrix[row][col] == "START") {
            pheromonesWay[row][col] = maxValue;
            arrayForTexture[i] = 40;
            arrayForTexture[i + 1] = 100;
            arrayForTexture[i + 2] = 200;
        }
        else if(matrix[row][col] == "ANT") {
            arrayForTexture[i] = 255;
            arrayForTexture[i + 1] = 255;
            arrayForTexture[i + 2] = 255;
        }
        else {
            redR = (pheromonesFood[row][col] * 220) / maxStink;
            redG = (pheromonesFood[row][col] * 30) / maxStink;
            redB = (pheromonesFood[row][col] * 40) / maxStink;

            blueR = (pheromonesWay[row][col] * 40) / maxStink;
            blueG = (pheromonesWay[row][col] * 100) / maxStink;
            blueB = (pheromonesWay[row][col] * 200) / maxStink;            

            arrayForTexture[i] = Math.round(Math.max(redR, blueR));
            arrayForTexture[i + 1] = Math.round((redG + blueG) / 2);
            arrayForTexture[i + 2] = Math.round(Math.max(blueB, blueB));

            pheromonesWay[row][col] *= evaporationRate;
            pheromonesFood[row][col] *= evaporationRate;
        }

    }
}

function createAndShowTexture() {
    gl.useProgram(program);
    let positions = new Float32Array([
        -1, 1,
        1, 1,
        -1, -1,
        1, -1,
    ]);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(arrayForTexture));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    let textureLocation = gl.getUniformLocation(program, "u_texture");
    gl.uniform1i(textureLocation, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function delay(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

function tick () {
    RAF = requestAnimationFrame(tick);    
    if(!isNotWorkAnts && stopIt) {
        isNotWorkAnts = true;
    }
    //console.log(mouse.x, " ", mouse.y);
    if(mouse.x > ((canvas.width) - brushSize*cellSize + 2) || mouse.y > canvas.height) {
        return;
    }

    mouse.update();
    if(mouse.left && mouse.prevLeft) {
        //console.log("AAAAAA");
        const x = Math.floor(mouse.x / cellSize);
        const y = height -  Math.floor(mouse.y / cellSize);
        //draw(x-10, y-10, 10*2, "red");
        //drawArc(x, y, brushSize, colorForTick);
        changeMatrix(x, y, brushSize, valueForTick);
        updateArrayForTexuture();
        createAndShowTexture();
        if(conditionForButtonsStart) {
            spawnX = x;
            spawnY = y;
        }
    }
    //updateArrayForTexuture();
    //createAndShowTexture();

    //console.log(matrix[0][0]);
    //console.log(matrix[0][700]);
    if(!isNotWorkAnts) {
        conditionForButtonsEraser = false;
        conditionForButtonsBarier = false;
        conditionForButtonFood = false;
        conditionForButtonsStart = false;
        stopIt = true;
        cancelAnimationFrame(RAF);
    }
    if(prevConditionForButtonsEraser && !conditionForButtonsEraser) {
        isNotWorkAnts = false;
        cancelAnimationFrame(RAF);
    }
    if(prevConditionForButtonsBarier && !conditionForButtonsBarier) {
        isNotWorkAnts = false;
        cancelAnimationFrame(RAF);
    }
    if(prevConditionForButtonFood && !conditionForButtonFood) {
        isNotWorkAnts = false;
        cancelAnimationFrame(RAF);
    }
    if(prevConditionForButtonsStart && !conditionForButtonsStart) {
        isNotWorkAnts = false;
        cancelAnimationFrame(RAF);
    }
}

function changeMatrix(x, y, size, value) {
    for(let i = -size; i <= size; i++) {
        for(let j = -size; j <= size; j++) {
            let distance = Math.sqrt(i*i + j*j);
            if(i + y >=0 && j + x >= 0 && x + j < width && i + y < height && distance < size) {
                matrix[y + i][x + j] = value;
                if (value == "FOOD") {
                    pheromonesFood[y + i][x + j] = maxValue;
                }
                else if (value == "START") {
                    pheromonesWay[y + i][x + j] = maxValue;
                }
                else if (value == true || value == false) {
                    pheromonesFood[y + i][x + j] = 0;
                    pheromonesWay[y + i][x + j] = 0;
                }
            }
        }
    }
}


function clearAll() {
    for(let i = 0; i < matrix.height; i++) {
        for(let j = 0; j < matrix.width; j++) {
            matrix[i][j] = true;
            pheromonesFood[i][j] = 0;
            pheromonesWay[i][j] = 0;
        }
    }
    updateArrayForTexuture();
    createAndShowTexture();
}

function draw(x, y, size, dpColor) {
    context.fillStyle = dpColor;
    context.fillRect(
        x * cellSize,
        y * cellSize,
        size * cellSize,
        size * cellSize
    );
}

function drawArc(x, y, size, dpColor) {
    context.beginPath();
    context.arc(x * cellSize, y * cellSize, size * cellSize, 0, 2*Math.PI, false);
    context.fillStyle = dpColor;
    context.fill();
}

function getRandomNumInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function myMouse(element) {
    const mouse = {
        x: 0,
        y: 0,

        left: false,
        prevLeft: false,

        over: false,

        update () {
            this.prevLeft = this.left;
        }
    };

    element.addEventListener('mouseenter', mouseenterHandler);
    element.addEventListener('mouseleave', mouseleaveHandler);
    element.addEventListener("mousemove", mousemoveHandler);
    element.addEventListener("mousedown", mousedownHandler);
    element.addEventListener("mouseup", mouseupHandler);

    function mouseenterHandler() {
        mouse.over = true;
    }

    function mouseleaveHandler() {
        mouse.over = false;
    }

    function mousemoveHandler(event) {
        const rect = element.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    }

    function mousedownHandler(event) {
        mouse.left = true;
    }

    function mouseupHandler(event) {
        mouse.left = false;
    }

    return mouse;
}


async function reloadPheromones() {
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            if(matrix[i][j] != "FOOD") {
                pheromonesWay[i][j] *= evaporationRate;
            }
            if(matrix[i][j] != "START") {
                pheromonesFood[i][j] *= evaporationRate;
            }
            
            let blue = (255 * pheromonesWay[i][j]) / 10000;
            let red = (255 * pheromonesFood[i][j]) / 10000;
            
            //drawSquare(gl, j, i, 1, [0.09, 0.09, 1, 1]);
            if((blue > 19 || red > 19) && matrix[i][j] != false && matrix[i][j] != "FOOD" && matrix[i][j] != "START") {
                draw(j, i, 1, 'rgb('+red+',0,'+blue+')');
            }
        }
    }
}

/*
function changeEvaporationStink(evaporationStink, xForStink, xForRate, diagonal, way, theShortestWay) {
    if (way < theShortestWay) {
        let difference = way / diagonal;
        if(difference < 1) {
            xForRate += 2 * difference;
            xForStink += difference;
        }
        else {
            //difference--;
            xForRate -= difference;
            xForStink -= difference;
        }
        evaporationRate = 1 / (1 + Math.pow(Math.E, -xForRate));
        evaporationStink = 1 / (1 + Math.pow(Math.E, -xForStink));
    }
    return theShortestWay, xForStink, evaporationStink;
}
*/
function changeEvaporationStink(evaporationStink, xForStink, xForRate, diagonal, way, theShortestWay) {
    let difference = way / theShortestWay;
    theShortestWay = way;
    if(difference > 1) {
        xForStink += (difference / 2);
    }
    else {
        difference = 1 - (1 / difference);
        xForStink -= (difference / 2);
    }
    evaporationStink = 1 / (1 + Math.pow(Math.E, -xForStink));
    if(theShortestWay < way) {
        
    }
    //evaporationRate = 1 / (1 + Math.pow(Math.E, -xForRate));
    //console.log("AAAAA ", evaporationStink);
    //console.log(evaporationStink, " AAAAA");
    return theShortestWay, xForStink, evaporationStink;
}


async function antAlgorithm(spawnX, spawnY) {
    ants = createAnts(spawnX, spawnY);
    isNotWorkAnts = false;
    c = true;
    //console.log(spawnX, spawnY);
    let chosenDots = [];
    let prevDirection = createPrevDirection();
    let Condition = [];
    let setPheromones = [];
    let stink = [];
    let way = [];
    let times = [];
    let theShortestWay = [];
    let prevDot = [];
    let xtemp = Math.log(0.993 / (1 - 0.993)) / Math.log(Math.E);
    let evaporationStink = [];
    let xForStink = [];
    let differenceS = [];
    let xForRate = Math.log(evaporationRate / (1 - evaporationRate)) / Math.log(Math.E);
    let cells = createCells();
    let diagonal = (Math.sqrt(width*width + height * height)) * 4;
    for(let i = 0; i < antN; i++) {
        times.push(0);
        way.push(0);
        Condition.push(false);
        prevDot.push([0, 0, 0]);
        theShortestWay.push(diagonal);
        stink.push(20000);
        evaporationStink.push(0.993);
        xForStink.push(xtemp);
    }
    //console.log("ETO X    ",  xForStink);
    let color = "blue";
    /*firstSteps();
    while(!ConditionForContinue) {
        await delay(0.1);
    }*/
    let counter = 1;
    //RAF2 = requestAnimationFrame(reloadPheromones);
    //console.log(ants);
    while(true) {
        /*if(counter % 3 == 0) {
            reloadPheromones();
        }*/
        if(isNotWorkAnts) {
            while(isNotWorkAnts) {
                await delay(1);
            }
        }
        await delay(0.1);
        for(let i = 0; i < antN; i++) {
            if(matrix[ants[i].y][ants[i].x] == false) {
                ants[i].x = spawnX;
                ants[i].y = spawnY;
            }

            if(matrix[ants[i].prevY][ants[i].prevX] != "FOOD" && matrix[ants[i].prevY][ants[i].prevX] != "START" && matrix[ants[i].prevY][ants[i].prevX] != false) {
                matrix[ants[i].prevY][ants[i].prevX] = true;
            }
            ants[i].prevX = ants[i].x;
            ants[i].prevY = ants[i].y;
            if(counter > 3 && matrix[ants[i].prevY][ants[i].prevX] != "FOOD" && matrix[ants[i].prevY][ants[i].prevX] != "START" && matrix[ants[i].prevY][ants[i].prevX] != false) {
                //console.log([ants[i].prevY, ants[i].prevX]);
                matrix[ants[i].prevY][ants[i].prevX] = "ANT";
            }

            if(matrix[ants[i].y][ants[i].x] == "FOOD" && !ants[i].isFindFood) {
                times[i] = 0;
                if(prevDirection[i] < 180) {
                    prevDirection[i] += 180;
                }
                else {
                    prevDirection[i] -= 180;
                }
                let tre = evaporationStink;
                theShortestWay[i], xForStink[i], evaporationStink[i] = changeEvaporationStink(evaporationStink[i], xForStink[i], xForRate, diagonal, way[i], theShortestWay[i]);
                way[i] = 0;
                ants[i].isFindFood = true;
                stink[i] = maxStink;
            }
            else if (matrix[ants[i].y][ants[i].x] == "START" && ants[i].isFindFood) {
                //console.log(prevDirection[i]);
                times[i] = 0;
                if(prevDirection[i] < 180) {
                    prevDirection[i] += 180;
                }
                else {
                    prevDirection[i] -= 180;
                }
                let tre = evaporationStink;
                theShortestWay[i], xForStink[i], evaporationStink[i] = changeEvaporationStink(evaporationStink[i], xForStink[i], xForRate, diagonal, way[i], theShortestWay[i]);
                way[i] = 0;
                //console.log(prevDirection[i]);
                ants[i].isFindFood = false;
                stink[i] = maxStink;
            }


            if(ants[i].isFindFood) {
                pheromonesFood[ants[i].y][ants[i].x] = stink[i];
            }
            else {
                pheromonesWay[ants[i].y][ants[i].x] = stink[i];
            }

            
            let bonus = 0;
            /*if(Condition[i] == true) {
                bonus = 500000;
                Condition[i] = false;
            }*/
            let chosenDot = chooseDirection(ants[i].x, ants[i].y, ants[i].isFindFood, prevDirection[i], Condition[i], bonus, prevDot[i]);
            //console.log(chosenDot);
            prevDot[i] = chosenDot[0];
            ants[i].x = chosenDot[2];
            ants[i].y = chosenDot[1];
            way[i]++;
            /*if(counter % 3) {
                if(ants[i].isFindFood) {
                    draw(ants[i].x, ants[i].y, 1, 'rgb(255, 150, 150)');
                }
                else {
                    draw(ants[i].x, ants[i].y, 1, 'rgb(150, 150, 255)');
                }
            }
            */

            prevDirection[i] = chosenDot[3];
            if (stink[i] > 0) {
                stink[i] *= evaporationStink[i];
            }
            times[i]++;
            if(times[i] > diagonal * 1.5) {
                ants[i].x = spawnX;
                ants[i].y = spawnY;
                times[i] = 0;
            }
            
            //console.log(prevDirection[i]);
        }
        if(counterForStartAll % 2 == 0) {
            ants = 0;
            break;
        }
        if(counter < 3) {
            for (let i = 0; i < height ;i++) {
                for(let j = 0; j < width; j++) {
                    if(matrix[i][j] == "ANT") {
                        matrix[i][j] = true;
                        pheromonesFood[i][j] = 0;
                        pheromonesWay[i][j] = 0;
                    }
                }
            }
        }
        stopIt = true;
        counter++;
        updateArrayForTexuture();
        createAndShowTexture();
    }
}

function getProbability(prevDirectionDegrees, degrees) {
    let difference = (Math.abs(prevDirectionDegrees - degrees));
    if(difference > 180) {
        difference = 360 - difference;
    }
    if(difference > 110) {
        difference = Math.pow(360 - difference, 0.15);
    }
    else {
        difference = Math.pow((360 - difference),1.95);
    } 
    difference = Math.pow(difference, 2);
    return difference;
}

function chooseDirection(x, y, foodCondition, prevDirection, Condition, bonus, prevDot) {
    let variants = [];
    let intrestingVariants = 0;
    for (let i = -flairRadius; i <= flairRadius; i++) {
        for (let j = -flairRadius; j <= flairRadius; j++) {
            //console.log(x + j, "   ", y + i, "||||", x, "   ", y);
            //if((i > 0 && i + y > height) || (j > 0 && j + x > ))
            if(!(i == 0 && j == 0) &&
            j + x >= 0 && i + y >= 0 &&
            j + x < width && i + y < height &&
            matrix[y + i][x + j]!=false) {
                let degrees = getDegrees(x, y, j + x, i + y, flairRadius);
                let difference = Math.max(Math.abs(i), Math.abs(j));
                if(foodCondition) {
                    if(matrix[y + i][x + j] == "START") {
                        //console.log("GGGGGGGGGGGG");
                        variants.push([((pheromonesWay[i + y][j + x])+ 1) * 10000 * getProbability(prevDirection, degrees), i  + y, j + x]);
                    }
                    else {
                        variants.push([(((pheromonesWay[i + y][j + x])+ 1) * 1700) * difference * getProbability(prevDirection, degrees), i  + y, j + x]);
                    }
                }
                else {
                    if(matrix[y + i][x + j] == "FOOD") {
                        variants.push([((pheromonesFood[i + y][j + x]) + 1) * 10000 * getProbability(prevDirection, degrees) , i  + y, j + x]);
                    }
                    else {
                        variants.push([(((pheromonesFood[i + y][j + x]) + 1) * 1700) * difference * getProbability(prevDirection, degrees) , i  + y, j + x]);
                    }
                }
            }
            else {
                //variants.push([0, i + y, j + x]);
            }
            
        }
    }
    let savePrevDot = prevDot;
    let prevPrevDot = prevDot;
    //variants.sort((a, b) => a[0] - b[0]);
    while (variants.length > 0) {
        //let index = i;
        let index = getRandomElementFromArray(variants);
        let forcheck = variants[index];
        //console.log(variants[index][0]);
        //console.log(prevDot[2], prevDot[1]);
        let differenceX = Math.abs(prevDot[2] - x); 
        let differenceY = Math.abs(prevDot[1] - y); 
        if((prevDot[0] <= variants[index][0]) || (prevDot[2] == x && prevDot[1] == y)) {
            savePrevDot = variants[index];
        }
        //console.log(savePrevDot);
        //let degrees = getDegrees(x, y, variants[index][2], variants[index][1], flairRadius);
        let angle = getDegrees(x, y, savePrevDot[2], savePrevDot[1], flairRadius);
        let coordinats2 = toDot2(x, y, savePrevDot[2], savePrevDot[1]);
        let coordinats = getCoordinats(coordinats2[0], coordinats2[1], x, y, 1, angle);
        let newX = coordinats[0];
        let newY = coordinats[1];

        //console.log(coordinats);
        if(newX <= 5 ||  newY <= 5) {
            //console.log(prevDirection, "   ", 180 - angle);
            let coordinats = getCoordinats(savePrevDot[2], savePrevDot[1], x, y, 1, angle);
            let newX = coordinats[0];
            let newY = coordinats[1]
            prevDot = [0, 0, 0];
            //console.log(newX, newY);
            if(newX >= 0 && newY >=0 && newX < width && newY < height && matrix[newY][newX] != false) {
                prevDirection = 180 - angle;
            }
        }
        if(newY > height - 5) {
            //console.log(prevDirection, "   ", 180 - angle);
            let coordinats = getCoordinats(savePrevDot[2], savePrevDot[1], x, y, 1, angle);
            let newX = coordinats[0];
            let newY = coordinats[1]
            prevDot = [0, 0, 0];
            //console.log(newX, newY);
            if(newX >= 0 && newY >=0 && newX < width && newY < height && matrix[newY][newX] != false) {
                prevDirection = 540 - angle;
            }
        }
        if(newX > width - 5) {
            //console.log(prevDirection, "   ", 180 - angle);
            let coordinats = getCoordinats(savePrevDot[2], savePrevDot[1], x, y, 1, angle);
            let newX = coordinats[0];
            let newY = coordinats[1]
            prevDot = [0, 0, 0];
            //console.log(newX, newY);
            if(newX >= 0 && newY >=0 && newX < width && newY < height && matrix[newY][newX] != false) {
                prevDirection = 90 + angle;
            }
        }
        if(variants[index][2] != prevDot[2] && variants[index][1] != prevDot[1] && newX >= 0 && newY >= 0 && newX < width && newY < height && matrix[newY][newX] != false) {
            if(prevDot[0] < variants[index][0] || (prevDot[1] == y && prevDot[2] == x)) {
                prevDot = variants[index];
            }
            //prevDirection = angle;
            /*let nextDirection = "";
                if(y < newY) {
                    nextDirection += "SOUTH";
                }
                else if(y > newY) {
                    nextDirection += "NORTH";
                }
                if(x < newX) {
                    nextDirection += "EAST";
                }
                else if(x > newX) {
                    nextDirection += "WEST"
                }
            if (prevDot[0] > prevPrevDot[0]) {
                prevDirection = nextDirection;
            }*/
            //console.log(newY);
            return [prevDot, newY, newX, prevDirection];
        }
        else if(newX >= 0 && newY >=0 && newX < width && newY < height && matrix[newY][newX] == false) {
            prevDot[0] = 0;
            prevDirection = angle - getRandomNumInRange(1,85);
        }
        else if (savePrevDot == prevDot){
            prevDot[0] = 0;
        }
        variants.splice(index, 1);
        /*if(savePrevDot == variants[index]) {
            variants.splice(index, 1);
        }*/
    }
    return 5;
}

function toDot(x0, y0, x, y) {
    let angle = getDegrees(x0, y0, x, y, flairRadius);
    while(x0 != x && y0 != y) {
        //let distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
        let coordinats = getCoordinats(x, y, x0, y0, 1, angle);
        //draw(x0, y0, 1, "red");
        x0 = coordinats[0];
        y0 = coordinats[1];
    }
    
}

function toDot2(x0, y0, x, y) {
    let angle = getDegrees(x0, y0, x, y, flairRadius);
    for(let i = 0; i < 2 && (x0 != x && y0 != y); i++) {
        //let distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
        let coordinats = getCoordinats(x, y, x0, y0, 1, angle);
        //draw(x0, y0, 1, "red");
        if(matrix[coordinats[1]][coordinats[0]] != false) {
            x0 = coordinats[0];
            y0 = coordinats[1];
        }
    }
    return [x0, y0];
}



function getRandomElementFromArray(arr) {
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += arr[i][0];
    }
    let randomValue = getRandomNumInRange(1, sum);

    let tempSum = 0;
    let prevSum = 0;
    for(let i = 0; i < arr.length; i++) {
        tempSum += arr[i][0];
        if(randomValue < tempSum && randomValue >= prevSum) {
            if(i == 0) {
                return i;
            }
            else {
                return i - 1;
            }
        }
        else if(randomValue == tempSum) {
            return i;
        }
        prevSum = tempSum;
    }
}
//function getRandomElementFromArray2

function getCoordinats(ax, ay, bx, by, r, angle) {
    let primAngle = angle;

    if (angle > 270) {
        angle = ((angle - 270) * Math.PI) / 180;
    }
    else if (angle > 180) {
        angle = ((angle - 180) * Math.PI) / 180;
    }
    else if (angle > 90) {
        angle = ((angle - 90) * Math.PI) / 180;
    }
    else {
        angle = (angle * Math.PI) / 180;
    }
    
    let coordinats = [];

    coordinats.push(Math.round(bx + r  * Math.cos(angle)));
    coordinats.push(Math.round(by + r  * Math.sin(angle)));

    let deifferenceX = Math.abs( Math.abs(bx) -  Math.abs(coordinats[0]));
    let deifferenceY =  Math.abs( Math.abs(by)-  Math.abs(coordinats[1]));
    
   if (primAngle > 90 && primAngle <= 180) {
        coordinats[0] = Math.abs(coordinats[0] - deifferenceX * 2);
    }
    else if (primAngle > 180 && primAngle <= 270) {
        coordinats[0] = Math.abs(coordinats[0] - deifferenceX * 2);
        coordinats[1] = Math.abs(coordinats[1] - deifferenceY * 2);
    }
    else if (primAngle > 270 && primAngle <= 360) {
        coordinats[1] =  Math.abs(coordinats[1] - deifferenceY * 2);
    }

    coordinats[0] = Math.abs(coordinats[0]);
    coordinats[1] = Math.abs(coordinats[1]);

    return coordinats;
}

function getDegrees(x0, y0, x1, y1, r) {
    let x2 = x0 + r;
    let y2 = y0;

    let AB = Math.sqrt(Math.pow((x0-x2),2) + Math.pow((y0-y2),2));
    let BC = Math.sqrt(Math.pow((x1-x0),2) + Math.pow((y1-y0),2));
    let AC = Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));

    let x = (AB**2 + BC**2 - AC**2) / (2 * AB * BC);
    x = Math.acos(x);
    x = (x * 180) / Math.PI;
    if(y1 < y0) {
        return 360 - x;
    }
    else {
        return x;
    }
}
