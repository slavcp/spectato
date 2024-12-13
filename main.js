const { session, app, BrowserWindow, protocol, ipcMain } = require("electron");
const Store = require("electron-store");
const path = require("path");
const fs = require('fs');
const { flags, blockedURLs } = require("./constants.js");
const config = new Store({
  defaults: {
    team1Color: "#5799ec",
    team2Color: "#eb9a56",
  }
});

const resourceSwap = require("./modules/resourceSwapper.js");
const swapperPath = path.join(app.getPath("documents"), "spectato/swapper");

if (!fs.existsSync(swapperPath)) {
  fs.mkdirSync(swapperPath, { recursive: true });
};

flags.forEach((flag) => {
  if (flag.value) {
    app.commandLine.appendSwitch(flag.name, flag.value);
  } else {
    app.commandLine.appendSwitch(flag.name);
  }
});

// make sure only one instance is running
!app.requestSingleInstanceLock() && app.exit();

app.once("ready", () => {
  protocol.registerFileProtocol("krunker-resource-swapper", (request, callback) => {
    callback(decodeURI(request.url.replace(/krunker-resource-swapper:/, "")));
  });

  let mainWindow = new BrowserWindow({
    backgroundColor: "#000000",
    width: 1280,
    height: 720,
    title: "spectato",
    fullscreen: true,
    webPreferences: {
      v8CacheOptions: "bypassHeatCheckAndEagerCompile",
      spellcheck: false,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    },
  });
  mainWindow.loadURL("https://krunker.io");
  mainWindow.setMenuBarVisibility(false);

  // useful for obs window/game capture
  mainWindow.on("page-title-updated", function (event) {
    event.preventDefault();
  });

  ipcMain.handle("settingsGet", async (event, key) => {
    return config.get(key);
  });

  ipcMain.handle("settingsSet", async (event, key, value) => {
    config.set(key, value);
  });

  ipcMain.on('settingsGetSync', (event, arg) => {
    event.returnValue = config.get(arg);
  });

  mainWindow.once("ready-to-show", () => {
    const { autoUpdater } = require("electron-updater");
    autoUpdater.checkForUpdates();
    autoUpdater.once("update-downloaded", () => {
      mainWindow.webContents.send("notification", "Update found, Install?", 1);
      ipcMain.once("notificationResponse", (event, response) => {
        if (response) autoUpdater.quitAndInstall();
      });
    
  })
})


  session.defaultSession.webRequest.onBeforeSendHeaders({ urls: blockedURLs }, (details, callback) => { callback({ cancel: true }) });
  session.defaultSession.webRequest.onCompleted({ urls: ['*://matchmaker.krunker.io/game-info?game=*'] }, (details, callback) => {
    mainWindow.webContents.send("game-updated")
  })


  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
  });

  const scSwapInstance = new resourceSwap(mainWindow, swapperPath);
  scSwapInstance.start();
});

ipcMain.once("close", () => { app.exit(); });

app.once("window-all-closed", () => {
  app.exit();
});
