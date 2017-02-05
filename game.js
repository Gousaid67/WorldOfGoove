var ready=function(){function g(){if(!a.isReady){try{document.documentElement.doScroll("left")}catch(b){setTimeout(g,1);return}a.ready()}}var e,c,n={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"},a={isReady:!1,readyWait:1,holdReady:function(b){b?a.readyWait++:a.ready(!0)},ready:function(b){if(!0===b&&!--a.readyWait||!0!==b&&!a.isReady){if(!document.body)return setTimeout(a.ready,
1);a.isReady=!0;!0!==b&&0<--a.readyWait||e.resolveWith(document,[a])}},bindReady:function(){if(!e){e=a._Deferred();if("complete"===document.readyState)return setTimeout(a.ready,1);if(document.addEventListener)document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",a.ready,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",c);window.attachEvent("onload",a.ready);var b=!1;try{b=null==window.frameElement}catch(f){}document.documentElement.doScroll&&
b&&g()}}},_Deferred:function(){var b=[],f,c,e,h={done:function(){if(!e){var c=arguments,d,g,k,m,l;f&&(l=f,f=0);d=0;for(g=c.length;d<g;d++)k=c[d],m=a.type(k),"array"===m?h.done.apply(h,k):"function"===m&&b.push(k);l&&h.resolveWith(l[0],l[1])}return this},resolveWith:function(a,d){if(!e&&!f&&!c){d=d||[];c=1;try{for(;b[0];)b.shift().apply(a,d)}finally{f=[a,d],c=0}}return this},resolve:function(){h.resolveWith(this,arguments);return this},isResolved:function(){return!(!c&&!f)},cancel:function(){e=1;b=
[];return this}};return h},type:function(a){return null==a?String(a):n[Object.prototype.toString.call(a)]||"object"}};document.addEventListener?c=function(){document.removeEventListener("DOMContentLoaded",c,!1);a.ready()}:document.attachEvent&&(c=function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",c),a.ready())});return function(b){a.bindReady();a.type(b);e.done(b)}}();


Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

ready(function() {
  if(document.getElementById("f" + "r" + "e" + "e" + "w" + "h" + "a") !== null) {
    document.getElementById("f" + "r" + "e" + "e" + "w" + "h" + "a").remove();
  }
});



/*

Phaser Tips I found:
shake() instensity : 0.05 is still too much



*/

var game = new Phaser.Game(960, 640, Phaser.AUTO, "game", {preload:preload, create:create, update:update, render:render}); // (width, height, WebGL/CANVAS, id to append, states)

var character_main;
var cursors; // Arrow keys
var jumpCount = 0;
var jumpKey; // Space bar
var blocks; // Solid blocks that are immovable
var facing = "left"; // Direction facing when animation stops
var titleText;
var background; // Background image
var playerSpeed = 300; // Player speed
var enemySpeed1 = 150; // Enemy walking minion speed

function preload() {
  game.load.baseURL = "assets/";
  game.stage.backgroundColor = "#78af4c"; // 5ea9dd
  game.load.spritesheet("block_grass", "sprites/block_grass.png", 32, 32);
  game.load.spritesheet("character_main_running", "sprites/character_main_running_2.png", 32, 64); // name, source, length, height
  game.load.spritesheet("character_main_jumping", "sprites/character_main_jumping_2.png", 32, 64);
  game.load.spritesheet("character_bad_1", "sprites/character_bad_1_spritesheet.png", 32, 32);
  game.load.image("background_1", "backgrounds/1.png");
  game.world.setBounds(0, 0, 6528, 640); // 32 * number of characters per line(204)
}

function KillPlayer(player) {
  player.kill();
  titleText = game.add.text(game.camera.x + (game.width/2), game.camera.y + (game.height/2), "You died.\nRespawning in 3 seconds...", { // Show text in center of screen, not center of world
    fill: "#ffffff", // white
    font: "65px Arial" // font
  });
  titleText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2); // Shadow
  titleText.anchor.setTo(0.5, 0.5); // Anchor to set it center
  var x = 3; // Counter
  function count() {
    window.setTimeout(function() {
      x--; // Reduce counter by 1
      if(x == 0) { // If counter is 0
        player.x = 64;
        player.y = 300;
        player.revive();
        titleText.destroy();
      } else { // If counter is not at 0 yet
        titleText.setText("You died.\nRespawning in " + x.toString() + " seconds..."); // Update text
        count();
      }
    }, 1000); // Wait 1000ms = 1s
  }
  count(); // Initiate first call because it doesn't get automatically called
}

function create() {
  bgtile = game.add.tileSprite(0, 0, game.world.width, game.cache.getImage("background_1").height, "background_1");
  bgtile.scale.setTo(5); // Scale up by 5 (128x5 = 640)
  game.stage.smoothed = false; // No blur on zoom
  
  game.time.advancedTiming = true;
  
  var levelDesign = [
    //Level 1
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                                                                                                                                                                                                          ",
    "B                                              CMMD                                                                                                                                                                        ",
    "B                                    CMMD      AXXB                                                                                                                                          CMMMD    CD      CMMMMMMMMMMMM",
    "B              CMMMMD      CMMD      AXXB      AXXB                                                                                                                                CMMMD     AXXXB    AB      AXXXXXXXXXXXX",
    "B                          AXXB      AXXXD     AXXB                                       CMMMMMD                                                                          CMMMD             AXXXB    AB      AXXXXXXXXXXXX",
    "B                          AXXXD     AXXXB     AXXB                                       AXXXXXB                                                                  CMMMD                     AXXXB    AB      AXXXXXXXXXXXX",
    "XMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXMMMMMXXXXXMMMMMXXXB          CMMMMMMMMMMD       CMMMMMMMMMXXXXXXXMMMMMMMD      CMMMMMMMMMMMMMMMMD                 CMMMMMMMMMMMMD                             AXXXB    AB      AXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXMMMMMMMMMMXXXXXXXXXXXB       AXXXXXXXXXXXXXXXXXXXXXXXB      AXXXXXXXXXXXXXXXXB     CMMMMMD     AXXXXXXXXXXXXB                             AXXXB    AB      AXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXMMMMMMMXXXXXXXXXXXXXXXXXXXXXXXXB      AXXXXXXXXXXXXXXXXB                 AXXXXXXXXXXXXB                             AXXXB    AB      AXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXB      AXXXXXXXXXXXXXXXXB                 AXXXXXXXXXXXXB                             AXXXB    AB      AXXXXXXXXXXXX"
  ];

  game.physics.startSystem(Phaser.Physics.ARCADE); // Start physics engine
  game.world.enableBody = true; // Apply physics to every object
  
  blocks = game.add.group(); // Create new group called blocks - Will contain all immovable blocks
  
  // Create the level by going through the array
  for (var i = 0; i < levelDesign.length; i++) {
    for (var j = 0; j < levelDesign[i].length; j++) {
      // Create a block and add it to the 'blocks' group
      if(levelDesign[i][j] == "X") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 4); // Grass (center center) Block
        blocks.add(block);
        block.body.immovable = true;
      } else if(levelDesign[i][j] == "M") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 1); // Grass (top center) Block
        blocks.add(block);
        block.body.immovable = true;
      } else if(levelDesign[i][j] == "A") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 3); // Grass (center left) Block
        blocks.add(block);
        block.body.immovable = true;
      } else if(levelDesign[i][j] == "B") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 5); // Grass (center right) Block
        blocks.add(block);
        block.body.immovable = true;
      } else if(levelDesign[i][j] == "C") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 0); // Grass (top left) Block
        blocks.add(block);
        block.body.immovable = true;
      } else if(levelDesign[i][j] == "D") {
        var block = game.add.sprite(32*j, 32*i, "block_grass", 2); // Grass (top left) Block
        blocks.add(block);
        block.body.immovable = true;
      }
    }
  }
  
  // Main Character
  character_main = game.add.sprite(64, 300, "character_main_running"); // Draw sprite at 0, 300
  game.physics.enable(character_main, Phaser.Physics.ARCADE); // Enable physics (gravity) for sprite
  character_main.body.gravity.y = 1200; // Gravity, higher the number, the heavier the item feels
  character_main.body.bounce.y = 0; // No bounce
  character_main.checkWorldBounds = true;
  character_main.events.onOutOfBounds.add(KillPlayer, this);
  // character_main.body.collideWorldBounds = true; // Go out of world border or not
  
  var enemy = new Enemy(game, 128, 300, 1, enemySpeed1);
  game.add.existing(enemy);
  
  // This will create a new object called "cursors", inside it will contain 4 objects: up, down, left and right.
  // These are all Phaser.Key objects, so anything you can do with a Key object you can do with these.
  cursors = game.input.keyboard.createCursorKeys();
  jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

Enemy = function(game, x, y, direction, speed) {
  Phaser.Sprite.call(this, game, x, y, "character_bad_1");
  this.animations.add("right", [0, 1, 2, 3, 4, 5], 12, true);
  this.animations.add("left", [6, 7, 8, 9, 10, 11], 12, true);
  this.animations.play("right");
  this.anchor.setTo(0.5);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.gravity.y = 1200;
  this.xSpeed = direction*speed;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function()  {
  game.physics.arcade.collide(this, character_main, touchEnemy);
  game.physics.arcade.collide(this, blocks, moveEnemy);
  this.body.velocity.x = this.xSpeed;
}

function touchEnemy(enemy, main) {
  if(enemy.key !== "character_bad_boss") {
    if(!enemy.body.touching.up) {
      KillPlayer(main);
    } else {
      enemy.kill();
    }
  }
}

function moveEnemy(enemy, block) {
  if(enemy.body.touching.left || enemy.body.touching.right) {
    if(enemy.body.touching.left) {
      enemy.animations.play("right");
    } else if(enemy.body.touching.right) {
      enemy.animations.play("left");
    }
    enemy.xSpeed *= -1;
  }
}

var isJumping = false;

function update() {
  // Function is called when anything is updated
  
  game.physics.arcade.collide(character_main, blocks); // Do not pass through blocks
  
  game.camera.focusOnXY(character_main.x + 250, game.world.height - 64); // Move camera to location
  
  if(character_main.body.touching.down) {
    isJumping = false;
    if(jumpKey.isDown) {
      character_main.body.velocity.y = -500;
      isJumping = true;
      console.log("playng jump");
      character_main.loadTexture("character_main_jumping", 0, false);
      character_main.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
      character_main.animations.add("left", [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
      if(facing != "right") {
        character_main.animations.play("right");
        facing = "right";
      } else {
        character_main.animations.play("left");
        facing = "left";
      }
    }
  } else {
    isJumping = true;
  }
  
  character_main.body.velocity.x = 0;
  
  if(cursors.right.isDown) {
    character_main.body.velocity.x = playerSpeed;
    if(!isJumping) {
      if(character_main.key == "character_main_jumping") {
        character_main.loadTexture("character_main_running", 0, false);
        //character_main.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7], 12, true); // Right animation frames
        character_main.animations.play("right");
      }
    }
    if(facing != "right") {
      // game.camera.shake(0.005, 500, true, Phaser.Camera.SHAKE_BOTH, true);
      character_main.animations.play("right");
      facing = "right";
    }
  } else if(cursors.left.isDown) {
    character_main.body.velocity.x = -playerSpeed;
    if(character_main.key == "character_main_jumping") {
        character_main.loadTexture("character_main_running", 0, false);
        //character_main.animations.add("right", [0, 1, 2, 3, 4, 5, 6, 7], 12, true); // Right animation frames
        character_main.animations.play("left");
      }
    if(facing != "left") {
      character_main.animations.play("left");
      facing = "left";
    }
  } else {
    if(facing != "idle") {
      character_main.animations.stop();
      if(facing == "right") {
        character_main.frame = 0;
      } else {
        character_main.frame = 8;
      }
      facing = "idle";
    }
  }
  
}

function render() {
  game.debug.text("FPS: " + game.time.fps, 850, 32, "#ffffff");
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(character_main, 32, 500);
}