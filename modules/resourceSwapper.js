const fs = require("fs");
const path = require("path");

class resourceSwap {
  constructor(browserWindow, swapDir) {
    this.urls = [];
    this.browserWindow = browserWindow;
    this.swapDir = swapDir;
  }
  start() {
    this.recursiveSwap("");

// if URLs are available
  if (this.urls.length) {
    this.browserWindow.webContents.session.webRequest.onBeforeRequest({ urls: this.urls },(details, callback) => {
        const pathName = new URL(details.url).pathname;
        const localPath = path.join(this.swapDir, pathName);
        callback({ redirectURL: `krunker-resource-swapper:/${localPath}` });
      }
    );
  }
  }

  recursiveSwap(prefix) {
    for (const dirent of fs.readdirSync(path.join(this.swapDir, prefix), {withFileTypes: true})) {
      const name = `${prefix}/${dirent.name}`;
      if (dirent.isDirectory()) {
        this.recursiveSwap(name);
    }
    else {
        const tests = [
            `*://*.krunker.io${name}`,
            `*://*.krunker.io${name}?*`
        ];
        this.urls.push(...tests)}
}}}

module.exports = resourceSwap;
