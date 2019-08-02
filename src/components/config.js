const {ipcRenderer} = require("electron");
const electron = require('electron').remote;
const PropertiesReader = require('properties-reader');
const proFilePath = 'src/assets/config.properties';
const properties = PropertiesReader(proFilePath);
let savePath = properties.get("savePath");
if (savePath == null || savePath.length === 0) {
    savePath = require('path').join(require('os').homedir(), 'Desktop');
    properties.set("savePath", savePath);
    properties.save(proFilePath);
}
module.exports = {
    KEYS: {
        accessKey: 'a37610fe0232b739c6cbabb7389a77ef10de6d31f5c07a4c99ffc0d8b3af31b4',
        secretKey: 'b9d0e32cfb7b6d9b20def01b5edf320f008ffcb98a20c7240da780dfc5c6e82c'
    },
    MAIN_WINDOW: {
        width: 960,
        height: 540
    },
    LOCAL_SCREEN: {
        width: electron.screen.getPrimaryDisplay().size.width,
        height: electron.screen.getPrimaryDisplay().size.height,
    },
    IMG_PATH: "temp\\images",
    IMG_NAME: "TranscodedWallpaper.jpg",
    SAVE_PATH: savePath,
    ELECTRON: electron,
    IPC_RENDERER: ipcRenderer,
    IPC_MAIN: electron.ipcMain,
    PROPERTIES: properties,
    PRO_FILE_PATH: proFilePath,
};

