document.addEventListener('DOMContentLoaded', function() {
    // info we will send to the game
    const userInfo = {
            username: '',
            imagePath: '',
            kingdomFlag: '',
        }
        //Logon

    const btnSaveUsername = document.getElementsByName('btnSendUsername')[0];
    const txtUsername = document.getElementsByName('txtUsername')[0];

    btnSaveUsername.addEventListener('click', function(e) {
        if (txtUsername.checkValidity() === false) {
            return
        }
        userInfo.username = txtUsername.value;
        document.getElementById('selectCharacter').hidden = false;
        document.getElementById('sectionLogin').hidden = true;

    });

    //Define the drag and drop zone
    let selectCharacters;
    const canvasZone = document.getElementById('canvas');

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        if (ev.dataTransfer.getData('text') == selectCharacters)
            return;
        if (dropZone.children.length != 0) {
            canvasZone.appendChild(ev.target);
            dropZone.innerHTML = '';
        }
        selectCharacters = ev.dataTransfer.getData('text');
        dropZone.appendChild(document.getElementById(selectCharacters));
    }
    const dropZone = document.getElementById('dropZone');
    dropZone.ondrop = drop;
    dropZone.ondragover = allowDrop;

    const elementsDragable = document.getElementsByClassName('js-dragable');
    for (const element of elementsDragable) {
        element.ondragstart = drag;
    }

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

    //Choose character parts

    const btnChooseCharacter = document.getElementsByName('btnChooseCharacter')[0];
    btnChooseCharacter.addEventListener('click', function() {
        if (dropZone.children.length == 0 || selectCharacters === '') {
            alert('Select a character !!!!!!!!');
            return;
        }
        switch (selectCharacters) {
            case 'canvasCharacter1':
                userInfo.imagePath = character1Image.src;
                break;
            case 'canvasCharacter2':
                userInfo.imagePath = character2Image.src;
                break;

        }
        document.getElementById('showKingdom').hidden = false;
        document.getElementById('selectCharacter').hidden = true;
    });


    // Function to get GEO position
    function getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const userPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    getCountry(userPosition);
                },
                function() {
                    alert('Could not get your position. Setting your default position as Martigny !');
                    const userPosition = {
                        latitude: 46.1044,
                        longitude: 7.07
                    };

                    getCountry(userPosition);
                }
            )
        }
    }
    getPosition(); // Call the function to get the geoposition


    const titleOfKingdom = document.getElementsByClassName('titleOfKingdom')[0];

    // function to get the country of the position
    function getCountry(userPosition) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&localityLanguage=en`);
        request.send();

        request.addEventListener('load', function() {
            const data = JSON.parse(this.responseText);
            const countryName = data.countryName;
            titleOfKingdom.innerHTML = countryName;
            getFlag(countryName);
        });
    }

    let flagUrl;
    // function to get the flag
    function getFlag(countryName) {
        const requestFlag = new XMLHttpRequest();
        requestFlag.open('GET', `https://restcountries.eu/rest/v2/name/${countryName}`);

        requestFlag.send();
        requestFlag.addEventListener('load', function() {
            const data = JSON.parse(this.responseText);
            flagUrl = data[0].flag;

            const html = `<img class="countryImg" src="${flagUrl}"/>`;
            userInfo.kingdomFlag = flagUrl;
            titleOfKingdom.insertAdjacentHTML('afterend', html);
        });
    }

    const btnContinue = document.getElementsByClassName('btnContinue')[0];

    btnContinue.addEventListener('click', function(e) {

        userInfo.kingdomFlag = flagUrl;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        document.location.href = './game.html';
    });
});