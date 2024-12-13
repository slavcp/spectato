const baseStyles = `.menuItem[onclick*="showWindow(5)"],
  .menuItem[onclick*="showWindow(14)"],
  .menuItem[onclick*="windows[32].openHome()"],
  .menuItem[onclick*="window.open(\\"/social.html\\",\\"_blank\\")"],
  .material-icons[style="color:#fff;font-size:40px;vertical-align:middle;margin-bottom:12px"]
  .compMenBtnS[onclick*="showWindow(3)"],
  .settingsBtn[onclick="openOneTrust()"],
  .bigMenTab[onclick*="openURL(\`./editor.html\`)"],
  .bigMenTab[onclick*="openURL(\`./?sandbox\`)"],
  .instructionsTab[onclick*="showWindow(2)"],
  .instructionsTab[onclick*="showWindow(35)"],
  a[href="./viewer.html"],
  #inviteButton,
  #cmpSpectBtn,
  #compClassPHolder,
  #settingsPreset,
  .verticalSeparator,
  #menuKRCount,
  .junkInfo,
  .menuLink,
  #inviteButton,
  #mailContainer,
  #chatHolder,
  #mLevelCont,
  .progressBar,
  #menuBtnBrowser,
  #policeButton,
  #specControlHolder,
  .setSugBox2,
  .advancedSwitch,
  #headerRight,
  #menuClassContainer,
  .compSwpTmB,
  #spectButton,
  #instructions:only-child,
  #tlInfHold,
  #mapInfoHld,
  #specNames,
  #mapInfoHolder,
  #gameNameHolder,
  #seasonLabel,
  #phonePop,
  #aHider,
  #endAContainer,
  #endAHolder,
  canvas,
  #streamContainer,
  #topRightAdHolder {
      display: none !important;
  }

    #menuItemContainer {
    top: inherit!important;
    bottom: 0!important;
    height: 220px!important;
    width: 100%!important;
    flex-direction: row!important;
    }

    #subLogoButtons {
    position: absolute!important;
    bottom: 50%!important;
    left: 50%!important;
    transform: translate(-50%, 0) scale(1.3)!important;
    }

    #clientExit {
    display: flex!important;
    } 

    #compPlListL, #compPlListR {
    top: 47%!important;
    }

    #compTScrsB {
    top: -15px!important;
    }

  .player-info {
    margin-bottom: 2px;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 1);
    color: white;
    display: flex;
    flex-direction: row;
    padding: 10px;
    background-color: #00000044;
    backdrop-filter: blur(5px);
    transition: padding 0.3s ease-in-out;
  }

  .player-number {
    position: absolute;
    top: 5px;
    color: white;
    font-size: 8px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border: 2px solid white;
    border-radius: 50%;
  }

  .player-details {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .player-left {
    text-align: center;
    width: 50px;
    display: flex;
  }

  .player-image {
    width: 50px;
    height: 50px;
  }

  .player-score {
    font-size: 14px;
    color: #333;
  }

  .player-center {
    margin-top: 5px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .player-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: none;
  }

  .weapon-icon {
    margin-bottom: 13px;
    height: 28px;
    width: 58px;
    flex: none;
  }

  .player-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .player-stats {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: -5px;
  }

  .player-ping {
    font-size: 10px;
    position: absolute;
  }

  #team1Players {
    z-index: 99999;
    position: absolute;
    bottom: 200px;
    left: 0;
    max-width: 400px;
  }
    
  #team2Players {
    z-index: 99999;
    position: absolute;
    bottom: 200px;
    right: 0;
    max-width: 400px;
  }

.focusedP {
  border: 3px solid white;
}

#killTotal {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  margin-right: 10px;
  margin-top: 10px;
  width: auto;
  height: 66px;
  z-index: 99999;
  background-color: #00000044;
  padding: 15px;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  }

#teamChanges {
  position: absolute;
  top: 120px;
  right: 0;
  margin-right: 10px;
  z-index: 99999;
  display: flex;
  gap: 10px;
  backdrop-filter: blur(5px);
}

.dead {
  backdrop-filter: grayscale(100%) blur(5px);
}
  
.focused {
    padding: 20px;  
    transition: all 0.3s ease-in-out;
}

#centerHolder {
  position: absolute;
  bottom: 200px;
  right: calc(50% - 250px);
  width: 500px;
  z-index: 99999;
  display: none;
  background-color: #00000044;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

#killFeed {
  margin-top: 200px;
}
`;

const blockedURLs = [
  "*://*.pollfish.com/*",
  "*://www.paypalobjects.com/*",
  "*://fran-cdn.frvr.com/prebid*",
  "*://fran-cdn.frvr.com/gpt_*",
  "*://c.amazon-adsystem.com/*",
  "*://fran-cdn.frvr.com/pubads_*",
  "*://platform.twitter.com/*",
  "*://cookiepro.com/*",
  "*://*.cookiepro.com/*",
  "*://www.googletagmanager.com/*",
  "*://krunker.io/libs/frvr-channel-web*",
  "*://apis.google.com/js/platform.js",
  "*://imasdk.googleapis.com/*",
  "*://cdn.ravenjs.com/*",
  "*://*.poll.fish/*",
  "*://fran-cdn.frvr.com/*",
  "*://www.paypal.com/*",
  "*://*.twitter.com/*",
  "*://www.youtube.com/*",
  "*://*.doubleclick.net/*",
  "*://*.google.com/*",
  "*://unpkg.com/*",
  "*://krunker.io/css/bundled/bundledStyles*",
  "*://*.googlesyndication.com/*",
  "*://config.aps.amazon-adsystem.com/*",
  "*://*.google.com/*",
  "*://securepubads.g.doubleclick.net/*",
  "*://krunker.io/css/flag.css*",
  "*://krunker.io/libs/chart.bundle*",
  "*://assets.krunker.io/sound/ambient_*",
  "*://assets.krunker.io/sound/select_0.mp3*",
  "*://assets.krunker.io/sound/hover_0.mp3*",
  "*://assets.krunker.io/textures/reticles/reticle_0.png*",
  "*://assets.krunker.io/textures/scopes/scope_0.png*",
  "*://assets.krunker.io/models/attach/attach_0.obj*",
  "*://krunker.io/service-worker.js*",
  "*://krunker.io/libs/purejscarousel*",
];

function mapWaypoints(map) {
switch (map) {
  case "Sandstorm":
    return [
    [-30.1, 83.8, -126.7, -2.5], // ramp 1st site 
    [-2.8, 118.2, 125, -0], // 1st site back
    [225.9, 80.7, -84.3, -5.4], // mid
    [-194.7, 84.1, -326.4, -8.6], // 2nd site
    [282.1, 81.5, 127.4, -11.9], //  3rd site
    [-222.5, 97.4, 123.5, -1],  // 4th site
  ]
  case "Undergrowth":
    return [
    [-175.9, 103.1, 28.7, -2.3], // inside point 1st site
    [-257.7, 112, 114.5, -1.1], // outside point 1st site
    [77.4, 125.1, 48.6, -5.3], // mid
    [-259.3, 131.7, -193.6, -2.2], // 2nd site
    [291.2, 107.9, 255.4, -5.6], // 3rd site
    [171.1, 105.8, 248, -0.7], // 3rd site outside
    [233.4, 103, -308, -3.9], // 4th site
    [235, 118.9, -135.8, -5.7], // 4th site outside
  ]
  case "Bureau":
    return [
      [-327.8, 68.3, 267.8, -1], // first site
      [200.3, 63.6, 370.2, 0.8], // 2nd site
      [-121.5, 47.9, -38.7, -2.3], // mid
      [217.6, 49.6, 81.3, -4.1], // car
      [-70.8, 56.3, 301.6, -7.2], // mid 2nd site
      [-161.4, 50.4, -79.1, 1.3], // 3rd site outside
      [-348.2, 50, -73.5, -0.8], // 3rd site
      [42.6, 45.8, -210.1, -3], // 4th site
    ];
  case "Site":
    return [
      [-33.7, 86.3, 68.2, 0.7],  // 1st site
      [-214.9, 93.1, 61.5, -1.1], // outside 1st site
      [138.4, 78.3, 252.8, -1],   // 2nd site
      [29.4, 41.5, -244.5, 2.4],  // under
      [222.7, 65.3, -80.6, -3.8], // center of map
      [133.7, 63.7, -141.8, -0.6], // 4th site inside
      [231.6, 57.4, -333.1, 2.4], // 4th site outside
    ];
  case "Lumber":
    return [
    [-34.6, 85.3, 40.1, -0.9], // first site
    [269.4, 80, 344.1, 6.8], // 2nd site
    [-74.3, 69.5, 244.3, 5.5], // 2nd site long
    [-277.6, 78.9, 261.5, 5.6], // 3rd site
    [-256, 71.1, -360.5, 3.8], // 4th site
    [-262.9, 90.9, -157, 5.1], // 4th site outside
  ]
  case "Industry":
    return [
      [296.3, 56.1, -380.9, 2.3], // 1st site
      [-173.5, 65.9, 57.5, 5.4], // 2nd site
      [287.3, 49.9, 162.9, 0.7], // 3rd site
      [296.2, 57, -181.1, -4], // mid 
      [20.7, 58.6, -175.4, 3.9], // mid again
      [-207.1, 74.1, -343.3, 3.8], // 4th site
    ]
  case "Shipment":
    return [
      [104.2, 68.3, -55.5, -2.3],
      [29.1, 65.4, 54.3, -0.8],
      [-158.7, 57, 207.7, -0.6], // 2nd site
      [454.1, 52.6, -315.7, 2.2], // 3rd site
      [321.5, 79.6, -322.4, 3.5], // 3rd site
      [-152.7, 59.8, -329.8, -2.2], // 4th site
    ]
  }
}

function krClassToNum(krClass) {
  switch (krClass) {
    case "Triggerman":
      return 0;
    case "Hunter":
      return 1;
    case "Run N Gun":
      return 2;
    case "Spray N Pray":
      return 3;
    case "Vince":
      return 4;
    case "Detective":
      return 5;
    case "Marksman":
      return 6;
    case "Rocketeer":
      return 7;
    case "Agent":
      return 8;
    case "Runner":
      return 9;
    case "Bowman":
      return 10;
    case "Commando":
      return 12;
    case "Trooper":
      return 13;
    case "Infiltrator":
      return 15;
  }
}

function generateHtml(options) {
  switch (options.type) {
    case "checkbox":
      return `<label class='switch'>
                <input type='checkbox'
                      onclick='saveCSetting("${options.id}", this.checked)'
                      ${options.value ? "checked" : ""}>
                <span class='slider'></span>
              </label>`;
    case "color":
      return `<input type='color' style="float:right;margin-top:5px;" 
                    value='${options.value}'
                    onchange='saveCSetting("${options.id}", this.value)'/>`;
  }
}

const flags = [{ name: "disable-frame-rate-limit" }];

const cSettings = {
  team0Color: {
    name: "Team 1 Color",
    id: "team1Color",
    type: "color",
    value: "#5799ec",
    category: "spectato",
    needsRestart: false,
  },
  team1Color: {
    name: "Team 2 Color",
    id: "team2Color",
    type: "color",
    value: "#eb9a56",
    category: "spectato",
    needsRestart: false,
  },
};

module.exports = { blockedURLs, flags, baseStyles, mapWaypoints, krClassToNum, generateHtml, cSettings };
