var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;
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
        createjs.Tween.get(player).to({x: player.x - 16}, 500).call(move);
    }
    if (player.direction == MOVE_RIGHT)
        createjs.Tween.get(player).to({x: player.x + 16}, 500).call(move);

    if (player.direction == MOVE_UP)
        createjs.Tween.get(player).to({y: player.y - 16}, 500).call(move);

    if (player.direction == MOVE_DOWN)
        createjs.Tween.get(player).to({y: player.y + 16}, 500).call(move);
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

    var hero_moving_arry = [];
    hero_moving_arry.push(PIXI.Texture.fromFrame('hero_moving1.png'));
    hero_moving_arry.push(PIXI.Texture.fromFrame('hero_moving2.png'));
    hero_moving_arry.push(PIXI.Texture.fromFrame('hero_moving3.png'));
    player = new PIXI.extras.MovieClip(hero_moving_arry);
    player.animationSpeed = 0.1;
    player.scale.x = .5
    player.scale.y = .5
    player.x = 32;
    player.y = 32;
    player.anchor.x = 0.0;
    player.anchor.y = 1.0;
    stage.addChild(player);


    var princess_tex = new PIXI.Texture.fromImage("princess.png");
    var princess = new PIXI.Sprite(princess_tex)
    princess.position.x = 16;
    princess.position.y = 240;
    stage.addChild(princess);






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
