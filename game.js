var GAME_WIDTH = 416;
var GAME_HEIGHT = 416;
var GAME_SCALE = 2;
// var HORIZON_Y = GAME_HEIGHT/GAME_SCALE/2;

var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var player;
var world;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;
var player_location = [3, 2];
var tempx;
var tempy;
var monster1;
var monster2;
var monster1_location = [16, 14];
var monster2_location = [17, 14];
var monster1_die;
var monster2_die;

var mountain_array = [];
add_mountains();


function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}


// The move function starts or continues movement
function move() {
    if (player.direction == MOVE_NONE) {
        player.moving = false;
        console.log(player.y);
        return;
    }

    player.moving = true;
    console.log("move");


    if (player.direction == MOVE_LEFT) {

        player_location[0] = player_location[0] - 1;
        if(isItemInArray(mountain_array, player_location)){
            console.log("you cannot move into the mountain");
            player_location[0] = player_location[0] + 1;
            player.moving = false;
        }
        else{
           createjs.Tween.get(player).to({x: player.x - 16}, 500).call(move); 
        }
    }

    if (player.direction == MOVE_RIGHT){
        player_location[0] = player_location[0] + 1;
        if(isItemInArray(mountain_array, player_location)){
            console.log("you cannot move into the mountain");
            player_location[0] = player_location[0] - 1;
            player.moving = false;
        }
        else{
            createjs.Tween.get(player).to({x: player.x + 16}, 500).call(move);
        }
        
        
    }


    if (player.direction == MOVE_UP){
        player_location[1] = player_location[1] - 1;
        if(isItemInArray(mountain_array, player_location)){
            console.log("you cannot move into the mountain");
            player_location[1] = player_location[1] + 1;
            player.moving = false;
        }
        else{
            createjs.Tween.get(player).to({y: player.y - 16}, 500).call(move);
        }       
        
    }

    if (player.direction == MOVE_DOWN){
        player_location[1] = player_location[1] + 1;
        if(isItemInArray(mountain_array, player_location)){
            console.log("you cannot move into the mountain");
            player_location[1] = player_location[1] - 1;
            player.moving = false;
        }
        else{
            createjs.Tween.get(player).to({y: player.y + 16}, 500).call(move);
        }
        
        
    }
    console.log(player_location);
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (!player) return;
    if (player.moving) return;
    if (e.repeat == true) return;

    player.direction = MOVE_NONE;

    if (e.keyCode == 87)
    player.direction = MOVE_UP;
    else if (e.keyCode == 83)
    player.direction = MOVE_DOWN;
    else if (e.keyCode == 65)
    player.direction = MOVE_LEFT;
    else if (e.keyCode == 68)
    player.direction = MOVE_RIGHT;
    else if (e.keyCode == 32){

        //attack
        tempx = player.x - 17;
        tempy = player.y - 32;
        stage.removeChild(player);
        stage.addChild(attacker);
        attacker.x = tempx;
        attacker.y = tempy;
        attacker.gotoAndPlay(0);
        //kill();
        setTimeout(function(){attacker.stop();}, 475);
        setTimeout(function(){stage.removeChild(attacker);}, 485);
        setTimeout(function(){stage.addChild(player);}, 485);

        if( ((player_location[0] == monster1_location[0] + 1) || (player_location[0] == monster1_location[0] - 1) || ((player_location[0] == monster1_location[0]))) &&  ((player_location[1] == monster1_location[1] + 1) || (player_location[1] == monster1_location[1] - 1)) || (player_location[1] == monster1_location[1]) ){
        stage.removeChild(monster1);
        stage.addChild(monster1_die);
        monster1_die.play();
        setTimeout(function(){monster1_die.stop();}, 500);

        }

    if( ((player_location[0] == monster2_location[0] + 1) || (player_location[0] == monster2_location[0] - 1)) &&  ((player_location[1] == monster2_location[1] + 1) || (player_location[1] == monster2_location[1] - 1))  ){
        stage.removeChild(monster2);
        stage.addChild(monster2_die);
        monster2_die.play();
        setTimeout(function(){monster2_die.stop();}, 500);
        }

    }

    console.log(e.keyCode);
    move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
    e.preventDefault();
    if (!player) return;
    player.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
    .add('map_json', 'map.json')
    .add("assets.json")
    .add('tileset', 'tileset.png')
    .load(ready);

function ready() {
    //create world
    var tu = new TileUtilities(PIXI);
    world = tu.makeTiledWorld("map_json", "tileset.png");
    stage.addChild(world);

    //create hero
    var hero_moving_array = [];
    hero_moving_array.push(PIXI.Texture.fromFrame('hero_moving1.png'));
    hero_moving_array.push(PIXI.Texture.fromFrame('hero_moving2.png'));
    hero_moving_array.push(PIXI.Texture.fromFrame('hero_moving3.png'));
    player = new PIXI.extras.MovieClip(hero_moving_array);
    player.animationSpeed = 0.1;
    player.scale.x = .5
    player.scale.y = .5
    player.x = 32;
    player.y = 32;
    player.anchor.x = 0.0;
    player.anchor.y = 1.0;
    stage.addChild(player);

    //hero attacking animation
    var hero_attacking_arr = [];
    for(var i = 1; i <= 6; i++){
        hero_attacking_arr.push(PIXI.Texture.fromFrame('hero_attacking' + i + '.png'));
    }
    attacker = new PIXI.extras.MovieClip(hero_attacking_arr);
    attacker.animationSpeed = 0.2;
    attacker.scale.x = .5;
    attacker.scale.y = .5;




    //create monsters
    var monster_arr = [];
    monster_arr.push(PIXI.Texture.fromFrame("monster1.png"));
    monster_arr.push(PIXI.Texture.fromFrame("monster2.png"));
    monster_arr.push(PIXI.Texture.fromFrame("monster3.png"));

    monster1 = new PIXI.extras.MovieClip(monster_arr);
    monster1.animationSpeed = 0.1;
    monster1.x = 240;
    monster1.y = 208;
    monster1.play();
    stage.addChild(monster1);
    

    monster2 = new PIXI.extras.MovieClip(monster_arr);
    monster2.animationSpeed = 0.1;
    monster2.x = 256;
    monster2.y = 208;
    monster2.play();
    stage.addChild(monster2);
    

    //create dead monsters
    var monster_die_arr = [];
    for (var i = 1; i <= 4; i++){
        monster_die_arr.push(PIXI.Texture.fromFrame("monster_die" + i + ".png"))
    }
    monster1_die = new PIXI.extras.MovieClip(monster_die_arr);
    monster1_die.animationSpeed = 0.1;
    monster1_die.x = 240;
    monster1_die.y = 208;
    // monster1.play();
    // stage.addChild(monster1);

    monster2_die = new PIXI.extras.MovieClip(monster_die_arr);
    monster2_die.animationSpeed = 0.1;
    monster2_die.x = 256;
    monster2_die.y = 208;


    //create princess
    var princess_tex = new PIXI.Texture.fromImage("princess.png");
    var princess = new PIXI.Sprite(princess_tex)
    princess.position.x = 16;
    princess.position.y = 240;
    stage.addChild(princess);
    var pincess_location = [2, 16];

    //create treasure
    var treausure_tex = new PIXI.Texture.fromImage("treasure.png");
    var treasure = new PIXI.Sprite(treausure_tex);
    treasure.position.x = 208;
    treasure.position.y = 32;
    stage.addChild(treasure);
    var treasure_location = [14, 3];


    player.direction = MOVE_NONE;
    player.moving = false;
    animate();
}

function animate(timestamp) {
    requestAnimationFrame(animate);
    if (player.moving){
        player.play();
    }
    else{
        player.stop();
    }
    update_camera();
    renderer.render(stage);
}

function update_camera() {
    stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
    stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
    stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
    stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

function add_mountains(){

    //create mountains
    
    //creates mountains that surround the stage
    for (var i = 1; i <= 18; i++){
        for(var j = 1; j <= 18; j++){
            if ((i == 1 || i == 18) || (j == 1 || j == 18)){
                mountain_array.push([i, j]);
                //console.log(i,j);
            }
            
        }
    }
    mountain_array.push([12, 4]);
    mountain_array.push([14, 4]);
    for (var i = 9; i <= 14; i++){
        mountain_array.push([i, 5]);
    }
    for (var i = 10; i <= 13; i++){
        mountain_array.push([i, 6]);
    }
    mountain_array.push([12, 7]);
    mountain_array.push([13, 7]);
    mountain_array.push([8, 11]);
    mountain_array.push([14, 11]);
    mountain_array.push([14, 12]);
    mountain_array.push([7, 12]);
    mountain_array.push([8, 12]);
    for (var i = 6; i <= 9; i++){
        mountain_array.push([i, 13]);
    }
    mountain_array.push([13, 13]);
    mountain_array.push([14, 13]);
    for (var i = 2; i <= 15; i++){
        mountain_array.push([i, 14]);
    }
    for (var i = 5; i <= 10; i++){
        mountain_array.push([i, 15]);
    }
    mountain_array.push([13, 15]);
    mountain_array.push([14, 15]);
    mountain_array.push([7, 16]);

}
