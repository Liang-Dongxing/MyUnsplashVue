module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId:"com.electron.myunsplash",
                productName: "MyUnsplash",
                copyright: "Copyright © 2019 DongXing",
                asar: true,
                nsis: {
                    oneClick: false,
                    allowToChangeInstallationDirectory: true,
                }
            }
        }
    }
}
