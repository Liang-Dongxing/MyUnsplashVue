const {ipcRenderer} = require("electron");
const {dialog, screen} = require('electron').remote;
const PropertiesReader = require('properties-reader');
const path = require('path');
const proFilePath = path.join(__static, 'config.properties');
const properties = PropertiesReader(proFilePath);
let savePath = properties.get("savePath");
if (savePath == null || savePath.length === 0) {
    savePath = require('path').join(require('os').homedir(), 'Desktop').replace(/\\/g, "/");
    properties.set("savePath", savePath);
    properties.save(proFilePath);
}
let localScreenWidth = properties.get("localScreenWidth");
let localScreenHeight = properties.get("localScreenHeight");
if ((localScreenWidth == null || localScreenWidth.length === 0) || (localScreenHeight == null || localScreenHeight.length === 0)) {
    localScreenWidth = screen.getPrimaryDisplay().size.width;
    localScreenHeight = screen.getPrimaryDisplay().size.height;
    properties.set("localScreenWidth", localScreenWidth);
    properties.set("localScreenHeight", localScreenHeight);
    properties.save(proFilePath);
}
// App工具包
const request = require('request');
const fs = require('fs');
const wallpaper = require('wallpaper');
const jmMkdir = require('jm-mkdirs');
const Base64 = require('js-base64').Base64;

// Unsplash.js
const Unsplash = require("unsplash-js").default;
const unsplash = new Unsplash({
    accessKey: Base64.decode("MWE5ZGVlZDMyNGNjZWQ0MzZlNTQwOGZjNTBjYTI5OTYzMGQ4OWRkMzg1NzBmNmRiNzY5YTYxMjI1MzRkMTk5YQ=="),
    secret: Base64.decode("NDAyOTlmOTg4ODQ1OTJlMmY5ZmQzZWEwYTdjNWE1MjE2MjY0ZTEyNzZiMzg0MzZhNzFlNzM0ZTJhNDQzMGEzMg=="),
});

export default {
    MAIN_WINDOW: {
        width: 960,
        height: 540
    },
    LOCAL_SCREEN: {
        width: localScreenWidth,
        height: localScreenHeight
    },
    IMG_PATH: "temp/images",
    IMG_NAME: "TranscodedWallpaper.jpg",
    SAVE_PATH: savePath,
    PRO_FILE_PATH: proFilePath,
    unsplash,
    request,
    wallpaper,
    fs,
    jmMkdir,
    properties,
    electron_ipcRenderer: ipcRenderer,
    electron_dialog: dialog
};
