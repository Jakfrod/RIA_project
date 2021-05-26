document.addEventListener('DOMContentLoaded', function() {
    //Get canvas and context
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
    let gameFrame = 0;
    const maxSprite = 4; // There are 4 sprites
    const changedFrame = 20; //Changed the sprite all the x frames
    function game() {
        let spriteIndex = Math.floor(gameFrame / changedFrame) % maxSprite;
        drawCharacters(spriteIndex);
        requestAnimationFrame(game);
        gameFrame++;
    }

    requestAnimationFrame(game);

});