const {ipcRenderer} = require("electron");
const electron = require('electron').remote;
const PropertiesReader = require('properties-reader');
const path = require('path');
const proFilePath = path.join(__static,'config.properties');
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

// Unsplash.js
const Unsplash = require("unsplash-js").default;
const unsplash = new Unsplash({
    applicationId: "a37610fe0232b739c6cbabb7389a77ef10de6d31f5c07a4c99ffc0d8b3af31b4",
    secret: "b9d0e32cfb7b6d9b20def01b5edf320f008ffcb98a20c7240da780dfc5c6e82c",
});

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
    unsplash,
    request,
    wallpaper,
    fs,
    jmMkdir,
    properties,
    ipcRenderer,
    electron
};
