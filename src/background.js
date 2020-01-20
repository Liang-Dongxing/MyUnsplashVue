'use strict';

import {app, protocol, BrowserWindow, ipcMain, Tray, Menu} from 'electron';
import path from 'path';
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production';

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;
let tray;

// 必须在应用程序准备好之前注册Scheme
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus();
            win.show();
        }
    });

    // Electron 会在初始化后并准备
    // 创建浏览器窗口时，调用这个函数。
    // 部分 API 在 ready 事件触发后才能使用。
    app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            // 安装Vue Devtools
            try {
                await installVueDevtools();
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString());
            }
        }
        createWindow();
        createTray();
        ipcMain.on('win-message', (event, arg) => {
            if (arg) {
                win.hide();
                event.returnValue = true;
            } else {
                event.returnValue = false;
            }
        });
    });
} else {
    app.quit();
}

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        title: 'MyUnsplash',
        width: 960,
        height: 540,
        resizable: false,// 禁止改变窗口大小
        frame: false,// 无边框
        transparent: false,
        icon: path.join(__static, 'icon.png'),
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // 如果处于开发模式，请加载开发服务器的URL
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
        win.setBounds({width: 1500});
    } else {
        createProtocol('app');
        // 不在开发中时加载index.html
        win.loadURL('app://./index.html');
    }

    win.on('closed', () => {
        win = null;
    })
}

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow();
    }
});


// 在开发模式下根据父进程的请求干净地退出。
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

function createTray() {
    tray = new Tray(path.join(__static, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {label: '退出', type: 'normal', role: 'quit'},
    ]);
    tray.setToolTip('MyUnsplash');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        win.show();
    })
}
