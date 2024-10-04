// Game Board
// Player Load, Cactus Load, Floor Load

import Cactus from "./cactus.js";
import { FRAME_RATE, GAME_HEIGHT, GAME_WIDTH, MAX, MIN } from "./config.js";
import Floor from "./floor.js";
import Player from "./player.js";

// 1. Draw a Canvas (Board)
// window (tab)
window.addEventListener('load', gameStart);
let player;
let context ;
let floor;
function gameStart(){
    bindEvents();
    prepareCanvas();
    loadSprites();
    gameLoop();
}

function bindEvents(){
    window.addEventListener('keyup', doJump);
}

function doJump(event){
    console.log('Do Jump Call Event ', event.code);
    if(event.code === 'Space'){
        player.jump();
    }
}



function prepareCanvas(){
    const canvas = document.querySelector('#canvas');
    
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    context = canvas.getContext('2d');
    //canvas.style = 'border: 1px solid black';
}
function loadSprites(){
    player = new Player();
    floor = new Floor();
    loadCactus();


}


let cactusArray = [];
function loadCactus(){
    const cactusArr = ['./assets/cactus1.png','./assets/cactus2.png','./assets/cactus3.png'];
    let GAP  = 1 ;
    
    for(var c of cactusArr){
        const cactus = new Cactus(GAME_WIDTH * GAP, GAME_HEIGHT , 48, 100, c);
        GAP++;
        cactusArray.push(cactus);
    }
}

function generateRandomNumber(){
    return Math.floor(Math.random() * MAX - MIN + 1) + MIN; 
}
let delay = 0;
function generateRandomCactus(){
    if(delay >=70){
        delay = 0;
    setTimeout(()=>{
        loadCactus();
       // cactusArray.push(new Cactus(GAME_WIDTH * 1, GAME_HEIGHT , 48, 100, '../assets/cactus1.png')
    }, generateRandomNumber());
}
delay++;
}



function printCactus(context){
    //console.log('Cactus Array Size ', cactusArray.length);
    for(let cactus of cactusArray){
        cactus.draw(context);
    }
}

function removeUnUsedCactus(){
    cactusArray = cactusArray.filter(c=>!c.isOutOfScreen());
}
function printGameOver(){
    context.font='bold 48px serif';
    context.fillStyle='grey';
    context.fillText('Game Over',GAME_WIDTH/2,GAME_HEIGHT/2);
}
function gameLoop(){
    //console.log('Game Loop');
    clearScreen();
    if(collisionHappens()){
        player.draw(context);
        floor.draw(context);
        printCactus(context);
        generateRandomCactus();
        removeUnUsedCactus();
        printGameOver();
    }
    else{
        score();
        player.draw(context);
        floor.draw(context);
        printCactus(context);
        generateRandomCactus();
        removeUnUsedCactus();
        setTimeout(function(){
        requestAnimationFrame(gameLoop);
        }, FRAME_RATE);
}
}
let scoreValue=0;
function score(){
    if(!localStorage.maxScore){
        localStorage.maxScore=scoreValue;
    }
    if(scoreValue>localStorage.maxScore){
        localStorage.maxScore=scoreValue;
    }
    scoreValue++;
    context.font='bold 46px serif';
    context.fillStyle='grey';
    context.fillText(scoreValue.toString().padStart(5,0),GAME_WIDTH-120,40);
    context.fillText(localStorage.maxScore.toString().padStart(5,0),GAME_WIDTH-240,40);
}
function clearScreen(){
    context.fillStyle = 'white';
    context.fillRect(0,0, GAME_WIDTH, GAME_HEIGHT);
}
function isCollide(cactus){
    return player.x<cactus.x+cactus.w&&player.x+player.w>cactus.x
    &&player.y<cactus.y+cactus.h&&player.y+player.h>cactus.y;
}
function collisionHappens(){
    return cactusArray.some(c=>isCollide(c));
    // for(let cactus of cactusArray){
    //     if(isCollide(cactus)){
    //         return true;
    //     }
    // }
    // return false;
}
