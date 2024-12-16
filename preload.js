const { webFrame, ipcRenderer } = require("electron");
const { cSettings, baseStyles, generateHtml } = require("./constants.js");
const { setupSpec } = require("./modules/spec.js");
require("./modules/notifications.js");
window.closeClient = () => ipcRenderer.send("close");
window.OffCliV = true;

const config = {
  get: (key) => ipcRenderer.invoke("settingsGet", key),
  getSync: (key) => ipcRenderer.sendSync("settingsGetSync", key),
  set: (key, value) => ipcRenderer.invoke("settingsSet", key, value),
};

webFrame.insertCSS(baseStyles);

function isGameLoaded() {
  if (window.gameLoaded) {
    const settingsWindow = window.windows[0];
    if (!localStorage.getItem("first")) {
      localStorage.setItem("first", "true");
      window.expertMode();
      settingsWindow.toggleType({ checked: true }); //  sets settings to advanced
      window.selectScope(-1); // no scope
      window.selectReticle(-1); // no reticle
      window.selectAttachment(-1); // unequip sight;
      window.closWind();
    }

    function searchMatches(setting) {
      let query = settingsWindow.settingSearch.toLowerCase() || "";
      return (
        (setting.name.toLowerCase() || "").includes(query) ||
        (setting.category.toLowerCase() || "").includes(query)
      );
    }

    window.saveCSetting = (id, value) => {
      ipcRenderer.invoke("settingsSet", id, value);
    };
    let origGetSettings = settingsWindow.getSettings;
    settingsWindow.getSettings = (...args) =>
      origGetSettings.call(settingsWindow, ...args).replace(/^<\/div>/, "") +
      settingsWindow.getCSettings();

    settingsWindow.getCSettings = () => {
      if (settingsWindow.tabs.advanced.length !== settingsWindow.tabIndex + 1 && !settingsWindow.settingSearch )
        return "";
      let tempHTML = "";
      let previousCategory = null;
      Object.keys(cSettings).forEach((entry) => {
        const setting = cSettings[entry];
        setting.value = config.getSync(setting.id);
        setting.html = generateHtml(setting);
        if (settingsWindow.settingSearch && !searchMatches(setting)) return;
        if (previousCategory !== setting.category) {
          if (previousCategory) {
            tempHTML += "</div>";
          } else {
            // hey man sure...
            setTimeout(() => {
              document.querySelector("#settHolder").removeChild(document.querySelector("#settHolder").firstElementChild);
            }, 1);
          }
          previousCategory = setting.category;
          tempHTML += `<div class='setHed' id='setHed_spectato' onclick='window.windows[0].collapseFolder(this)'><span class='material-icons plusOrMinus'>keyboard_arrow_down</span>${setting.category}</div>
        <div class='setBodH' id='setBod_spectato'>`;
        }
        tempHTML += `<div class='settName' ${setting.needsRestart ? ' title="Requires Restart"' : ""}>${setting.name}${setting.needsRestart ? ' <span style="color: #eb5656">*</span>' : ""} ${setting.html}</div>`;
      });
      return tempHTML ? tempHTML + "</div></div>" : "";
    };
    document.querySelector("#signedInHeaderBar").onclick = (event) => {
      event.preventDefault();
      window.logoutAcc();
      window.closWind();
    };
    document.querySelector("#menuBtnHost").onclick = (event) => {
      event.preventDefault();
      window.openHostWindow(false, 1);
    };
  } else {
    setTimeout(isGameLoaded, 100);
  }
}

isGameLoaded();

ipcRenderer.on("game-updated", () => {
  // this is something... couldn't figure out how to use setSetting for controls
  window.windows[6].switchTab(3);
  changeCont("specFree", 1, undefined);
  document.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 222, bubbles: true }));
  document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 222, bubbles: true }));
  closWind();

  let gameStatus = window.getGameActivity();

  if ((gameStatus.custom && gameStatus.mode === "Hardpoint")) {
    window.toggleSpect();
    const team1Color = config.getSync("team1Color");
    const team2Color = config.getSync("team2Color");
    webFrame.insertCSS(`
  .team1Color {
    background-color: ${team1Color}!important;

}
    .team2Color {
    background-color: ${team2Color}!important;
    } 

    .team1Colorb {
        color: ${team1Color}!important;
    }

    .team2Colorb {
       color: ${team2Color}!important;
    }
       
    canvas {
    display: block!important;
    }`);
    setupSpec();
  }
});

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Escape":
      document.exitPointerLock();
      break;
    case "F5":
      event.preventDefault();
      window.location.reload();
      break;
    case "F6":
      event.preventDefault();
      window.location.replace("https://krunker.io");
      break;
  }
});
