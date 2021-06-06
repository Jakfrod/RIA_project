document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo == null)
        document.location.href = './logon.html';

    // Sprite class
    const spritesHero = {
        width: 100,
        height: 100,
        idle: {
            x: 0,
            y: 0,
            number: 8
        },
        run: {
            x: 0,
            y: 100,
            number: 8
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
        },
        takeHit: {
            x: 0,
            y: 400,
            number: 3
        }
    };
    //Sprites data of the monster
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
    };
    //List of rewards the player can win
    const rewards = [{
            text: 'you win 1 heart.',
            image: new Image(),
            action: function() {
                hero.life += 1;
            }
        },
        {
            text: 'you win more speed !',
            image: new Image(),
            action: function() {
                hero.speed += 1;
            }
        },
        {
            text: 'You get only an apple !',
            image: new Image(),
            action: function() {}
        }
    ];
    rewards[0].image.src = 'ressources/images/items/hp.png';
    rewards[1].image.src = 'ressources/images/items/boots.png';
    rewards[2].image.src = 'ressources/images/items/apple.png'

    const background = new Image();
    let backgroundReady;
    background.onload = function() {
        backgroundReady = true;
    };
    background.src = 'ressources/images/backgroundgame.png';

    let actionOVer;
    let score = 1; //Number of room the player is currently. When the played die, we need to decrement of 1 to have the number of cleaned room
    let endRoom; // variabe that stop the game when the monster or the player is dead
    const changedFrame = 5; //Changed the sprite all the x frames
    let gameFrame = 0;
    //Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    //Load the heroSprites
    let heroReady;
    const heroSprites = new Image();

    heroSprites.src = userInfo.imagePath;
    //load the inverse of the sprites like this the hero can turn
    const heroSpritesInverse = new Image();
    heroSpritesInverse.onload = function() {
        heroReady = true;
    }
    let lastPoint = heroSprites.src.lastIndexOf('.');
    heroSpritesInverse.src = heroSprites.src.substring(0, lastPoint) + 'Inverse' + heroSprites.src.substring(lastPoint);;
    let currentHeroSprites = heroSpritesInverse;

    //Load the monsterSprites
    let monsterReady;
    const monsterSprites = new Image();
    monsterSprites.src = 'ressources/images/opponents/EyeMonster.png'
    const monsterSpritesInverse = new Image();
    monsterSpritesInverse.onload = function() {
        monsterReady = true;
    }
    monsterSpritesInverse.src = 'ressources/images/opponents/EyeMonsterInverse.png'
    let currentMonsterSprites = monsterSpritesInverse;
    let heartIconReady;
    const heartIcon = new Image();
    heartIcon.onload = function() {
        heartIconReady = true;
    }
    heartIcon.src = 'ressources/images/items/heart.png';

    // Game objects
    //Hero
    var hero = {
        life: 3,
        width: 50,
        height: 50,
        speed: 10, // movement in pixels per second
        sprites: spritesHero.idle, // Initialize the animation 
        isAttacking: false,
        currentSprite: 0,
        isDead: false
    };

    //Monster
    var monster = {
        life: 1,
        width: 100,
        height: 100,
        speed: 8, // movement in pixels per second
        sprites: spritesMonster.idle, // Initialize the animation 
        isAttacking: false,
        isTakingDamage: false,
        currentSprite: 0,
        isDead: false,
        cooldown: 0
    };
    const COOLDOWN_ATTACK_MONSTER = 20;

    // Handle keyboard controls
    var keysDown = {};

    addEventListener('keydown', function(e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener('keyup', function(e) {
        delete keysDown[e.keyCode];
    }, false);

    // Update game objects
    var update = function(modifier) {
        if (hero.life === 0) {
            if (changeSprites(hero, spritesHero.die))
                hero.isDead = true;
            return;
        }

        if (hero.isTakingDamage) {
            if (!changeSprites(hero, spritesHero.takeHit))
                hero.isTakingDamage = false;
            return;
        }

        //the attack has more precedence than the deplacement
        if ((hero.sprites == spritesHero.waitAttack && !(32 in keysDown)) || hero.isAttacking) {
            hero.isAttacking = !changeSprites(hero, spritesHero.attack);
            if (!hero.isAttacking && Math.pow(Math.pow(monster.x - hero.x, 2) + Math.pow(monster.y - hero.y, 2), 0.5) < 20) {
                if (!monster.isTakingDamage) {
                    monster.life -= 1;
                    monster.isTakingDamage = true;
                }
                changeSprites(monster, spritesMonster.takeHit)

            }
        } else if (32 in keysDown) {
            changeSprites(hero, spritesHero.waitAttack);
        } else
        if (!hero.isAttacking) {
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
    var updateMonster = function(modifier) {
        if (monster.life == 0) {
            if (changeSprites(monster, spritesMonster.die))
                monster.isDead = true;
            return;
        }

        if (monster.isTakingDamage) {
            if (changeSprites(monster, spritesMonster.takeHit))
                monster.isTakingDamage = false;
            return;
        }
        let distance = Math.pow(Math.pow(monster.x - hero.x, 2) + Math.pow(monster.y - hero.y, 2), 0.5);
        console.log(monster.cooldown);
        console.log(distance);
        if (((20 >= distance && monster.cooldown <= 0) || monster.isAttacking)) {
            monster.isAttacking = !changeSprites(monster, spritesMonster.attack);
            if (distance <= 20) {
                if (!monster.isAttacking) {
                    hero.isTakingDamage = true;
                    monster.cooldown = COOLDOWN_ATTACK_MONSTER;
                    hero.life -= 1;
                }
                changeSprites(hero, spritesHero.takeHit);
            }
        } else if (!monster.isAttacking) {
            monster.cooldown -= modifier;
            if (20 <= distance) {
                let move = monster.speed * modifier;
                if (hero.x > monster.x + 2) {
                    monster.x += move;
                    currentMonsterSprites = monsterSprites;
                } else if (hero.x < monster.x - 2) {
                    monster.x -= move;
                    currentMonsterSprites = monsterSpritesInverse;
                }
                if (hero.y - monster.y >= 20)
                    monster.y += move;
                else if (hero.y - monster.y <= -20)
                    monster.y -= move;
                changeSprites(monster, spritesMonster.run);
            } else
                changeSprites(monster, spritesMonster.idle);
        }
    };
    // Change the animation of the hero if the animation is already on going we simply changed the sprite
    function changeSprites(character, testSprite) {
        let isAnimationFinishedOnce = false;
        if (character.sprites == testSprite) {
            const newCurrentSprite = Math.floor(gameFrame / changedFrame) % testSprite.number;
            isAnimationFinishedOnce = newCurrentSprite < character.currentSprite;
            character.currentSprite = newCurrentSprite;
        } else {
            character.sprites = testSprite;
            character.currentSprite = 0;
        }
        return isAnimationFinishedOnce;
    }

    // Render the game over screen
    var gameOver = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const sizeText = 30;
        context.font = `${sizeText}px Permanent Marker`;
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        context.fillStyle = 'red';
        context.fillText('GameOver !', canvas.width / 2, canvas.height / 2 + sizeText);
        context.font = `${sizeText/2}px Permanent Marker`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = 'white';
        context.fillText('Click on Enter...', canvas.width / 2 + 1.5 * sizeText, canvas.height / 2 + sizeText);
    }

    // Render the clean scene
    var cleanRoom = function(reward) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const sizeText = 30;
        context.font = `${sizeText}px Permanent Marker`;
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        context.fillStyle = 'green';
        context.fillText('Room cleaned !', canvas.width / 2, canvas.height / 2 + sizeText);
        const itemWidth = itemHeight = 50;
        context.drawImage(reward.image, 0, 0, reward.image.width, reward.image.height, canvas.width / 2 - itemWidth / 2, canvas.height / 2 - itemHeight, itemWidth, itemHeight)
        context.font = `${sizeText/2}px Permanent Marker`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = 'white';
        context.fillText(reward.text, canvas.width / 2 + 1.5 * sizeText, canvas.height / 2 + sizeText);
        context.fillText('Click on Enter...', canvas.width / 2, canvas.height / 2 + sizeText * 1.5)

    }
    var resetRoom = function() {
            //Reset position of hero
            hero.x = canvas.width / 4 - hero.width / 2; // Initialize x position of the hero
            hero.y = canvas.height / 2 - hero.height / 2; //Initialize y position of the hero

            //Reset position of the monster
            monster.x = canvas.width / 4 + (Math.random() * (canvas.width - monster.width / 2)); // Initialize x position of the hero
            monster.y = Math.random() * (canvas.height - monster.height); //Initialize y position of the hero
            // Rise the life of the monster all the 2 rooms
            monster.life = 1 + Math.ceil(score / 2);
            monster.isDead = false;
        }
        // Draw the game
    var game = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //TODO: Do the background 
        if (backgroundReady)
            context.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);

        if (heartIconReady) {
            for (let i = 0; i < hero.life; i++) {
                context.drawImage(heartIcon, 0, 0, heartIcon.width, heartIcon.height, 20 * i + 10, 0, 20, 20);
            }
        }

        if (heroReady) {
            //context.drawImage(currentHeroSprites, hero.sprites.x + spritesHero.width * hero.currentSprite, hero.sprites.y, spritesHero.width, spritesHero.height, 0 - hero.width / 2, 0 - hero.height / 2, hero.width, hero.height);
            context.drawImage(currentHeroSprites, hero.sprites.x + spritesHero.width * hero.currentSprite, hero.sprites.y, spritesHero.width, spritesHero.height, hero.x - hero.width / 2, hero.y - hero.height / 2, hero.width, hero.height);
        }

        //TODO: The monsters
        if (monsterReady) {
            context.drawImage(currentMonsterSprites, monster.sprites.x + spritesMonster.width * monster.currentSprite, monster.sprites.y, spritesMonster.width, spritesMonster.height, monster.x - monster.width / 2, monster.y - monster.height / 2, monster.width, monster.height);
        }

    };
    let gameOverAction = function() {
        localStorage.setItem('score', score);
        document.location.href = './ranking.html';
    }
    let touchEnter = function() {
        if (13 in keysDown) {
            endRoom = false;
            actionOver();
        }
    }

    // The main game loop
    var main = function() {
        var now = Date.now();
        //Delta to calculate the time between the 2 frames
        var delta = now - then;
        if (!hero.isDead && !monster.isDead && !endRoom) {
            updateMonster(delta / 100);
            update(delta / 100);
            game();
        } else if (!endRoom) {
            endRoom = true;
            if (hero.isDead) {
                actionOver = gameOverAction;
                gameOver();
            } else if (monster.isDead) {
                score += 1;
                const reward = rewards[Math.floor(Math.random() * rewards.length)];
                reward.action();
                cleanRoom(reward);
                actionOver = resetRoom;
            }
        } else {
            touchEnter();
        }

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
    resetRoom();
    main();


});