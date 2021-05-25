document.addEventListener('DOMContentLoaded', function() {
    //Define the drag and drop zone
    let selectCharacters;
    const canvasZone = document.getElementById("canvas");

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        if (ev.dataTransfer.getData("text") == selectCharacters)
            return;
        if (dropZone.children.length != 0) {
            canvasZone.appendChild(ev.target);
            dropZone.innerHTML = "";
        }
        selectCharacters = ev.dataTransfer.getData("text");
        dropZone.appendChild(document.getElementById(selectCharacters));
    }
    const dropZone = document.getElementById("dropZone");
    dropZone.ondrop = drop;
    dropZone.ondragover = allowDrop;

    const elementsDragable = document.getElementsByClassName("js-dragable");
    for (const element of elementsDragable) {
        element.ondragstart = drag;
    }
    //Logon

    const btnSaveUsername = document.getElementsByName('btnSendUsername')[0];

    btnSaveUsername.addEventListener('click', function(e) {
        alert('JOJO');
    });


    //Load Canvas to choose the character
    //Get the canvas 
    const canvas1 = document.getElementById('canvasCharacter1');
    const canvas2 = document.getElementById('canvasCharacter2');

    //Create the contexts 
    const context1 = canvas1.getContext('2d');
    const context2 = canvas2.getContext('2d');

    //Get the sprite of the characters
    const character1Image = new Image();
    character1Image.src = 'ressources/images/characters/HeavyBandit.png';
    const character2Image = new Image();
    character2Image.src = 'ressources/images/characters/LightBandit.png';
    let gameFrame = 0;
    const maxSprite = 4; // There are 4 sprites
    const changedFrame = 20; //Changed the sprite all the x frames
    //Function to display the image of the characters
    function displayCharacters() {
        let spriteIndex = Math.floor(gameFrame / changedFrame) % maxSprite;

        displayCharacter(spriteIndex, context1, character1Image, canvas1);
        displayCharacter(spriteIndex, context2, character2Image, canvas2);
        requestAnimationFrame(displayCharacters);
        gameFrame++;
    }

    function displayCharacter(spriteIndex, context, image, canvas) {

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 100 * spriteIndex, 0, 100, 100, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(displayCharacters);
});