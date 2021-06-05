document.addEventListener('DOMContentLoaded', function() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const score = JSON.parse(localStorage.getItem("score"));
    let rankings = JSON.parse(localStorage.getItem("rankings"));
    if (userInfo == null) {
        document.location.href = "./logon.html";
        return;
    }
    if (score == null) {
        document.location.href = "./game.html";
        return;
    }

    let currentPlayer = {
        'username': userInfo.username,
        'kingdomFlag': userInfo.kingdomFlag,
        'score': score
    };

    var renderRanking = function(idParent, no, ranking) {
        var ligne = "<tr>" +
            `<td>${no}</td>` +
            `<td><img src="${ranking.kingdomFlag}" class="flagranks"/></td>` +
            `<td>${ranking.username}</td>` +
            `<td>${ranking.score}</td>` +
            "</tr>";
        document.getElementById(idParent).innerHTML += ligne;
    }
    if (rankings == null) {
        rankings = [];
        rankings.push(currentPlayer);
    } else {
        for (let ranking in rankings) {
            if (rankings[ranking].score < currentPlayer.score || ranking == rankings.length - 1) {
                rankings.splice(ranking, 0, currentPlayer);
                break;
            }
        }
    }
    document.getElementById("myScore").innerHTML = currentPlayer.score;
    localStorage.setItem("rankings", JSON.stringify(rankings));
    localStorage.removeItem("score");
    for (let ranking = 1; ranking <= rankings.length; ranking++) {
        renderRanking("ranksTable", ranking, rankings[ranking - 1]);
    }


});