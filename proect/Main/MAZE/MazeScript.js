const wallColor = "rgb(30, 30, 30)";
const voidColor = "rgb(230, 230, 230)";
const backgroundColor = "rgb(130, 0, 165)";

let width = 20; // max 300 min 4
let height = width;

const padding = 10;
let cellSize = (window.innerHeight - 49) / width;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let matrix = createMatrix(width, height);
const mouse = myMouse(canvas);

const StartWay = document.getElementById('StartWay');
const Regenarate = document.getElementById('Regenarate');
const ChangeSize = document.getElementById('Accept');
const InputWindow = document.getElementById('valueNow');
const SpeedSlider = document.getElementById('speed');
const TextForSpeed = document.getElementById('textForSpeed');
const AddWall = document.getElementById('AddWall');
const DestroyWall = document.getElementById('DestroyWall');
let conditionForAcynfFunc = true;
let start;
let finish;
let RAF;
let RAF2;
let speed;
/*
(window.innerWidth).style.width = window.innerWidth + 'px';
(window.innerHeight).style.height = window.innerHeight + 'px';

window.addEventListener('resize', () => {
    (window.innerWidth).style.width = window.innerWidth + 'px';
    (window.innerHeight).style.height = window.innerHeight + 'px';
});*/

//////////////////////////////////////////

//STYLE PARAMETRS
/*
Back.style.top = "5%";
Back.style.right = "1.53%";


AddWall.style.top = "82%";
AddWall.style.right = "22.13%";

DestroyWall.style.top = "93%";
DestroyWall.style.right = "24.7%";

TextForSpeed.style.color = wallColor;
TextForSpeed.style.fontSize = '46px';
TextForSpeed.style.padding = '10px 20px';
TextForSpeed.style.border = 'none';
TextForSpeed.style.borderRadius = '5px';
TextForSpeed.style.cursor = 'pointer';
TextForSpeed.style.position = "absolute";
TextForSpeed.style.top = "64%";
TextForSpeed.style.right = "21.6%";


InputWindow.style.top = "42%";
InputWindow.style.right = "11.8%";


ChangeSize.style.top = "53%";
ChangeSize.style.right = "21.5%";


Regenarate.style.top = "25%";
Regenarate.style.right = "2.58%";

StartWay.style.top = "11%";
StartWay.style.right = "18.5%";*/

//////////////////////////////////////////////////////////////

drawMaze();

let valueForTick2;
let conditionForAdd = false;
let conditionForDestroy = false;
let prevConditionForAdd = false;
let prevConditionForDestroy = false;


AddWall.addEventListener('click', AddWallFunc);
function AddWallFunc() {
    if(conditionForAdd == true) {
        conditionForAdd = false;
    }
    else {
        prevConditionForDestroy = false;
        prevConditionForAdd = true;
        prevConditionForAdd = true;
        conditionForDestroy = false;
    }

    valueForTick2 = false;
    cancelAnimationFrame(RAF2);
    cancelAnimationFrame(RAF);
    RAF2 = requestAnimationFrame(tick2);
}

DestroyWall.addEventListener('click', DestroyWallFunc);
function DestroyWallFunc() {
    if(conditionForDestroy == true) {
        conditionForDestroy = false;
    }
    else {
        prevConditionForDestroy = true;
        prevConditionForAdd = false;
        prevConditionForAdd = false;
        conditionForDestroy = true;
    }


    valueForTick2 = true;
    cancelAnimationFrame(RAF2);
    cancelAnimationFrame(RAF);
    RAF2 = requestAnimationFrame(tick2);
}

Regenarate.addEventListener('click', RegenarateFunction);
function RegenarateFunction() {
    conditionForAcynfFunc = false;
    deleteArray(matrix);
    matrix = createMatrix(width, height);
    console.log(matrix);
    paintOverMaze();
    createMaze();
}

StartWay.addEventListener('click', StartWayFunction);
function StartWayFunction() {
    console.log(matrix);
    conditionForAdd = false;
    conditionForDestroy = false;
    conditionForAcynfFunc = false;
    start = undefined;
    finish = undefined;
    clearMaze();
    console.log(matrix);
    cancelAnimationFrame(RAF2);
    RAF = requestAnimationFrame(tick);

}

ChangeSize.addEventListener('click', ChangeSizeFunction);
function ChangeSizeFunction() {
    newValue = document.getElementById('valueNow').value;
    conditionForAcynfFunc = false;
    if (!isNaN(newValue) && newValue <= 300 && newValue >= 4) {
        width = newValue;
        height = newValue;
        cellSize = 1025 / newValue;

        deleteArray(matrix);
        matrix = createMatrix(width, height);
        console.log(matrix);
        paintOverMaze();
        createMaze();
    }
}

//////////////////////////////////////////////////////////////

function createMatrix(width, height) {
    const matrix = [];

    for (let i = 0; i < width ;i++) {
        const row = []; 

        for(let j = 0; j < height; j++) {
            row.push(false);
        }
        matrix.push(row);
    }

    return matrix;
}

function createVisited() {
    const visited = [];

    for(let i = 0; i < height; i++) {
        const row = [];

        for(let j = 0; j < width; j++) {
            if (matrix[i][j] == true) {
                row.push(null);
            }
            else {
                row.push(false);
            }
        }
        visited.push(row);
    }
    return visited;
}

function createParents() {
    const parents = [];

    for(let i = 0; i < height; i++) {
        const row = [];

        for(let j = 0; j < width; j++) {
            if (matrix[i][j] == true) {
                row.push(true);
            }
            else {
                row.push(false);
            }
        }
        parents.push(row);
    }
    return parents;
}

function createMaze() {
    let startDotX  = getRandomNumInRange(0, width/2) * 2 + 1;
    let startDotY  = getRandomNumInRange(0, height/2) * 2 + 1;
    let delay = 300;

    matrix[startDotX][startDotY] = true;
    setTimeout(function() {drawPass(startDotX, startDotY, voidColor)}, delay);

    let check = [];
    check = createValidCells(check, startDotX, startDotY, height, width);

    while(check.length > 0) {
        let index = getRandomNumInRange(0, check.length - 1);
        let x = check[index][0];
        let y = check[index][1];
        matrix[x][y] = true;
        setTimeout(function() {drawPass(x, y, voidColor)}, delay);
        check.splice(index, 1);

        let direction = [1, 2, 3, 4];
        while (direction.length > 0) {
            let tempDirection = direction[getRandomNumInRange(0,direction.length - 1)];
            //NORTH
            if ((tempDirection == 1) && (y - 2 >= 0) && (matrix[x][y-2] == true)) {
                matrix[x][y-1] = true;
                setTimeout(function() {drawPass(x, y-1, voidColor)}, delay);
                direction.length = 0;
            }
            //EAST
            else if ((tempDirection == 2) && (x - 2 >= 0) && (matrix[x-2][y] == true)) {
                matrix[x-1][y] = true;
                setTimeout(function() {drawPass(x-1, y, voidColor)}, delay);
                direction.length = 0;
            }
            //SOUTH
            else if ((tempDirection == 3) && (y + 2 < height) && (matrix[x][y+2] == true)) {
                matrix[x][y+1] = true;
                setTimeout(function() {drawPass(x, y+1, voidColor)}, delay);
                direction.length = 0;
            }
            //WEST
            else if ((tempDirection == 4) && (x + 2 < width) && (matrix[x+2][y] == true)) {
                matrix[x+1][y] = true;
                setTimeout(function() {drawPass(x+1, y, voidColor)}, delay);
                direction.length = 0;
            }
            else {
                let indexForDelete = direction.indexOf(tempDirection);
                direction.splice(indexForDelete, 1);
            }
        }

        check = addValidCells(check, x , y);
    }
}

function drawMaze() {
    canvas.width = padding * 2 + width * cellSize;
    canvas.height = padding * 2 + height * cellSize;
    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;*/
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fill();

    paintOverMaze();

    createMaze();
}

function delay(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

/*function drawPass(x, y, dpColor, delay) {
    setTimeout(function() {
        context.beginPath();
        context.rect(
            padding + x * cellSize,
            padding + y * cellSize,
            cellSize,
            cellSize
        );
        context.fillStyle = dpColor;
        context.fill();
    }, delay);

}*/

function drawPass(x, y, dpColor) {
    context.beginPath();
    context.rect(
        padding + x * cellSize,
        padding + y * cellSize,
        cellSize,
        cellSize
    );
    context.fillStyle = dpColor;
    context.fill();
}

function paintOverMaze() {
    for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
            context.beginPath();
            context.rect(
                padding + x * cellSize,
                padding + y * cellSize,
                cellSize,
                cellSize
            );
            context.fillStyle = wallColor;
            context.fill();
        }
    }
}

function deleteArray(array) {
    while (array.length > 0 ) {
        array.pop();
    }
    return array;
}

function createValidCells(array, x, y) {
    if (y - 2 >= 0) {
        let coordinats = [x, y - 2];
        array.push(coordinats);
    }
    if (y + 2 < height) {
        let coordinats = [x, y + 2];
        array.push(coordinats);
    }
     if (x - 2 >= 0) {
        let coordinats = [x - 2, y];
        array.push(coordinats);
    }
      if (x + 2 < width) {
        let coordinats = [x + 2, y];
        array.push(coordinats);
    }

    return array;
}

function addValidCells(array, x, y) {
    if (y - 2 >= 0 && matrix[x][y-2] == false) {
        let coordinats = [x, y - 2];
        array.push(coordinats);
    }
    if (y + 2 < height && matrix[x][y+2] == false) {
        let coordinats = [x, y + 2];
        array.push(coordinats);
    }
     if (x - 2 >= 0 && matrix[x-2][y] == false) {
        let coordinats = [x - 2, y];
        array.push(coordinats);
    }
      if (x + 2 < width && matrix[x+2][y] == false) {
        let coordinats = [x + 2, y];
        array.push(coordinats);
    }
    let arrayWithoutDubles = [];
    array.forEach(element => {
        if(!arrayWithoutDubles.some(e => e[0] === element[0] && e[1] === element[1])) {
            arrayWithoutDubles.push(element);
        }
    });
    return arrayWithoutDubles;
}

function getRandomNumInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function clearMaze() {
    console.log(matrix);
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            if (matrix[i][j] == true) {
                drawPass(i, j, voidColor);
            }
        }
    }
}

async function showTheShortestWay(parents) {
    let dotNow = finish;
    let colorOfWay = "rgb(170,0,130)";
    let colorOfStart = "rgb(40, 180, 40)";
    let colorOfEnd = "rgb(240, 30, 10)";
    drawPass(dotNow[0], dotNow[1], colorOfEnd);

    while(true) {
        await delay(100/width);
        if (conditionForAcynfFunc && parents[dotNow[0]][dotNow[1]] == 1) {
            dotNow[1]--;
            drawPass(dotNow[0], dotNow[1], colorOfWay);
        }
        else if (conditionForAcynfFunc && parents[dotNow[0]][dotNow[1]] == 2) {
            dotNow[0]++;
            drawPass(dotNow[0], dotNow[1], colorOfWay);
        }
        else if (conditionForAcynfFunc && parents[dotNow[0]][dotNow[1]] == 3) {
            dotNow[1]++;
            drawPass(dotNow[0], dotNow[1], colorOfWay);
        }
        else if (conditionForAcynfFunc && parents[dotNow[0]][dotNow[1]] == 4) {
            dotNow[0]--;
            drawPass(dotNow[0], dotNow[1], colorOfWay);
        }

        if (conditionForAcynfFunc && dotNow[0] == start[0] && dotNow[1] == start[1]) {
            drawPass(dotNow[0], dotNow[1], colorOfStart);
            break;
        }
        if (!conditionForAcynfFunc) {
            return;
        }
    }
}

async function BFS(startDotX, startDotY, visited) {
    let distance = Math.sqrt(Math.pow(startDotX - finish[0], 2) + Math.pow(startDotY - finish[1], 2))
    let queue = [[startDotX, startDotY, distance]];
    let parents = createParents();
    let colorOfWays = "rgb(70, 70 , 170)";
    visited[startDotX][startDotY] = true;
    let ind;

    //drawPass(startDotX, startDotY, colorOfWays);

    // 1 - NORTH
    // 2 - EAST
    // 3 - SOUTH
    // 4 - WEST

    while (queue.length > 0) {
        ind = 0;
        for(let i = 1; i < queue.length; i++) {
            if(queue[ind][2] > queue[i][2]) {
                ind = i;
            }
        }
        let Xnow = queue[ind][0];
        let Ynow = queue[ind][1];
        let xy = SpeedSlider.value;
        await delay((8000 / xy)/width);
        //await delay(1000/width);
        if(queue.length.length == 1) {
            Xnow = queue[0];
            Ynow = queue[1];
        }

        if (conditionForAcynfFunc && Ynow - 1 >= 0 && visited[Xnow][Ynow - 1] == null) {
            distance = Math.sqrt(Math.pow(Xnow - finish[0], 2) + Math.pow(Ynow - 1 - finish[1], 2));
            queue.push([Xnow, Ynow - 1, distance]);
            visited[Xnow][Ynow - 1] = true;
            parents[Xnow][Ynow - 1] = 3;
            drawPass(Xnow, Ynow - 1, colorOfWays);
        }
        if (conditionForAcynfFunc && Xnow + 1 < width && visited[Xnow + 1][Ynow] == null) {
            distance = Math.sqrt(Math.pow(Xnow + 1 - finish[0], 2) + Math.pow(Ynow - finish[1], 2));
            queue.push([Xnow + 1, Ynow, distance]);
            visited[Xnow + 1][Ynow] = true;
            parents[Xnow + 1][Ynow] = 4;
            drawPass(Xnow + 1, Ynow, colorOfWays);
        }
        if (conditionForAcynfFunc && Ynow + 1 < height && visited[Xnow][Ynow + 1] == null) {
            distance = Math.sqrt(Math.pow(Xnow - finish[0], 2) + Math.pow(Ynow + 1 - finish[1], 2));
            queue.push([Xnow, Ynow + 1, distance]);
            visited[Xnow][Ynow + 1] = true;
            parents[Xnow][Ynow + 1] = 1;
            drawPass(Xnow, Ynow + 1, colorOfWays);
        }
        if (conditionForAcynfFunc && Xnow - 1 >= 0 && visited[Xnow - 1][Ynow] == null) {
            distance = Math.sqrt(Math.pow(Xnow - 1 - finish[0], 2) + Math.pow(Ynow - finish[1], 2));
            queue.push([Xnow - 1, Ynow, distance]);
            visited[Xnow - 1][Ynow] = true;
            parents[Xnow - 1][Ynow] = 2;
            drawPass(Xnow - 1, Ynow, colorOfWays);
        }

        if (Ynow - 1 >= 0 && Xnow == finish[0] && Ynow - 1 == finish[1]) {
            showTheShortestWay(parents);
            break;
        }
        if (Xnow + 1 < width && Xnow + 1 == finish[0] && Ynow == finish[1]) {
            showTheShortestWay(parents);
            break;
        }
        if (Ynow + 1 < height && Xnow == finish[0] && Ynow + 1== finish[1]) {
            showTheShortestWay(parents);
            break;
        }
        if (Xnow - 1 >= 0 && Xnow - 1 == finish[0] && Ynow == finish[1]) {
            showTheShortestWay(parents);
            break;
        }

        if (!conditionForAcynfFunc) {
            return;
        }

        queue.splice(ind, 1);
    }
}

function tick2 () {
    RAF2 = requestAnimationFrame(tick2); 

    if(mouse.x < padding || mouse.x > canvas.width - padding
        || mouse.y < padding || mouse.y > canvas.height - padding) {
        return;
    }

    const x = Math.floor((mouse.x - padding) / cellSize);
    const y = Math.floor((mouse.y - padding) / cellSize);
    if (!mouse.left && mouse.prevLeft) {
        matrix[x][y] = valueForTick2;
        if(valueForTick2) {
            drawPass(x, y, voidColor);
        }
        else {
            
            drawPass(x, y, wallColor);
        }
    }

    mouse.update();
/*
    if(prevConditionForAdd && !conditionForAdd) {
        cancelAnimationFrame(RAF2);
    }
    if(prevConditionForDestroy && !conditionForDestroy) {
        cancelAnimationFrame(RAF2);
    }*/
}

function tick () {
    RAF = requestAnimationFrame(tick);    

    if(mouse.x < padding || mouse.x > canvas.width - padding
        || mouse.y < padding || mouse.y > canvas.height - padding) {
        return;
    }

    const x = Math.floor((mouse.x - padding) / cellSize);
    const y = Math.floor((mouse.y - padding) / cellSize);

    if (!mouse.left && mouse.prevLeft && matrix[x][y]) {
        if (finish == undefined || finish[0] != x || finish[1] != y) {
            if(finish == undefined) {
                drawPass(x, y, "rgb(40, 180, 40)");
            }
            else {
                drawPass(x, y, "rgb(240, 30, 10)");
            }
            start = finish;
            finish = [x, y];
        }
    }

    mouse.update();

    if(start != undefined) {
        let visited = createVisited();
        conditionForAcynfFunc = true;
        BFS(start[0], start[1], visited);
        
        cancelAnimationFrame(RAF);
    }
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