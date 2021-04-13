document.addEventListener("DOMContentLoaded", function(event) { // your page initialization code here
    // the DOM will be available here
    const button = document.getElementsByClassName("hamburger")[0];
    let isNavClosed = true;
    button.addEventListener('click', openClosehamburger);

    function openClosehamburger() {
        let allhamburgerItems = document.querySelectorAll("nav > ul > li:not(.hamburger)");

        allhamburgerItems.forEach(element => {
            if (isNavClosed) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });

        isNavClosed = !isNavClosed;

    }
});