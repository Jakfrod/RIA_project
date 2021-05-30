document.addEventListener('DOMContentLoaded', function() {
    // Sprite class
    const sprites = {
        width: 100,
        height: 100,
        idle: {
            x: 0,
            y: 0
        },
        run: {
            x: 0,
            y: 100
        },
        waitAttack: {
            x: 0,
            y: 200
        },
        attack: {
            x: 400,
            y: 200
        },
        die: {
            x: 0,
            y: 400
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
    let currentHeroSprites = heroSprites;
    // Game objects
    var hero = {
        width: 50,
        height: 50,
        speed: 10, // movement in pixels per second
        sprites: sprites.idle, // Initialize the animation 
        isAttacking: false
    };
    hero.x = canvas.width / 2 - hero.width / 2; // Initialize x position of the hero
    hero.y = canvas.height / 2 - hero.height / 2; //Initialize y position of the hero

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
        if ((hero.sprites == sprites.waitAttack && !(32 in keysDown)) || hero.isAttacking) {
            hero.isAttacking = true;
            changeSprites(sprites.attack);
            console.log(currentSprite)
            if (currentSprite == maxSprite - 1)
                hero.isAttacking = false;
        } else if (32 in keysDown) {
            changeSprites(sprites.waitAttack);
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
                changeSprites(sprites.run);

            } else {
                changeSprites(sprites.idle);

            }
        }

    };
    // Change the animation of the hero if the animation is already on going we simply changed the sprite
    function changeSprites(testSprite) {
        if (hero.sprites == testSprite) {
            currentSprite = Math.floor(gameFrame / changedFrame) % maxSprite;
        } else {
            hero.sprites = testSprite;
            currentSprite = 0;
        }
    }
    // Draw everything
    var render = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //TODO: Do the background 

        if (heroReady) {
            context.drawImage(currentHeroSprites, hero.sprites.x + 100 * currentSprite, hero.sprites.y, 100, 100, hero.x, hero.y, 50, 50);
        }

        //TODO: The monsters

        //TODO: Create the system of score

    };

    // The main game loop
    var main = function() {
        var now = Date.now();
        //Delta to calculate the time between the 2 frames
        var delta = now - then;

        update(delta / 100);
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