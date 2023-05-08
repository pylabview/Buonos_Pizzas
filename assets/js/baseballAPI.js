var startPoint = 'https://api-baseball.p.rapidapi.com';
var season = 2023;
var yankeesID = 25;
var redsoxID = 5;
var dayIndex = 0;
var yankeesImage = "./assets/Images/yankeesLogo.png";
var athleticsImage = "./assets/Images/athleticsLogo.png";
var chosenTeams = [];
var cTeam = "";
var dropDownFavs = document.getElementById("favorite-teams-list");

var favoriteTeams = [];


var dayObject = { 
    today : dayjs().format('YYYY-MM-DD'),
    dayAfter1 : dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dayAfter2 : dayjs().add(2, 'day').format('YYYY-MM-DD'),
    dayAfter3 : dayjs().add(3, 'day').format('YYYY-MM-DD'),
    dayAfter4 : dayjs().add(4, 'day').format('YYYY-MM-DD'),
    dayAfter5 : dayjs().add(5, 'day').format('YYYY-MM-DD'),
    dayAfter6 : dayjs().add(6, 'day').format('YYYY-MM-DD'),
    dayAfter7 : dayjs().add(7, 'day').format('YYYY-MM-DD')
}

var statsObject = {
    name: "",
    logo: "",
    group: "",
    position: 0,
    loses: 0,
    wins: 0,
    id: ""
}

var gameTodayObject = {
    date: "",
    time: "",
    gameStatus: "",
    awayLogo: "",
    awayName: "",
    awayTotal: "",
    awayInnings: [],
    awayHits: "",
    awayErrors: "",
    homeLogo: "",
    homeName: "",
    homeTotal: "",
    homeInnings: [],
    homeHits: "",
    homeErrors: "",
}

var gameOneObject = {
    date: "",
    time: "",
    awayLogo: "",
    awayName: "",
    homeLogo: "",
    homeName: ""
}

var gameTwoObject = {
    date: "",
    time: "",
    awayLogo: "",
    awayName: "",
    homeLogo: "",
    homeName: ""
}

var gameThreeObject = {
    date: "",
    time: "",
    awayLogo: "",
    awayName: "",
    homeLogo: "",
    homeName: ""
}

var dayArr = [dayObject.today, dayObject.dayAfter1, dayObject.dayAfter2, dayObject.dayAfter3, dayObject.dayAfter4, dayObject.dayAfter5, dayObject.dayAfter6, dayObject.dayAfter7];

document.querySelector('#choose-team-button').addEventListener('click', chooseTeam);


function chooseTeam() {
    dayIndex = 0;

    var team = document.getElementById("team-input").value;
    document.getElementById("team-input").value = '';

    var url =  startPoint + '/teams?search=' + team;
    
    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {     
                if (data.response.length !== 0) {
                    for (i = 0; i < data.response.length; i++) {
                        var newTeam = document.createElement('button');
                        newTeam.textContent = data.response[i].name;
                        newTeam.id = "btn-" + data.response[i].id;
                        document.getElementById("add-buttons").appendChild(newTeam);
                        document.querySelector('#' + newTeam.id).addEventListener('click', selectTeam);
                    }

                    function selectTeam() {
                        newID = this.id.split('-');
                        finalID = newID[1];
                        console.log('--->finalID: ',typeof finalID);
                        console.log('--->season: ',typeof season);
                        start(finalID, season);
                        parent = document.getElementById('add-buttons');
                        parent.innerHTML = '';
                        
                    }
                }
                else {
                    alert('Please enter a valid team name!!!');
                }
            })
        })
    } 
    catch (error) {
        console.error(error);
    }
}

function start(_teamID, _season) {

    console.log('start')
    getStats(_teamID, _season);
    getGameToday(_teamID, _season, dayArr[dayIndex]);
}

function getStats(_teamID, _season) {
    
    var url =  startPoint + '/standings?league=1&season=' + _season + '&team=' + _teamID;
    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };
    
    try {
        
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                statsObject.id = data.response[0][1].team.id;
                statsObject.name = data.response[0][1].team.name;
                statsObject.logo = data.response[0][1].team.logo;
                statsObject.group = data.response[0][1].group.name;
                statsObject.position = data.response[0][1].position;
                statsObject.loses = data.response[0][1].games.lose.total;
                statsObject.wins = data.response[0][1].games.win.total;
                displayStats();
                currentTeam = statsObject.name;
                storeLocalFav(statsObject.id,2023, statsObject.name);
            })
             })
    } 
    catch (error) {
    }
}

function addToFavorites() {
    var favoriteTeamsObject = {
        id: "",
        name: ""
    }

    favoriteTeamsObject.id = statsObject.id; 
    favoriteTeamsObject.name = statsObject.name;
    favoriteTeams.push(favoriteTeamsObject);
    localStorage.setItem('favorite-team', JSON.stringify(favoriteTeams));
    init();
}

function displayStats() {
    var teamName = document.querySelector('#team-name');
    var teamGroupAndPosition = document.querySelector('#team-group-position');
    var homeWinsLoses = document.querySelector('#home-wins-loses');
    teamName.textContent = statsObject.name;

    if (statsObject.position == 1) {
        teamGroupAndPosition.textContent = statsObject.position + 'st' + ' in ' + statsObject.group;
    }
    else if (statsObject.position == 2) {
        teamGroupAndPosition.textContent = statsObject.position + 'nd' + ' in ' + statsObject.group;
    }
    else if (statsObject.position == 3) {
        teamGroupAndPosition.textContent = statsObject.position + 'rd' + ' in ' + statsObject.group;
    }
    else {
        teamGroupAndPosition.textContent = statsObject.position + 'th' + ' in ' + statsObject.group;
    }

    homeWinsLoses.textContent = '(' + statsObject.wins + '-' + statsObject.loses + ')';
}

function getGameToday(_teamID, _season, _date) {
    var url =  startPoint + '/games?team=' + _teamID + '&season=' + _season + '&date=' + _date;

    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {
                if (data.response.length === 0) {
                    dayIndex++;
                    getGameToday(_teamID, _season, dayArr[dayIndex]);
                }
                else {
                    gameTodayObject.date = data.response[0].date;
                    gameTodayObject.gameStatus = data.response[0].status.short;
                    gameTodayObject.awayName = data.response[0].teams.away.name;
                    gameTodayObject.homeName = data.response[0].teams.home.name;
                    awayLogo = data.response[0].teams.away.logo;
                    homeLogo = data.response[0].teams.home.logo;
                    
                    if (gameTodayObject.awayName == "New York Yankees") {
                        
                        gameTodayObject.awayLogo = yankeesImage;
                    }
                    else if (gameTodayObject.awayName == "Oakland Athletics") {
                        gameTodayObject.awayLogo = athleticsImage;
                    }
                    else {
                        gameTodayObject.awayLogo = awayLogo;
                    }

                    if (gameTodayObject.homeName == "New York Yankees") {
                        gameTodayObject.homeLogo = yankeesImage;
                    }
                    else if (gameTodayObject.homeName == "Oakland Athletics") {
                        gameTodayObject.homeLogo = athleticsImage;
                    }
                    else {
                        gameTodayObject.homeLogo = homeLogo;
                    }

                    gameTodayObject.awayTotal = data.response[0].scores.away.total;
                    gameTodayObject.awayInnings = data.response[0].scores.away.innings;
                    gameTodayObject.awayHits = data.response[0].scores.away.hits;
                    gameTodayObject.awayErrors = data.response[0].scores.away.errors;
                    gameTodayObject.homeTotal = data.response[0].scores.home.total;   
                    gameTodayObject.homeInnings = data.response[0].scores.home.innings;
                    gameTodayObject.homeHits = data.response[0].scores.home.hits;
                    gameTodayObject.homeErrors = data.response[0].scores.home.errors;
                    var date = data.response[0].date;
                    var splitDate = date.split('T');
                    gameTodayObject.date = splitDate[0];
                    var time  = data.response[0].time;
                    var splitTime = time.split(':');
                    var hour = splitTime[0];
                    var minute = splitTime[1];
                    hour = hour - 7;
                    var suffix = hour <= 12 ? 'AM':'PM';
                    hour = (hour % 12) || 12;
                    gameTodayObject.time = hour + ":" + minute + ' ' + suffix;
                    displayGameToday();
                    dayIndex++;
                    getGameOne(_teamID, _season, dayArr[dayIndex]);
                } 
            })
        })
    } 
    catch (error) {
        console.error(error);
    }
}

function displayGameToday() {
    var currentGameDay = document.querySelector('#current-game-day');
    currentGameDay.textContent = "MLB * " + gameTodayObject.date + ", " + gameTodayObject.time;
    var currentGameStatus = document.querySelector('#current-game-status');

    if (gameTodayObject.gameStatus === "NS") {
        currentGameStatus.textContent = "Not started";

    }
    else if (gameTodayObject.gameStatus === "IN1") {
        currentGameStatus.textContent = "1st";
    }
    else if (gameTodayObject.gameStatus === "IN2") {
        currentGameStatus.textContent = "2nd";
    }
    else if (gameTodayObject.gameStatus === "IN3") {
        currentGameStatus.textContent = "3rd";
    }
    else if (gameTodayObject.gameStatus === "IN4") {
        currentGameStatus.textContent = "4th";
    }
    else if (gameTodayObject.gameStatus === "IN5") {
        currentGameStatus.textContent = "5th";
    }
    else if (gameTodayObject.gameStatus === "IN6") {
        currentGameStatus.textContent = "6th";
    }
    else if (gameTodayObject.gameStatus === "IN7") {
        currentGameStatus.textContent = "7th";
    }
    else if (gameTodayObject.gameStatus === "IN8") {
        currentGameStatus.textContent = "8th";
    }
    else if (gameTodayObject.gameStatus === "IN9") {
        currentGameStatus.textContent = "9th";
    }
    else if (gameTodayObject.gameStatus === "POST") {
        currentGameStatus.textContent = "Postponed";
    }
    else if (gameTodayObject.gameStatus === "CANC") {
        currentGameStatus.textContent = "Cancelled";
    }
    else if (gameTodayObject.gameStatus === "INTR") {
        currentGameStatus.textContent = "Interrupted";
    }
    else if (gameTodayObject.gameStatus === "ABD") {
        currentGameStatus.textContent = "Abandoned";
    }
    else if (gameTodayObject.gameStatus === "FT") {
        currentGameStatus.textContent = "Final";
    }

    document.getElementById('team-logo-home').src= gameTodayObject.homeLogo;
    document.getElementById('team-logo-away').src= gameTodayObject.awayLogo;
    var homeTeamName = document.querySelector('#home-team-name');
    var awayTeamName = document.querySelector('#away-team-name');
    homeTeamName.textContent = gameTodayObject.homeName;
    awayTeamName.textContent = gameTodayObject.awayName;
    var homeCurrentScore = document.querySelector('#home-current-score');
    var awayCurrentScore = document.querySelector('#away-current-score');
    homeCurrentScore.textContent = gameTodayObject.homeTotal;
    awayCurrentScore.textContent = gameTodayObject.awayTotal;
    var inningsHomeTeamName = document.querySelector('#innings-home-team-name');
    var inningsAwayTeamName = document.querySelector('#innings-away-team-name');
    inningsHomeTeamName.textContent = gameTodayObject.homeName;
    inningsAwayTeamName.textContent = gameTodayObject.awayName;
    var inningHome = document.getElementById('innings-home');
    var iningHomeChildren = inningHome.children;

    if (gameTodayObject.homeInnings[1] === null) {
        iningHomeChildren[0].textContent = "-";
    }
    else {
        iningHomeChildren[0].textContent = gameTodayObject.homeInnings[1];
    }
    
    if (gameTodayObject.homeInnings[2] === null) {
        iningHomeChildren[1].textContent = "-";
    }
    else {
        iningHomeChildren[1].textContent = gameTodayObject.homeInnings[2];
    }

    if (gameTodayObject.homeInnings[3] === null) {
        iningHomeChildren[2].textContent = "-";
    }
    else {
        iningHomeChildren[2].textContent = gameTodayObject.homeInnings[3];
    }

    if (gameTodayObject.homeInnings[4] === null) {
        iningHomeChildren[3].textContent = "-";
    }
    else {
        iningHomeChildren[3].textContent = gameTodayObject.homeInnings[4];
    }

    if (gameTodayObject.homeInnings[5] === null) {
        iningHomeChildren[4].textContent = "-";
    }
    else {
        iningHomeChildren[4].textContent = gameTodayObject.homeInnings[5];
    }
    
    if (gameTodayObject.homeInnings[6] === null) {
        iningHomeChildren[5].textContent = "-";
    }
    else {
        iningHomeChildren[5].textContent = gameTodayObject.homeInnings[6];
    }

    if (gameTodayObject.homeInnings[7] === null) {
        iningHomeChildren[6].textContent = "-";
    }
    else {
        iningHomeChildren[6].textContent = gameTodayObject.homeInnings[7];
    }
    
    if (gameTodayObject.homeInnings[8] === null) {
        iningHomeChildren[7].textContent = "-";
    }
    else {
        iningHomeChildren[7].textContent = gameTodayObject.homeInnings[8];
    }

    if (gameTodayObject.homeInnings[9] === null) {
        iningHomeChildren[8].textContent = "-";
    }
    else {
        iningHomeChildren[8].textContent = gameTodayObject.homeInnings[9];
    }

    if (gameTodayObject.homeTotal === null) {
        iningHomeChildren[9].textContent = "-";
    }
    else {
        iningHomeChildren[9].textContent = gameTodayObject.homeTotal;
    }

    if (gameTodayObject.homeHits === null) {
        iningHomeChildren[10].textContent = "-";
    }
    else {
        iningHomeChildren[10].textContent = gameTodayObject.homeTotal;
    }
    
    if (gameTodayObject.homeHits === null) {
        iningHomeChildren[11].textContent = "-";
    }
    else {
        iningHomeChildren[11].textContent = gameTodayObject.homeErrors;
    }
    
    var inningAway = document.getElementById('innings-away');
    var iningAwayChildren = inningAway.children;
    
    if (gameTodayObject.awayInnings[1] === null) {
        iningAwayChildren[0].textContent = "-";
    }
    else {
        iningAwayChildren[0].textContent = gameTodayObject.awayInnings[1];
    }
    
    if (gameTodayObject.awayInnings[2] === null) {
        iningAwayChildren[1].textContent = "-";
    }
    else {
        iningAwayChildren[1].textContent = gameTodayObject.awayInnings[2];
    }

    if (gameTodayObject.awayInnings[3] === null) {
        iningAwayChildren[2].textContent = "-";
    }
    else {
        iningAwayChildren[2].textContent = gameTodayObject.awayInnings[3];
    }

    if (gameTodayObject.awayInnings[4] === null) {
        iningAwayChildren[3].textContent = "-";
    }
    else {
        iningAwayChildren[3].textContent = gameTodayObject.awayInnings[4];
    }
    
    if (gameTodayObject.awayInnings[5] === null) {
        iningAwayChildren[4].textContent = "-";
    }
    else {
        iningAwayChildren[4].textContent = gameTodayObject.awayInnings[5];
    }

    if (gameTodayObject.awayInnings[6] === null) {
        iningAwayChildren[5].textContent = "-";
    }
    else {
        iningAwayChildren[5].textContent = gameTodayObject.awayInnings[6];
    }
    
    if (gameTodayObject.awayInnings[7] === null) {
        iningAwayChildren[6].textContent = "-";
    }
    else {
        iningAwayChildren[6].textContent = gameTodayObject.awayInnings[7];
    }

    if (gameTodayObject.awayInnings[8] === null) {
        iningAwayChildren[7].textContent = "-";
    }
    else {
        iningAwayChildren[7].textContent = gameTodayObject.awayInnings[8];
    }

    if (gameTodayObject.awayInnings[9] === null) {
        iningAwayChildren[8].textContent = "-";
    }
    else {
        iningAwayChildren[8].textContent = gameTodayObject.awayInnings[9];
    }

    if (gameTodayObject.awayTotal === null) {
        iningAwayChildren[9].textContent = "-";
    }
    else {
        iningAwayChildren[9].textContent = gameTodayObject.awayTotal;
    }

    if (gameTodayObject.awayHits === null) {
        iningAwayChildren[10].textContent = "-";
    }
    else {
        iningAwayChildren[10].textContent = gameTodayObject.awayHits;
    }

    if (gameTodayObject.awayErrors === null) {
        iningAwayChildren[11].textContent = "-";
    }
    else {
        iningAwayChildren[11].textContent = gameTodayObject.awayErrors;
    }
}

function getGameOne(_teamID, _season, _date) {
    var url =  startPoint + '/games?team=' + _teamID + '&season=' + _season + '&date=' + _date;

    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {
                if (data.response.length === 0) {
                    dayIndex++;
                    getGameOne(yankeesID, season, dayArr[dayIndex])
                }
                else {
                    var time  = data.response[0].time;
                    var splitTime = time.split(':');
                    var hour = splitTime[0];
                    var minute = splitTime[1];
                    hour = hour - 7;
                    var suffix = hour <= 12 ? 'AM':'PM';
                    hour = (hour % 12) || 12;
                    gameOneObject.time = hour + ":" + minute + ' ' + suffix;
                    var date = data.response[0].date;
                    var splitDate = date.split('T');
                    gameOneObject.date = splitDate[0];
                    gameOneObject.awayName = data.response[0].teams.away.name;
                    gameOneObject.homeName = data.response[0].teams.home.name;
                    awayLogo = data.response[0].teams.away.logo;
                    homeLogo = data.response[0].teams.home.logo;
                    
                    if (gameOneObject.awayName == "New York Yankees") {
                        gameOneObject.awayLogo = yankeesImage;
                    }
                    else if (gameOneObject.awayName == "Oakland Athletics") {
                        gameOneObject.awayLogo = athleticsImage;
                    }
                    // else if () {
                        //tigers id 12
                    // }
                    else {
                        gameOneObject.awayLogo = awayLogo;
                    }

                    if (gameOneObject.homeName == "New York Yankees") {
                        gameOneObject.homeLogo = yankeesImage;
                    }
                    else if (gameOneObject.homeName == "Oakland Athletics") {
                        gameOneObject.homeLogo = athleticsImage;
                    }
                    // else if () {

                    // }
                    else {
                        gameOneObject.homeLogo = homeLogo;
                    }

                    displayGameOne();
                    dayIndex++;
                    getGameTwo(_teamID, _season, dayArr[dayIndex]);
                }
            })
        })
    } 
    catch (error) {
        console.error(error);
    }
}

function displayGameOne() {
    var date = document.querySelector('#game-1-date');
    date.textContent = '(' + gameOneObject.date + ')';
    var time = document.querySelector('#game-1-time');
    time.textContent = gameOneObject.time;
    document.getElementById('game-1-away-logo').src= gameOneObject.awayLogo;
    var awayTeam = document.querySelector('#game-1-away-team');
    awayTeam.textContent = gameOneObject.awayName;
    document.getElementById('game-1-home-logo').src= gameOneObject.homeLogo;
    var homeTeam = document.querySelector('#game-1-home-team');
    homeTeam.textContent = gameOneObject.homeName;
}

function getGameTwo(_teamID, _season, _date) {
    var url =  startPoint + '/games?team=' + _teamID + '&season=' + _season + '&date=' + _date;

    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {
                if (data.response.length === 0) {
                    dayIndex++;
                    getGameTwo(25, season, dayArr[dayIndex]);
                }
                else {
                    var time  = data.response[0].time;
                    var splitTime = time.split(':');
                    var hour = splitTime[0];
                    var minute = splitTime[1];
                    hour = hour - 7;
                    var suffix = hour <= 12 ? 'AM':'PM';
                    hour = (hour % 12) || 12;
                    gameTwoObject.time = hour + ":" + minute + ' ' + suffix;
                    var date = data.response[0].date;
                    var splitDate = date.split('T');
                    gameTwoObject.date = splitDate[0];
                    gameTwoObject.awayName = data.response[0].teams.away.name;
                    gameTwoObject.homeName = data.response[0].teams.home.name;
                    awayLogo = data.response[0].teams.away.logo;
                    homeLogo = data.response[0].teams.home.logo;

                    if (gameTwoObject.awayName == "New York Yankees") {
                        gameTwoObject.awayLogo = yankeesImage;
                    }
                    else if (gameTwoObject.awayName == "Oakland Athletics") {
                        gameTwoObject.awayLogo = athleticsImage;
                    }
                    else {
                        gameTwoObject.awayLogo = awayLogo;
                    }

                    if (gameTwoObject.homeName == "New York Yankees") {
                        gameTwoObject.homeLogo = yankeesImage;
                    }
                    else if (gameTwoObject.homeName == "Oakland Athletics") {
                        gameTwoObject.homeLogo = athleticsImage;
                    }
                    else {
                        gameTwoObject.homeLogo = homeLogo;
                    }

                    displayGameTwo();
                    dayIndex++;
                    getGameThree(_teamID, _season, dayArr[dayIndex]);
                }
            })
        })
    } 
    catch (error) {
        console.error(error);
    }
}

function displayGameTwo() {
    var date = document.querySelector('#game-2-date');
    date.textContent = '(' + gameTwoObject.date + ')';
    var time = document.querySelector('#game-2-time');
    time.textContent = gameTwoObject.time;
    document.getElementById('game-2-away-logo').src= gameTwoObject.awayLogo;
    var awayTeam = document.querySelector('#game-2-away-team');
    awayTeam.textContent = gameTwoObject.awayName;
    document.getElementById('game-2-home-logo').src= gameTwoObject.homeLogo;
    var homeTeam = document.querySelector('#game-2-home-team');
    homeTeam.textContent = gameTwoObject.homeName;
}

function getGameThree(_teamID, _season, _date) {
    var url =  startPoint + '/games?team=' + _teamID + '&season=' + _season + '&date=' + _date;

    var options = {
	    method: 'GET',
	    headers: {
		    'content-type': 'application/octet-stream',
		    'X-RapidAPI-Key': 'b321e401e5msh1daad72711c493dp1e4557jsn35e8c3bfc80a',
		    'X-RapidAPI-Host': 'api-baseball.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options).then(function (response) {
            response.json().then(function (data) {
                if (data.response.length === 0) {
                    dayIndex++;
                    getGameThree(_teamID, _season, dayArr[dayIndex]);
                }
                else {
                    var time  = data.response[0].time;
                    var splitTime = time.split(':');
                    var hour = splitTime[0];
                    var minute = splitTime[1];
                    hour = hour - 7;
                    var suffix = hour <= 12 ? 'AM':'PM';
                    hour = (hour % 12) || 12;
                    gameThreeObject.time = hour + ":" + minute + ' ' + suffix;
                    var date = data.response[0].date;
                    var splitDate = date.split('T');
                    gameThreeObject.date = splitDate[0];
                    var away = data.response[0].teams.away.logo;
                    var home = data.response[0].teams.home.logo;
                    gameThreeObject.awayName = data.response[0].teams.away.name;
                    gameThreeObject.homeName = data.response[0].teams.home.name;

                    if (gameThreeObject.awayName == "New York Yankees") {
                        var away = yankeesImage;
                        gameThreeObject.awayLogo = away;
                    }
                    else if (gameThreeObject.awayName == "Oakland Athletics") {
                        gameThreeObject.awayLogo = athleticsImage;
                    }
                    else {
                        gameThreeObject.awayLogo = awayLogo;
                    }

                    if (gameThreeObject.homeName == "New York Yankees") {
                        var home = yankeesImage;
                        gameThreeObject.homeLogo = home;
                    }
                    else if (gameThreeObject.homeName == "Oakland Athletics") {
                        gameThreeObject.homeLogo = athleticsImage;
                    }
                    else {
                        gameThreeObject.homeLogo = homeLogo;
                    }

                    displayGameThree();
                }
            })
        })
    } 
    catch (error) {
        console.error(error);
    }
}

function displayGameThree() {
    var date = document.querySelector('#game-3-date');
    date.textContent = '(' + gameThreeObject.date + ')';
    var time = document.querySelector('#game-3-time');
    time.textContent = gameThreeObject.time;
    document.getElementById('game-3-away-logo').src= gameThreeObject.awayLogo;
    var awayTeam = document.querySelector('#game-3-away-team');
    awayTeam.textContent = gameThreeObject.awayName;
    document.getElementById('game-3-home-logo').src= gameThreeObject.homeLogo;
    var homeTeam = document.querySelector('#game-3-home-team');
    homeTeam.textContent = gameThreeObject.homeName;
}

function storeLocalFav(_teamID, _season, _teamName) {
    var favTeam = {
        teamID : _teamID,
        season : _season,
        teamName: _teamName,
    }
    var buonosFavStored = JSON.parse(localStorage.getItem("buonosFav"));
    console.log(buonosFavStored);
    if (buonosFavStored === null) {
        arrayOfFavTeams = [];
        arrayOfFavTeams.push(favTeam);
        console.log(arrayOfFavTeams);
        localStorage.setItem("buonosFav", JSON.stringify(arrayOfFavTeams));
    }else{
        for (var i = 0; i < buonosFavStored.length; i++) {
            console.log('Team form storage:',buonosFavStored[i].teamName);
            console.log('Team entered: ', favTeam.teamName);
            console.log(buonosFavStored[i].teamName == favTeam.teamName)
            if (buonosFavStored[i].teamName === favTeam.teamName) {
            console.log('Team is already a fav? TRUE');
            console.log('Team will not stored, as it already exist')
            return;
            } 
        }
        console.log('Team is already a fav? FALSE');
        var currentBuonosFavStored = JSON.parse(localStorage.getItem("buonosFav"));
        currentBuonosFavStored.push(favTeam);
        localStorage.setItem("buonosFav", JSON.stringify(currentBuonosFavStored));
        

    }

    renderFav();
}
function renderFav(){
    var buonosFavStored = JSON.parse(localStorage.getItem("buonosFav"));
    dropDownFavs.options.length = 0;

    for (let i = buonosFavStored.length -1 ; i >=0; i--) {
        console.log(i);
        var optionFav = document.createElement("option");
        optionFav.text=buonosFavStored[i].teamName;
        dropDownFavs.add(optionFav);

        }
    console.log(dropDownFavs.options[1]);
    dropDownFavs.addEventListener("change", function(){
        console.log('dropdown clicked', this.value);
        for (let i = 0; i < buonosFavStored.length; i++) {
            if(buonosFavStored[i].teamName === this.value) {
                start(buonosFavStored[i].teamID, buonosFavStored[i].season);
            }   
        }
        
    })

}


// Initial page loading starts with the Yankees team
start('25',2023);
renderFav();

