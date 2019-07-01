//global const for the board coordinates
const borderTop=-50;
const borderDown=400;
const borderLeft=0;
const borderRight=400;
//global let
let noCollisions=true;//boolean. False to freeze the game when there is a collision 
let level=0;//increese every time who the player crosses the road
let lives=4;//decreese every collision between the player and an enemy
document.getElementById("level").innerText=level; 
document.getElementById("lives").innerText=lives; 

// Enemies our player must avoid
var Enemy = function(posX,posY,speedEnemy) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x=posX;
    this.y=posY;
    this.width = 60;
    this.height = 60;
    this.speed=speedEnemy;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
//
Enemy.prototype.update = function(dt) {
    
    if(noCollisions){
        //every tick, x coordinate increese
        this.x+=this.speed*dt*30;

        if(this.x>borderRight+this.width){
            //when the enemy is beyond the right border, x coordinate is updeted to the initial position on the left
           this.x=borderLeft-this.width;
     }
             
        
    //refresh level an lives vars in the html code to be updated in the screen
    document.getElementById("level").innerText=level;  
    document.getElementById("lives").innerText=lives;  

     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


class Player{
    constructor(){
        this.sprite ='images/char-pink-girl.png';
        this.x=200;
        this.y=borderDown;
        this.width = 50;
        this.height = 50;
    }
    update(){
        
        allEnemies.forEach((enemy) => {
            if (checkCollisions(this, enemy) == true) {
              noCollisions=false;
            }
        });
        //modal window is shown when the player looses all his/her lives
        if(!noCollisions && lives===0){
            setTimeout(function(){
                Swal.fire({
                type: 'success',
                title: `You have reached the level ${level}`,
                //text: `You complete the game in ${moves} moves (${starsCounter} stars) and ${timer} seconds`,
                footer: '<a href>Do you want to play again?</a>'
                })
            },2000)
        }
        //level counter and enemies's speed increese every time the player reaches the water
        if(this.y===borderTop){
            level++;
            this.x=200;
            this.y=borderDown;
            allEnemies.forEach((enemy) => {
                enemy.speed+=0.5;
            });       

        }
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    }
    handleInput(action){
        if(action==='up' && this.y > borderTop && noCollisions){
            this.y-=50;
        }
        if(action==='down' && this.y < borderDown && noCollisions){
            this.y+=50;
        }
        if(action==='left' && this.x > borderLeft && noCollisions){
            this.x-=50;
        }
        if(action==='right' && this.x < borderRight && noCollisions){
            this.x+=50;
        }
    
    }

    
}

// Helper function to check collisions between two objects
function checkCollisions (object1, object2) {
    if(object1.x+object1.width>object2.x && object2.x+object2.width>object1.x &&   
        object1.y+object1.height>object2.y && object2.y+object2.height>object1.y){
        
        lives--;
        
            noCollisions=false;

            if(!noCollisions && lives>0){
                setTimeout(function(){
                    noCollisions=true;
                    player.x=200;
                    player.y=borderDown;
                },2000)
            }
       
        return true;
    } else {
      return false;
    }
  }

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = []; 
//create enemies
let enemy1 = new Enemy(-400,50,2);
let enemy2 = new Enemy(-500,250,0);
let enemy3 = new Enemy(-100,100,1);
let enemy4 = new Enemy(-100,150,0);
let enemy5 = new Enemy(0,200,1);
//add enemies to an array
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);
allEnemies.push(enemy5);

//a player objet is instantiated
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);

});
