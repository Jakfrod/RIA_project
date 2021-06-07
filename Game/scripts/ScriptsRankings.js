document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const score = JSON.parse(localStorage.getItem('score'));
    let rankings = JSON.parse(localStorage.getItem('rankings'));
    if (userInfo == null) {
        document.location.href = './logon.html';
        return;
    }
    if (score == null) {
        document.location.href = './game.html';
        return;
    }

    let currentPlayer = {
        'username': userInfo.username,
        'kingdomFlag': userInfo.kingdomFlag,
        'score': score
    };

    function renderRanking(idParent, no, ranking) {
        var ligne = '<tr>' +
            `<td>${no}</td>` +
            `<td><img src="${ranking.kingdomFlag}" class="flagranks"/></td>` +
            `<td>${ranking.username}</td>` +
            `<td>${ranking.score-1}</td>` +
            '</tr>';
        document.getElementById(idParent).innerHTML += ligne;
    }
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

    document.getElementById('myScore').innerHTML = currentPlayer.score - 1;
    localStorage.setItem('rankings', JSON.stringify(rankings));
    localStorage.removeItem('score');
    for (let ranking = 1; ranking <= rankings.length; ranking++) {
        renderRanking('ranksTable', ranking, rankings[ranking - 1]);
    }

    document.getElementById('btnTryAgain').onclick = function() {
        document.location.href = './game.html';
    };
    document.getElementById('btnNewLogin').onclick = function() {
        localStorage.removeItem('userInfo');
        document.location.href = './logon.html';
    };

});