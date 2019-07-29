const {KEYS, LOCAL_SCREEN, IMG_PATH, IMG_NAME, MAIN_WINDOW, ELECTRON, PROPERTIES, PRO_FILE_PATH, IPC_RENDERER} = require('./config');
let {SAVE_PATH} = require('./config');

// App工具包
const https = require('https');
const fs = require('fs');
const wallpaper = require('wallpaper');
const jmMkdir = require('jm-mkdirs');

// Unsplash.js
const Unsplash = require("unsplash-js").default;
const unsplash = new Unsplash({
    applicationId: KEYS.accessKey,
    secret: KEYS.secretKey,
});

/**
 * 更新壁纸方法
 */
let updateWallpaper = (vueObject) => {
    console.log("跟新壁纸");
    let promiseImgUrl = getRandomImgBackground();
    promiseImgUrl.then(vkey => {
        vueObject.us_src = vkey.url;
        vueObject.us_alt = vkey.alt;

        let imgPathUrl = new URL(vkey.url);
        imgPathUrl.searchParams.set("w", LOCAL_SCREEN.width);
        imgPathUrl.searchParams.set("h", LOCAL_SCREEN.height);
        downloadFile(imgPathUrl.href, IMG_PATH, IMG_NAME);
    });
};

/**
 * 同步获取图片url
 * @returns {Promise<*>}
 */
let getRandomImgBackground = async () => {
    let promiseImgUrl;
    await unsplash.photos.getRandomPhoto({
        width: MAIN_WINDOW.width,
        height: MAIN_WINDOW.height
    }).then(res => res.json()).then(json => {
        promiseImgUrl = {
            url: json.urls.custom,
            alt: json.alt_description,
        };
    });
    return promiseImgUrl;
};

/**
 * 根据id获取当前屏幕大小的图片
 * @param id
 */
let getWallpaper = (id) => {
    unsplash.photos.getPhoto(id, LOCAL_SCREEN.width, LOCAL_SCREEN.height).then(res => res.json()).then(json => {
        downloadFile(json.urls.custom, IMG_PATH, IMG_NAME);
    })
};

/**
 * 下载文件到指定目录
 * @param url
 * @param path
 * @param name
 */
let downloadFile = (url, path, name) => {
    https.get(url, res => {
        res.setEncoding('binary');
        let fileData = '';
        res.on('data', chunk => {
            fileData += chunk;
        });
        res.on('end', () => {
            if (!fs.existsSync(path)) {
                jmMkdir.sync(path);
            }
            fs.writeFile(`${path}/${name}`, fileData, 'binary', err => {
                if (!err) {
                    wallpaper.set(`${path}/${name}`);
                    console.log("修改壁纸完成");
                }
            });
        });
    });
};

let copyImage = (src, target) => {
    if (!fs.existsSync(target)) {
        jmMkdir.sync(target);
    }
    fs.readFile(src, function (err, data) {
        if (!err) {
            let date = new Date();
            let fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}.${date.getMilliseconds()}.jpg`;
            fs.writeFile(`${target}/${fileName}`, data, function (err) {
                if (!err) {
                    console.log("下载壁纸成功");
                }
            });
        }
    });
};

export default {
    updateWallpaper
};
