const { mapWaypoints } = require("../constants.js")
const players = {};
const availableHolders = { team1: [], team2: [] };
let team1Kills = 0, team2Kills = 0, team1Change = 0, team2Change = 0;
let specCamera;
let specCamera2;
const killTotal = document.createElement("div");
const teamChanges = document.createElement("div");
const centerHolder = document.createElement("div");
const parser = new DOMParser();

//const strippedConsole = {
//  log: console.log.bind(console),
//};

// ultra secret never seen before first time threejs feature
// i read a lot of source to find this one, as of writing i am unsure if it is detected 
window.__THREE_DEVTOOLS__ = new EventTarget()
__THREE_DEVTOOLS__.addEventListener("observe", (scene) => {
  if (scene?.detail?.type === "Scene") {
    (function checkScene() {
      if (!scene.detail.name) {
        setTimeout(checkScene, 100);
        return;
      }
      if (scene.detail.name === "Main") {
        scene.detail.fog = null;
        specCamera = scene.detail.children.find(child =>
          child.type === "Object3D" && child.children.some(
            grandchild => grandchild.children.some(
              greatGrandChild => greatGrandChild.type === "PerspectiveCamera"
            )
          )
        );
        specCamera2 = specCamera.children[0]
      }
    })()
}
})

class Player {
  constructor(id, name, team) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.gameNumber = undefined;
    this.dead = false;
    this.score = 0;
    this.obj = 0;
    this.kills = 0;
    this.ping = undefined;
    this.deaths = 0;
    this.streak = 0;
    this.onPoint = false;
    this.holder = null;
    this.timeout = null;
    this.assignedNumber = null;
    this.focused = false;
    this.killedBy = {};
  }

  assignHolder() {
    if (!this.team) return;
    const team = this.team === 1 ? "team1" : "team2";
    const holderPool = availableHolders[team];
    if (holderPool.length > 0) {
      this.holder = holderPool.shift();
      this.holder.querySelector(".player-name").textContent = this.name;
      this.assignedNumber = parseInt(this.holder.id.replace("sidePlayer", ""));
    }
  }

  releaseHolder() {
    if (!this.holder) return;
    const team = this.team === 1 ? "team1" : "team2";
    this.holder.querySelector(".player-name").textContent = "---------";
    this.holder.querySelector(".kills").textContent = "Kills: ?";
    this.holder.querySelector(".deaths").textContent = "Deaths: ?";
    this.holder.querySelector(".obj").textContent = "Obj: ?";
    this.holder.querySelector(".player-ping").textContent = "?ms";
    this.holder.querySelector(".player-ping").style.color = "gray";
    availableHolders[team].push(this.holder);

    delete players[this.id];
  }

  updateDisplayedStats() {
    if (!this.holder) return;
    this.holder.classList.toggle("dead", this.dead);
    this.holder.querySelector(".player-name").textContent = this.name;
    this.holder.querySelector(".player-image").src = this.currentClass;
    this.holder.querySelector(".kills").textContent = `Kills: ${this.kills}`;
    const pingElement = this.holder.querySelector(".player-ping");
    pingElement.textContent = `${this.ping}`;
    pingElement.style.color = parseInt(this.ping) < 50 ? "green" : parseInt(this.ping) < 100 ? "orange" : "red";
    this.holder.querySelector(".deaths").textContent = `Deaths: ${this.deaths}`;
    this.holder.querySelector(".obj").textContent = `Obj: ${this.obj}`;
  }
}

function createSideHolders(teamPlayerCount) {
  const team1Players = document.createElement("div");
  const team2Players = document.createElement("div");
  team1Players.id = "team1Players";
  team2Players.id = "team2Players";

  document.querySelector("#inGameUI").append(team1Players, team2Players);

  for (let i = 1; i <= teamPlayerCount * 2; i++) {
    const playerHolder = document.createElement("div");
    playerHolder.classList.add("player-info");
    playerHolder.id = `sidePlayer${i}`;
    playerHolder.innerHTML = `
      <div class="player-number ${i <= teamPlayerCount ? "team1Color" : "team2Color"}" 
      style="${i <= teamPlayerCount ? "top: 5px; left: 0;" : "top: 5px; right: 0"}">${i}</div>
      <div class="player-details" style="${i <= teamPlayerCount ? "padding-right: 20px;" : "padding-left: 20px;"}">
        ${i <= teamPlayerCount ?
        `<div class="player-left">
          <img src="https://assets.krunker.io/textures/classes/icon_${i}.png" style="image-rendering: pixelated;" class="player-image">
          <div class="player-ping" style="bottom: 0; left: 0; color: gray">?ms</div>
        </div>
        <div class="player-center" style="margin-left: 10px; align-items: flex-start;">
          <div class="player-name" style="color:white">---------</div>
          <div class="player-stats">
            <span class="kills" style="color: red; margin-right: 5px;">Kills: ?</span>
            <span class="deaths" style="color: purple; margin-right: 5px;">Deaths: ?</span>
            <span class="obj" style="color: yellow; margin-right: 5px;">Obj: ?</span>
          </div>    
        </div> 
        `:`
        <div class="player-center" style="margin-right: 10px; align-items: flex-end;">
          <div class="player-name" style="color: white">---------</div>
          <div class="player-stats">
            <span class="kills" style="color: red; margin-right: 5px;">Kills: ?</span>
            <span class="deaths" style="color: purple; margin-right: 5px;">Deaths: ?</span>
            <span class="obj" style="color: yellow; margin-right: 5px;">Obj: ?</span>
          </div>
        </div>
        <div class="player-left">
          <img src="https://assets.krunker.io/textures/classes/icon_${i}.png" style="image-rendering: pixelated;" class="player-image">
          <div class="player-ping" style="bottom: 0; right: 0; color: gray">?ms</div>
        </div>`
      }
      </div>
      `;
    const team = i <= teamPlayerCount ? "team1" : "team2";
    availableHolders[team].push(playerHolder);
    if (team === "team1") {
      team1Players.appendChild(playerHolder);
    } else {
      team2Players.appendChild(playerHolder);
    }
  }
}

function updatePlayerList() {
  const htmlString = window.windows[22].genList();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = doc.querySelectorAll('.pListTable tbody tr');
  const rowPlayers = {};
  rows.forEach(row => {
    const playerName = row.querySelector('.pListName a').firstChild.textContent.trim();
    const playerPing = row.querySelector('.pListPing').getAttribute('title');
    const playerId = row.querySelector(".pListName a").getAttribute("oncontextmenu").match(/\"(.*)\"/)[1];
    rowPlayers[playerId] = true;
    if (!players.hasOwnProperty(playerId)) {
      players[playerId] = new Player(playerId, playerName);
    }

    players[playerId].ping = playerPing;
  });

  Object.keys(players).forEach(playerId => {
    if (!rowPlayers.hasOwnProperty(playerId)) {
      players[playerId].releaseHolder();
      delete players[playerId]
    }
  });
}

function processLbData() {
  const rows = document.querySelectorAll(".centerLeaderContainer table tbody tr");
  rows.forEach((row) => {
    const playerItem = row.querySelector(".newLeaderItem");
    if (!playerItem) return;
    const playerNameElem = playerItem.querySelector(".newLeaderName, .newLeaderNameF");
    const playerName = playerNameElem.firstChild.textContent;
    const currentPlayer = Object.values(players).find(player => player.name === playerName);
    if (!currentPlayer.team) currentPlayer.team = playerNameElem.classList.contains("newLeaderNameF") ? 1 : 2;

    const currentKillValue = parseInt(row.cells[3].textContent);
    const currentScoreValue = Math.round(parseFloat(row.cells[1].textContent.replace(/[k]/, '')) * (row.cells[1].textContent.match(/[k]/) ? 1000 : 1));
    const currentObjValue = Math.round(parseFloat(row.cells[2].textContent.replace(/[k]/, '')) * (row.cells[2].textContent.match(/[k]/) ? 1000 : 1));

    if (currentKillValue > currentPlayer.kills) currentPlayer.streak++;

    if (currentPlayer.team === 1) {
      team1Kills += currentKillValue;
    } else {
      team2Kills += currentKillValue;
    }

    if (currentObjValue > currentPlayer.obj) {
      currentPlayer.onPoint = true;
      currentPlayer.timeout && clearTimeout(currentPlayer.timeout);
      currentPlayer.timeout = setTimeout(() => {
        currentPlayer.timeout = null;
        currentPlayer.onPoint = false;
      }, 1600);
    }
    currentPlayer.kills = currentKillValue;
    currentPlayer.obj = currentObjValue;
    currentPlayer.score = currentScoreValue;
  });

}


function processPlayers() {
  const playerHolders = document.querySelectorAll("[class^='specPlayerHolder']");
  for (const playerHolder of playerHolders) {
    const icon = playerHolder.querySelector('.specPlayerIcon');
    const currentClass = icon.src;
    const name = playerHolder.querySelector('.specPlayerName').textContent;
    const player = Object.values(players).find(player => player.name === name);

    if (icon.classList.contains('silhouette') && !player.dead) {
      player.dead = true;
      player.deaths++;
      player.streak = 0;
    } else if (player.dead && !icon.classList.contains('silhouette')) player.dead = false;
    
    if (!player.gamenumber) player.gameNumber = parseInt(playerHolder.querySelector('.specNum').textContent);
    player.currentClass = currentClass;
  }
}

function changeFocusedPlayer() {
  // holy cow this could not be any worse
  let focusedPlayer
  setTimeout(() => {
    for (const currentPlayer of Object.values(players)) {
      currentPlayer.focused = false;
      currentPlayer.holder.classList.remove("focused");
      centerHolder.style.display = "none";
    }
    if (focusedPlayer) { 
       focusedPlayer.focused = true;
       centerHolder.style.display = "flex";
       focusedPlayer.holder.classList.add("focused"); } 
  }, 50);
  if (document.querySelector("#specStats").style.display.includes("none")) return
  focusedPlayer = Object.values(players).find(player => document.querySelector(".specPHead").firstChild.textContent === player.name);
  const teamColor = focusedPlayer?.team === 1 ? "team1Color" : "team2Color";
  document.querySelector("#spectHPBI").classList.remove("team1Color", "team2Color");
  document.querySelector("#spectHPBI").classList.add(teamColor);
}

function setupSpec() {
  function playerUpdate() {
    team1Kills = 0;
    team2Kills = 0;
    team1Change = 0;
    team2Change = 0;
    updatePlayerList()
    if (!Object.keys(players).length) return
    processPlayers();
    processLbData();
    const playerKeys = Object.keys(players);
    playerKeys.forEach((player) => {
      currentPlayer = players[player];
      if (currentPlayer.onPoint) {
        team1Change += currentPlayer.team === 1 ? 10 : 0;
        team2Change += currentPlayer.team === 2 ? 10 : 0;
      }

      if (currentPlayer.focused) {
        centerHolder.querySelector("#kills").lastChild.textContent = currentPlayer.kills;
        centerHolder.querySelector("#deaths").lastChild.textContent = currentPlayer.deaths;
        centerHolder.querySelector("#score").lastChild.textContent = currentPlayer.score;
        centerHolder.querySelector("#streak").lastChild.textContent = currentPlayer.streak;

        if (currentPlayer.dead) {
          const killFeedContainer = document.querySelector('#killFeed');
          const killFeedElements = [...killFeedContainer.querySelectorAll('.killfeedItem')].reverse()
          const extractName = (element) => {
            if (!element) return null;
            const clanTagElement = element.querySelector('span');
            // exclude clan tag 
            if (clanTagElement) return element.firstChild.textContent.replace(/\u200e|\u200f/g, '')

            // otherwise return the plain name
            return element.textContent.replace(/\u200e|\u200f/g, '')
          };

          killFeedElements.forEach((feedElement) => {
            const killfeedMsg = feedElement.querySelector('.killfeedMsg');
            if (!killfeedMsg) return;

            const killerElement = killfeedMsg.querySelector('span:nth-child(1)');
            const killedElement = killfeedMsg.querySelector('span:nth-of-type(2)');
            const killerPlayerName = extractName(killerElement);
            const killedPlayerName = extractName(killedElement);
            if (killedPlayerName === currentPlayer.name) {
              const killerPlayer = Object.values(players).find(player => killerPlayerName === player.name);
              spectatePlayer(killerPlayer.gameNumber);
              return;
            }
          });
        }
      }
      currentPlayer.holder || currentPlayer.assignHolder();
      currentPlayer.updateDisplayedStats();
    })

    teamChanges.querySelector("#team1Change").textContent = `+${team1Change}`;
    teamChanges.querySelector("#team2Change").textContent = `+${team2Change}`;
    killTotal.querySelector("#team1Kills").textContent = team1Kills;
    killTotal.querySelector("#team2Kills").textContent = team2Kills;
  }

  setInterval(playerUpdate, 50);

  teamChanges.id = "teamChanges";
  teamChanges.innerHTML = `
    <div id="team1Change" style="color: #fff; font-size: 14px; width: 50px; background-color: #00000044; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
" class="team1Colorb">+0</div>
    <div id="team2Change" style="color: #fff; font-size: 14px; width: 50px; background-color: #00000044; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
" class="team2Colorb">+0</div>
    `

  centerHolder.id = "centerHolder";
  centerHolder.innerHTML = `
    <div id="kills" style="color: red; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 24px;text-align: center; min-width: 25%;">
      <span style="color: red; font-size: 16px;">Kills</span> 0
    </div>
    <div id="deaths" style="color: purple; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 24px; text-align: center; min-width: 25%;">
      <span style="color: purple; font-size: 16px;">Deaths</span> 0
    </div>
    <div id="score" style="color: yellow; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 24px; text-align: center; min-width: 25%;">
      <span style="color: yellow; font-size: 16px;">Score</span> 0
    </div>
    <div id="streak" style="color: orange; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 24px;text-align: center; min-width: 25%;">
      <span style="color: orange; font-size: 16px;">Streak</span> 0
    </div>
    `

  killTotal.id = "killTotal";
  killTotal.innerHTML = `
    <div style="color: #fff; font-size: 14px; letter-spacing: 0.5px; margin-bottom: 5px;" class="title">TOTAL KILLS</div>
    <div style="display: flex; justify-content: center; align-items: center; gap: 20px;" class="scores">
        <div id="team1Kills" style="font-size: 24px; font-weight: bold; text-align: center; min-width: 30px;" class="team1Colorb">0</div>
        <div style="color: #fff; font-size: 24px; font-weight: bold; text-align: center;">VS</div>
        <div id="team2Kills" style="font-size: 24px; font-weight: bold; text-align: center; min-width: 30px;" class="team2Colorb">0</div>
    </div>
</div>
`
  document.querySelector("#inGameUI").append(killTotal, teamChanges, centerHolder);

  const teamPlayerCount = (document.querySelector("#compPlListL").childElementCount - 2);
  document.addEventListener("keydown", (event) => {
    const pressedNumber = parseInt(event.code.replace("Digit", ""));
    if (pressedNumber <= teamPlayerCount * 2 && !event.shiftKey) {
      event.stopPropagation();
      const pressedPlayer = Object.values(players).find(player => pressedNumber === player.assignedNumber);
      if (!pressedPlayer?.gameNumber) return
      spectatePlayer(pressedPlayer.gameNumber);

    } else if (event.shiftKey && !isNaN(pressedNumber)) {
      event.stopPropagation();
      document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 222, bubbles: true}));
      document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 222, bubbles: true}));
      // DOESNT WORK WITHOUT THE TIMEOUT???
      setTimeout(() => {
        specCamera.position.x = waypoints[pressedNumber - 1][0];
        specCamera.position.y = waypoints[pressedNumber - 1][1];
        specCamera.position.z = waypoints[pressedNumber - 1][2];
        specCamera2.rotation.x = waypoints[pressedNumber - 1][3];
        specCamera.rotation.y = waypoints[pressedNumber - 1][4];
      }, 1);
    } else if (event.key === "p") {
  //        strippedConsole.log( 
  //          Math.round(specCamera.position.x * 10) / 10,
  //          Math.round(specCamera.position.y * 10) / 10,
  //          Math.round(specCamera.position.z * 10) / 10,
  //          Math.round(specCamera2.rotation.x * 10) / 10,
  //          Math.round(specCamera.rotation.y * 10) / 10
  //        )
    }
  });

  const getGameActivity = window.getGameActivity()
  const waypoints = mapWaypoints(getGameActivity.map)
  const observer = new MutationObserver(() => changeFocusedPlayer());
  observer.observe(document.querySelector("#specStats"), { childList: true, subtree: true, attributeFilter: ["style"], characterData: true });
  createSideHolders(teamPlayerCount);
}

function spectatePlayer(gameNumber) {
  document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 48 + gameNumber, bubbles: true}));
  document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 48 + gameNumber, bubbles: true}));
}
module.exports = { setupSpec };
