document.addEventListener('DOMContentLoaded', function() {
    //Load data
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const score = JSON.parse(localStorage.getItem('score'));
    let rankings = JSON.parse(localStorage.getItem('rankings'));
    //Verification of data
    if (userInfo == null) {
        document.location.href = './logon.html';
        return;
    }
    if (score == null) {
        document.location.href = './game.html';
        return;
    }
    //Create the rank of the current player
    let currentPlayer = {
        'username': userInfo.username,
        'kingdomFlag': userInfo.kingdomFlag,
        'score': score
    };
    //function to create a rank
    function renderRanking(idParent, no, ranking) {
        var ligne = '<tr>' +
            `<td>${no}</td>` +
            `<td><img src="${ranking.kingdomFlag}" class="flagranks"/></td>` +
            `<td>${ranking.username}</td>` +
            `<td>${ranking.score-1}</td>` +
            '</tr>';
        document.getElementById(idParent).innerHTML += ligne;
    }
    //Verify if there is already data
    if (rankings == null) {
        rankings = [];
        // Data
        rankings.push({
            'username': 'DarkKnight',
            'kingdomFlag': 'https://restcountries.eu/data/prt.svg',
            'score': 15
        });
        rankings.push({
            'username': 'Noobie',
            'kingdomFlag': 'https://restcountries.eu/data/chn.svg',
            'score': 1
        });
    }
    // Find the actual rank
    let isRegistered = false;
    for (let ranking in rankings) {

        if (rankings[ranking].username === currentPlayer.username) {
            if (rankings[ranking].score > currentPlayer.score) {
                break;
            } else {
                rankings.splice(ranking, 1);
            }
        }
        if (rankings[ranking].score < currentPlayer.score && !isRegistered) {
            rankings.splice(ranking, 0, currentPlayer);
            isRegistered = true;
        }
    }
    // Add data to html
    document.getElementById('myScore').innerHTML = currentPlayer.score - 1;
    localStorage.setItem('rankings', JSON.stringify(rankings));
    localStorage.removeItem('score');
    for (let ranking = 1; ranking <= rankings.length; ranking++) {
        renderRanking('ranksTable', ranking, rankings[ranking - 1]);
    }
    //Event click on buttons
    document.getElementById('btnTryAgain').onclick = function() {
        document.location.href = './game.html';
    };
    document.getElementById('btnNewLogin').onclick = function() {
        localStorage.removeItem('userInfo');
        document.location.href = './logon.html';
    };

});