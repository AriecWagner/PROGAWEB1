let width = window.innerWidth - 250;
let height = window.innerHeight;

let matrix = createMatrix(width, height);
let colorForTick;
let valueForTick;
let antN = 500;
let pheromonesWay = createPheromones();
let pheromonesFood = createPheromones();
let start = [401,500]; //401, 5
let finish = [505,1055];
let ants = createAnts(start[1], start[0]);
pheromonesFood[finish[0]][finish[1]] = 9999999999999999;
pheromonesWay[start[0]][start[1]] = 9999999999999999;
matrix[start[0]][start[1]] = "START";
matrix[finish[0]][finish[1]] = "FOOD";
let flairRadius = 10;
let startRadius = 40;
let ConditionForContinue = false;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const mouse = myMouse(canvas);
let brushSize = 100;
let RAF;


const BarierButton = document.getElementById('BarierButton');
const StartButton = document.getElementById('StartButton');
const FinishButton = document.getElementById('FinishButton');

main();
function main() {
    createField();
    console.log(matrix.length, "    ", matrix[0].length);
    let x = getCoordinats(7, 4, 4, 4, 5, 143);
    console.log(x);
    //antAlgorithm();

}

let counterForBarier = -1;
BarierButton.addEventListener('click', BarierButtonFunc);
function BarierButtonFunc() {
    counterForBarier++;
    colorForTick = "green";
    valueForTick = false;
    RAF = requestAnimationFrame(tick);
}

StartButton.addEventListener('click', StartButtonFunc);
function StartButtonFunc() {
    colorForTick = "blue";
    valueForTick = "START";
    RAF = requestAnimationFrame(tick);
    antAlgorithm();
}

FinishButton.addEventListener('click', FinishButtonFunc);
function FinishButtonFunc() {
    colorForTick = "red";
    valueForTick = "FOOD";
    RAF = requestAnimationFrame(tick);

}

function createField() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.beginPath();
    context.rect(0, 0, window.innerWidth - 250, window.innerHeight);
    context.stroke();
    context.fillStyle = "rgb(19,19,19)";
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

function createAnts(coordinatsX, coordinatsY) {
    let ants = [];
    for (let i = 0; i < antN; i++) {
        let ant = {
            x: coordinatsX,
            y: coordinatsY,
    
            isFindFood: false
        };
        ants.push(ant);
    }
    return ants;
}

function createPrevDirection() {
    let prevDirection = [];
    let counterForPD = 1;
    for(let i = 0; i < antN; i++) {
        if(counterForPD > 8) {
            counterForPD = 1;
        }

        if(counterForPD == 1) {
            prevDirection.push("EAST");
            counterForPD++;
        }
        else if(counterForPD == 2) {
            prevDirection.push("NORTH-EAST");
            counterForPD++;
        }
        else if(counterForPD == 3) {
            prevDirection.push("NORTH");
            counterForPD++;
        }
        else if(counterForPD == 4) {
            prevDirection.push("NORTH-WEST");
            counterForPD++;
        }
        else if(counterForPD == 5) {
            prevDirection.push("WEST");
            counterForPD++;
        }
        else if(counterForPD == 6) {
            prevDirection.push("SOUTH-WEST");
            counterForPD++;
        }
        else if(counterForPD == 7) {
            prevDirection.push("SOUTH");
            counterForPD++;
        }
        else if(counterForPD == 8) {
            prevDirection.push("SOUTH-EAST");
            counterForPD++;
        }
    }
    return prevDirection;
}

function delay(ms) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

function tick () {
    RAF = requestAnimationFrame(tick);    

    //console.log(mouse.x, " ", mouse.y);
    if(mouse.x > (canvas.width - 250 - brushSize + 1) || mouse.y > canvas.height) {
        return;
    }

    mouse.update();
    if(mouse.left && mouse.prevLeft) {
        //console.log("AAAAAA");
        const x = Math.floor(mouse.x);
        const y = Math.floor(mouse.y);
        draw(x, y, brushSize, colorForTick);
        changeMatrix(x, y, brushSize, valueForTick);
    }
    //console.log(matrix[0][0]);
    //console.log(matrix[0][700]);
}

function changeMatrix(x, y, size, value) {
    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            matrix[y + i][x + j] = value;
        }
    }
}

function draw(x, y, size, dpColor) {
    context.beginPath();
    context.rect(
        x,
        y,
        size,
        size
    );
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

function reloadPheromones() {
    let evaporationRate =  0.96;
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            pheromonesFood[i][j] *= evaporationRate;
            pheromonesWay[i][j] *= evaporationRate;
            let blue = (255 * pheromonesWay[i][j]) / 10000;
            let red = (255 * pheromonesFood[i][j]) / 10000;
            draw(j, i, 1, 'rgb('+red+',0,'+blue+')');
        }
    }
}
async function antAlgorithm() {
    let chosenDots = [];
    let prevDirection = createPrevDirection();
    let Condition = [];
    for(let i = 0; i < antN; i++) {
        Condition.push(false);
    }
    /*firstSteps();
    while(!ConditionForContinue) {
        await delay(0.1);
    }*/
    while(true) {
        await delay(1);
        //reloadPheromones();
        for(let i = 0; i < antN; i++) {
            draw(ants[i].x, ants[i].y, 1, "red");
            //console.log(ants[i].x, "   ", ants[i].y);
            let stink = 500;
            if(ants[i].isFindFood) {
                pheromonesFood[ants[i].y][ants[i].x] += stink;
            }
            else {
                pheromonesWay[ants[i].y][ants[i].x] += stink;
            }

            if(matrix[ants[i].y][ants[i].x] == "FOOD" && !ants[i].isFindFood) {
                ants[i].isFindFood = true;
            }
            else if (matrix[ants[i].y][ants[i].x] == "START" && ants[i].isFindFood) {
                ants[i].isFindFood = false;
            }
            let bonus = 0;
            if(Condition[i] == true) {
                bonus = 500000;
                Condition[i] = false;
            }
            let chosenDot = chooseDirection(ants[i].x, ants[i].y, ants[i].isFindFood, prevDirection[i], Condition[i], bonus);
            if (chosenDot[1] == true) {
                Condition[i] = true;
                console.log("fwfewfgrerer");
                prevDirection[i] = chosenDot[0];
                //prevDirection[i] = checkPrevDirection(prevDirection[i], chosenDot[1], ants[i].x, ants[i].y);
            }
            //prevDirection[i] = checkPrevDirection(prevDirection[i], chosenDot, ants[i].x, ants[i].y);
            //prevDirection[i] = chosenDot;
            //ants[i].x = chosenDot[0];
            //ants[i].y = chosenDot[1];
            /*if(ants.isFindFood) {
                pheromonesWay[ants[i].y][ants[i].x] *= evaporationRate;
            }
            else {
                pheromonesFood[ants[i].y][ants[i].x] *= evaporationRate;
            }*/
            switch(chosenDot[0]) {
                case "EAST":
                    ants[i].x++
                    break;
                case "NORTH-EAST":
                    ants[i].x++;
                    ants[i].y--;
                    break;
                case "NORTH":
                    ants[i].y--;
                    break;
                case "NORTH-WEST":
                    ants[i].x--;
                    ants[i].y--;
                    break;
                case "WEST":
                    ants[i].x--;
                    break;
                case "SOUTH-WEST":
                    ants[i].x--;
                    ants[i].y++;
                    break;
                case "SOUTH":
                    ants[i].y++;
                    break;
                case "SOUTH-EAST":
                    ants[i].x++;
                    ants[i].y++;
                    break;
            }
        }
    }
}

function checkPrevDirection(prevDirection,  newDirection, x, y) {
    if(prevDirection == "EAST" && newDirection == "WEST") {
        return newDirection;
    }
    else if(prevDirection == "WEST" && newDirection == "EAST") {
        return newDirection;
    }
    else if(prevDirection == "NORTH" && newDirection == "SOUTH") {
        return newDirection;
    }
    else if(prevDirection == "SOUTH" && newDirection == "NORTH") {
        return newDirection;
    }
    else if(prevDirection == "NORTH-WEST" && newDirection == "SOUTH-WEST") {
        return newDirection;
    }
    else if(prevDirection == "SOUTH-EAST" && newDirection == "NORTH-EAST") {
        return newDirection;
    }
    else if(prevDirection == "NORTH-EAST" && newDirection == "SOUTH-EAST") {
        return newDirection;
    }
    else if(prevDirection == "SOUTH-WEST" && newDirection == "NORTH-WEST") {
        return newDirection;
    }
    else {
        return prevDirection;
    }
}

function firstSteps() {
    let dots = choseDots(start[1], start[0]);
}

async function choseDots(startX, startY) {
    let x = startX + startRadius;
    let y = startY;
    let step = 360 / antN;
    let tempAngle;
    let dots = [];
    let bariers = [];
    for(let i = 0; i < antN; i++) {
        bariers.push(false);
    }
    for(let i = 1; i <= startRadius; i++) {

        await delay(0.1);
        tempAngle = 0;
        for(let j = 0; j < antN; j++) {
            let coordinats = getCoordinats(x, y, startX, startY, i, tempAngle);
            if (bariers[j] != false) {
                if(bariers[j][1] != -1) {
                    coordinats[0] = 2 * bariers[j][1] - coordinats[0];
                }
                if(bariers[j][2] != -1) {
                    coordinats[1] = 2 * bariers[j][2] - coordinats[1];
                }
            }
            if(coordinats[1] >= height) {
                coordinats[1] = 2 * height - coordinats[1];
                bariers[i] = true;
            }
            if(coordinats[0] >= width) {
                coordinats[0] = 2 * width - coordinats[0];
                bariers[i] = true;
            }
            if(coordinats[1] < 0) {
                coordinats[1] = -coordinats[1];
                bariers[i] = true;
            }
            if(coordinats[0] < 0) {
                coordinats[0] = -coordinats[0];
                bariers[i] = true;
            }
            if(bariers[j][0] == false && coordinats[0] <= width && coordinats[1] <= height && matrix[coordinats[1]][coordinats[0]] == false) {
                console.log("ffewewfe");
                let tempCoordinats = getCoordinats(x, y, startX, startY, i, tempAngle);
                bariers[j].push(-1);
                bariers[j].push(-1);
                if(tempCoordinats[0] > coordinats[0]) {
                    bariers[j][1]=(coordinats[0]);
                    coordinats[0] = 2 * bariers[j][1] - coordinats[0];
                }
                else if(tempCoordinats[0] < coordinats[0]) {
                    bariers[j][1]=(coordinats[1]);
                    coordinats[0] = 2 * bariers[j][1] - coordinats[0];
                }
                if(tempCoordinats[1] > coordinats[1]) {
                    bariers[j][2]=(coordinats[1]);
                    coordinats[1] = 2 * bariers[j][2] - coordinats[1];
                }
                else if(tempCoordinats[1] < coordinats[1]) {
                    bariers[j][2]=(coordinats[1]);
                    coordinats[1] = 2 * bariers[j][2] - coordinats[1];
                }
                bariers[j][0] = true;
            }
            /*while(true) {
                if(ants[i].x >= width) {

                }
                else if(ants[i].y >= height) {

                }
            }*/
            ants[j].x = coordinats[0];
            ants[j].y = coordinats[1];
            //if (startX - i >= 0)
            draw(coordinats[0], coordinats[1], 1, "red");
            tempAngle += step;
        }
    }
    ConditionForContinue = true;
    return dots;
}

function toDot(x0, y0, x, y) {
    let angle = getDegrees(x0, y0, x, y, flairRadius);
    while(x0 != x && y0 != y) {
        //let distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
        let coordinats = getCoordinats(x, y, x0, y0, 1, angle);
        draw(x0, y0, 1, "red");
        x0 = coordinats[0];
        y0 = coordinats[1];
    }
}

function getProbability(prevDirection, degrees) {
    let prevDirectionDegrees;
    switch(prevDirection) {
        case "EAST":
            prevDirectionDegrees = 0
            break;
        case "NORTH-EAST":
            prevDirectionDegrees = 45
            break;
        case "NORTH":
            prevDirectionDegrees = 90
            break;
        case "NORTH-WEST":
            prevDirectionDegrees = 135
            break;
        case "WEST":
            prevDirectionDegrees = 180
            break;
        case "SOUTH-WEST":
            prevDirectionDegrees = 225
            break;
        case "SOUTH":
            prevDirectionDegrees = 270
            break;
        case "SOUTH-EAST":
            prevDirectionDegrees = 315
            break;
    }
    let difference = (Math.abs(prevDirectionDegrees - degrees));
    if(difference > 180) {
        difference = 360 - difference;
    }
    /*if(prevDirection == "EAST") {
        console.log("EAST");
        console.log(prevDirectionDegrees, "   ", degrees);
        console.log(difference);
        //console.log();
    }
    if(prevDirection == "WEST") {
        console.log("WEST");
        console.log(prevDirectionDegrees, "   ", degrees);
        console.log(difference);
        //console.log();
    }*/
    if(difference <= 22.5) {
        difference = (360 - difference) * 3;
    }
    else {
        difference = (360 - difference);
    }
    //difference = 
    difference = difference * 0.9;
    return difference;
}

function chooseDirection(x, y, foodCondition, prevDirection, Condition, bonus) {
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
                if(foodCondition) {
                    variants.push([(pheromonesWay[i + y][j + x])+ 1 + getProbability(prevDirection, degrees) + bonus, i  + y, j + x]);
                    
                    if(pheromonesWay[i + y][j + x] != 0) {
                        intrestingVariants++;
                    }
                }
                else {
                    variants.push([(pheromonesFood[i + y][j + x]) + 1 + getProbability(prevDirection, degrees) + bonus, i  + y, j + x]);
                    if(pheromonesFood[i + y][j + x] != 0) {
                        intrestingVariants++;
                    }
                }
            }
            else {
                variants.push([0, i + y, j + x]);
            }
            
        }
    }


    for (let i = variants.length - 1; i >= 0; i--) {
        let index = getRandomElementFromArray(variants);
        //console.log(index);
        //console.log(variants[index][2], "  ", variants[index][1]);
        let degrees = getDegrees(x, y, variants[index][2], variants[index][1], flairRadius);
        /*if(prevDirection == "EAST") {
            console.log(variants[index][0]);
            //console.log();
        }*/
        //toDot(x, y, variants[index][2], variants[index][1]);
       // return [variants[index][2], variants[index][1]];
        //EAST
        if (degrees <= 22.5 || degrees >= 337.5) {
            if(x + 1 < width && matrix[y][x + 1] != false) {
                return ["EAST", Condition];
                break;
            }
            else if(x - 1 >= 0 && matrix[y][x - 1] != false) {
                Condition = true;
                //prevDirection[inde] = "WEST";
                return ["WEST", Condition];
            }
        }
        //NORTH-EAST
        else if (degrees < 67.5) {
            if(x + 1 < width && y - 1 >= 0 && matrix[y - 1][x + 1] != false) {
                return ["NORTH-EAST", Condition];
                break;
            }
            else if (y + 1 < height && x - 1 >=0 && matrix[y + 1][x - 1] != false){
                Condition = true;
                //prevDirection[inde] = "SOUTH-WEST";
                return ["SOUTH-WEST", Condition];
            }
        }
        //NORTH
        else if (degrees <= 112.5) {
            if(y - 1 >= 0 && matrix[y - 1][x] != false) {
                return ["NORTH", Condition];
                break;
            }
            else if(y + 1 < height && matrix[y + 1][x] != false) {
                Condition = true;
                //prevDirection[inde] = "SOUTH";
                return ["SOUTH", Condition];
            }
        }
        //NORTH-WEST
        else if (degrees < 157.5) {
            if(y - 1 >= 0 && x - 1 >= 0 && matrix[y - 1][x - 1] != false) {
                return ["NORTH-WEST", Condition];
                break;
            }
            else if(y + 1 < height && x + 1 < width && matrix[y + 1][x + 1] != false) {
                Condition = true;
                //prevDirection[inde] = "SOUTH-EAST";
                return ["SOUTH-EAST", Condition];
            }
        }
        //WEST
        else if (degrees <= 202.5) {
            if(x - 1 >= 0 && matrix[y][x - 1] != false) {
                return ["WEST", Condition];
                break;
            }
            else if(x + 1 < width && matrix[y][x + 1] != false) {
                Condition = true;
                //prevDirection[inde] = "EAST";
                return ["EAST", Condition];
            }
        }
        //SOUTH-WEST
        else if (y + 1 < height && x - 1 >=0 && degrees < 247.5) {
            if(matrix[y + 1][x - 1] != false) {
                return ["SOUTH-WEST", Condition];
                break;
            }
            else if(x + 1 < width && y - 1 >= 0 && matrix[y - 1][x + 1] != false) {
                Condition = true;
                //prevDirection[inde] = "NORTH-EAST";
                return ["NORTH-EAST", Condition];
            }
        }
        //SOUTH
        else if (degrees <= 292.5) {
            if(y + 1 < height && matrix[y + 1][x] != false) {
                return ["SOUTH", Condition];
                break;
            }
            else if(y - 1 >= 0 && matrix[y - 1][x] != false) {
                Condition = true;
                //prevDirection[inde] = "NORTH";
                return ["NORTH", Condition];
            }
        }
        //SOUTH-EAST
        else if (degrees < 337.5) {
            if(y + 1 < height && x + 1 < width && matrix[y + 1][x + 1] != false) {
                return ["SOUTH-EAST", Condition];
                break;
            }
            else if(y - 1 >= 0 && x - 1 >= 0 && matrix[y - 1][x - 1] != false) {
                Condition = true;
                //prevDirection[inde] = "NORTH-WEST";
                return ["NORTH-WEST", Condition];
            }
        }
        //variants.splice(index, 1);
    }
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
