document.addEventListener('DOMContentLoaded', function() {
    // Sprite class
    const spritesHero = {
        width: 100,
        height: 100,
        idle: {
            x: 0,
            y: 0,
            number: 4
        },
        run: {
            x: 0,
            y: 100,
            number: 4
        },
        waitAttack: {
            x: 0,
            y: 200,
            number: 4
        },
        attack: {
            x: 400,
            y: 200,
            number: 4
        },
        die: {
            x: 0,
            y: 400,
            number: 4
        }
    }
    const spritesMonster = {
        width: 150,
        height: 150,
        idle: {
            x: 0,
            y: 0,
            number: 8
        },
        run: {
            x: 0,
            y: 150,
            number: 8
        },

        attack: {
            x: 0,
            y: 300,
            number: 8
        },
        takeHit: {
            x: 0,
            y: 450,
            number: 4
        },
        die: {
            x: 600,
            y: 450,
            number: 4
        }
    }

    let currentSprite = 0;
    const maxSprite = 4; // There are 4 sprites
    const changedFrame = 20; //Changed the sprite all the x frames
    let gameFrame = 0;
    //Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    //Load the heroSprites
    let heroReady;
    const heroSprites = new Image();

    heroSprites.src = 'ressources/images/characters/HeavyBandit.png'
    const heroSpritesInverse = new Image();
    heroSpritesInverse.onload = function() {
        heroReady = true;
    }
    heroSpritesInverse.src = 'ressources/images/characters/HeavyBanditInverse.png'
    let currentHeroSprites = heroSpritesInverse;

    //Load the monsterSprites
    let monsterReady;
    const monsterSprites = new Image();

    monsterSprites.src = 'ressources/images/opponents/EyeMonster.png'
    const monsterSpritesInverse = new Image();
    monsterSprites.onload = function() {
        monsterReady = true;
    }
    monsterSpritesInverse.src = 'ressources/images/opponents/EyeMonsterInverse.png'
    let currentMonsterSprites = monsterSprites;

    // Game objects
    var hero = {
        width: 50,
        height: 50,
        speed: 10, // movement in pixels per second
        sprites: spritesHero.idle, // Initialize the animation 
        isAttacking: false,
        currentSprite: 0
    };
    hero.x = canvas.width / 4 - hero.width / 2; // Initialize x position of the hero
    hero.y = canvas.height / 2 - hero.height / 2; //Initialize y position of the hero
    //Monster
    var monster = {
        width: 50,
        height: 50,
        speed: 8, // movement in pixels per second
        sprites: spritesMonster.idle, // Initialize the animation 
        isAttacking: false,
        currentSprite: 0
    };
    monster.x = canvas.width / 4 + (Math.random() * (canvas.width - monster.width)); // Initialize x position of the hero
    monster.y = Math.random() * (canvas.height - monster.height); //Initialize y position of the hero
    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function(e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function(e) {
        delete keysDown[e.keyCode];
    }, false);

    // Update game objects
    var update = function(modifier) {
        //the attack has more precedence than the deplacement
        if ((hero.sprites == spritesHero.waitAttack && !(32 in keysDown)) || hero.isAttacking) {
            hero.isAttacking = true;
            changeSprites(hero, spritesHero.attack);
            console.log(currentSprite)
            if (hero.currentSprite == maxSprite - 1)
                hero.isAttacking = false;
        } else if (32 in keysDown) {
            changeSprites(hero, spritesHero.waitAttack);
        } else if (!hero.isAttacking) {
            if (38 in keysDown || 40 in keysDown || 37 in keysDown || 39 in keysDown) {
                if (38 in keysDown) { // Player holding up
                    hero.y -= hero.speed * modifier;
                    if (hero.y < 0)
                        hero.y = 0;
                }
                if (40 in keysDown) { // Player holding down
                    hero.y += hero.speed * modifier;
                    if (hero.y > canvas.height - hero.height)
                        hero.y = canvas.height - hero.height;
                }
                if (37 in keysDown) { // Player holding left
                    hero.x -= hero.speed * modifier;
                    currentHeroSprites = heroSprites;
                    if (hero.x < 0)
                        hero.x = 0;
                }
                if (39 in keysDown) { // Player holding right
                    hero.x += hero.speed * modifier;
                    currentHeroSprites = heroSpritesInverse;
                    if (hero.x > canvas.width - hero.width)
                        hero.x = canvas.width - hero.width;
                }
                changeSprites(hero, spritesHero.run);

            } else {
                changeSprites(hero, spritesHero.idle);

            }
        }

    };
    var updateMonster = function() {
        changeSprites(monster, spritesMonster.idle);
    };
    // Change the animation of the hero if the animation is already on going we simply changed the sprite
    function changeSprites(character, testSprite) {
        if (character.sprites == testSprite) {
            character.currentSprite = Math.floor(gameFrame / changedFrame) % testSprite.number;
        } else {
            character.sprites = testSprite;
            character.currentSprite = 0;
        }
    }
    // Draw everything
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //TODO: Do the background 

        if (heroReady) {
            context.drawImage(currentHeroSprites, hero.sprites.x + 100 * hero.currentSprite, hero.sprites.y, 100, 100, hero.x, hero.y, 50, 50);
        }

        //TODO: The monsters
        if (monsterReady) {
            context.drawImage(currentMonsterSprites, monster.sprites.x + 150 * monster.currentSprite, monster.sprites.y, 100, 100, monster.x, monster.y, 75, 75);
            console.log(monster.currentSprite);
        }
        //TODO: Create the system of score

    };

    // The main game loop
    var main = function() {
        var now = Date.now();
        //Delta to calculate the time between the 2 frames
        var delta = now - then;

        update(delta / 100);
        updateMonster(delta / 100)
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
        gameFrame++;
    };

    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    var then = Date.now();
    main();


});