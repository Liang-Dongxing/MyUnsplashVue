const {ipcRenderer} = require("electron");
const electron = require('electron').remote;
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
let replaceImgHD = properties.get("replaceImgHD");
let LOCAL_SCREEN = {};
if (replaceImgHD) {
    LOCAL_SCREEN.width = 7680;
    LOCAL_SCREEN.height = 4320;
} else {
    LOCAL_SCREEN.width = electron.screen.getPrimaryDisplay().size.width;
    LOCAL_SCREEN.height = electron.screen.getPrimaryDisplay().size.height;
}
// App工具包
const request = require('request');
const fs = require('fs');
const wallpaper = require('wallpaper');
const jmMkdir = require('jm-mkdirs');

const unsplashUrl = new URL("https://source.unsplash.com");
export default {
    MAIN_WINDOW: {
        width: 960,
        height: 540
    },
    LOCAL_SCREEN,
    IMG_PATH: "temp/images",
    IMG_NAME: "TranscodedWallpaper.jpg",
    SAVE_PATH: savePath,
    PRO_FILE_PATH: proFilePath,
    unsplashUrl,
    request,
    wallpaper,
    fs,
    jmMkdir,
    properties,
    ipcRenderer,
    electron
};
