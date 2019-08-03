<template>
    <div class="us_main">
        <img class="us_image" v-bind:src="us_src" v-bind:alt="us_alt" v-on:load="us_imgLoad">
        <Layout>
            <Header>
                <Button class="us_close" type="error" v-on:click="us_close" size="small">
                    <Icon type="md-close"/>
                </Button>
            </Header>
            <Content></Content>
            <Footer>
                <ButtonGroup size="small" shape="circle">
                    <Button type="primary" v-on:click="us_setting">
                        <Tooltip content="下载壁纸" placement="top-start">
                            <Icon type="md-settings"/>
                        </Tooltip>
                    </Button>
                    <Button type="primary" v-on:click="us_refreshImage" v-bind:disabled="us_disabled.refreshImage">
                        <Tooltip content="刷新壁纸" placement="top">
                            <Icon type="md-refresh"/>
                        </Tooltip>
                    </Button>
                    <Button type="primary" v-on:click="us_downloadImage" v-bind:disabled="us_disabled.downloadImage" v-bind:loading="us_loading.downloadImage">
                        <Tooltip content="下载壁纸" placement="top-end">
                            <Icon type="md-download"/>
                        </Tooltip>
                    </Button>
                </ButtonGroup>
            </Footer>
        </Layout>
        <Modal v-model="us_modal" :styles="{top: '45px'}">
            <div slot="header" class="ivu-modal-header-inner">
                <Icon type="md-settings"/>
                设置
            </div>
            <div>
                <Form v-bind:modal="us_form" label-position="top">
                    <FormItem label="图片关键词（多个词用`,`隔开）">
                        <Col span="24">
                            <Input v-model="us_form.keyword" size="default"/>
                        </Col>
                    </FormItem>
                    <FormItem label="图片下载路径">
                        <Col span="21">
                            <Input v-model="us_form.path" size="default"/>
                        </Col>
                        <Col span="3">
                            <Button v-on:click="us_imageSavePath" size="default">...</Button>
                        </Col>
                    </FormItem>
                    <FormItem label="是否开启自动更换壁纸">
                        <Col span="3">
                            <iSwitch v-model="us_form.replaceImg" @on-change="us_form_replaceImg" size="default"/>
                        </Col>
                        <Col span="4">
                            <InputNumber v-model="us_form.replaceTime" v-bind:disabled="us_form.disabled.replaceTime"/>
                        </Col>
                        <Col span="5">
                            <Select v-model="us_form.replaceTimeOption" v-bind:disabled="us_form.disabled.replaceTimeOption">
                                <Option v-for="item in us_form.timeOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </FormItem>
                    <FormItem label="是否使用高清壁纸（8K，网速慢请关闭）">
                        <Col span="3">
                            <iSwitch v-model="us_form.replaceImgHD" size="default"/>
                        </Col>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" size="default" v-on:click="us_modal_cancel">
                    关闭
                </Button>
                <Button type="primary" size="default" v-on:click="us_modal_ok">
                    确定
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import UsPublic from "./UsPublic";

    export default {
        name: "UsMain",
        data() {
            return {
                us_src: '',
                us_alt: '',
                us_modal: false,
                us_timer_id: 0,
                us_disabled: {
                    refreshImage: false,
                    downloadImage: true
                },
                us_loading: {
                    downloadImage: false
                },
                us_form: {
                    keyword: UsPublic.properties.get("replaceKeyword"),
                    path: UsPublic.SAVE_PATH,
                    replaceImg: UsPublic.properties.get("replaceImg"),
                    replaceTime: UsPublic.properties.get("replaceTime"),
                    replaceTimeOption: UsPublic.properties.get("replaceTimeOption"),
                    replaceImgHD: UsPublic.properties.get("replaceImgHD"),
                    timeOption: [
                        {value: 's', label: '秒'},
                        {value: 'm', label: '分'},
                        {value: 'h', label: '时'},
                    ],
                    disabled: {
                        replaceTime: false,
                        replaceTimeOption: false
                    }
                },
                us_request: null
            }
        },
        created() {
            // this.$Spin.show();
            this.updateWallpaper();
            if (!this.us_form.replaceImg) {
                this.us_form.disabled.replaceTime = true;
                this.us_form.disabled.replaceTimeOption = true;
            } else {
                this.us_timer();
            }
        },
        methods: {
            us_setting() {
                this.us_modal = true;
            },
            us_imgLoad() {
                // this.$Spin.hide();
                this.us_disabled.downloadImage = false
                // this.us_disabled.refreshImage = false;
            },
            us_refreshImage() {
                // this.$Spin.show();
                this.us_disabled.downloadImage = true
                // this.us_disabled.refreshImage = true;
                this.updateWallpaper();
            },
            us_downloadImage() {
                // 下载图片按钮
                this.copyImage(`${UsPublic.IMG_PATH}\\${UsPublic.IMG_NAME}`, `${UsPublic.SAVE_PATH}`);
            },
            us_imageSavePath() {
                // 图片保存路径获取对话框
                let path = UsPublic.electron.dialog.showOpenDialog({properties: ['openDirectory']});
                path.then(value => {
                    if (value.filePaths.length > 0) {
                        this.us_form.path = value.filePaths[0].replace(/\\/g, "/");
                    }
                })
            },
            us_form_replaceImg(status) {
                if (status) {
                    this.us_form.disabled.replaceTime = false;
                    this.us_form.disabled.replaceTimeOption = false;
                } else {
                    this.us_form.disabled.replaceTime = true;
                    this.us_form.disabled.replaceTimeOption = true;
                }
            },
            us_modal_ok() {
                // 点击ok按钮保存配置文件
                let path = this.us_form.path;
                if (path.length > 0) {
                    UsPublic.properties.set("savePath", path);
                    UsPublic.SAVE_PATH = path
                }
                let switchValue = this.us_form.replaceImg;
                if (switchValue) {
                    UsPublic.properties.set("replaceTime", this.us_form.replaceTime);
                    UsPublic.properties.set("replaceTimeOption", this.us_form.replaceTimeOption);
                    UsPublic.properties.set("replaceImg", switchValue);
                } else {
                    UsPublic.properties.set("replaceImg", switchValue);
                }
                UsPublic.properties.set("replaceImgHD", this.us_form.replaceImgHD);
                UsPublic.properties.set("replaceKeyword", this.us_form.keyword);
                UsPublic.properties.save(UsPublic.PRO_FILE_PATH);
                this.us_timer();
                this.us_modal = false;
            },
            us_modal_cancel() {
                this.us_modal = false;
            },
            us_close() {
                // 根据渲染线程和主线程通信隐藏窗口
                UsPublic.ipcRenderer.sendSync('win-message', true);
            },
            us_timer() {
                // 根据配置文件生成定时任务
                let replaceTime = UsPublic.properties.get("replaceTime");
                let replaceTimeOption = UsPublic.properties.get("replaceTimeOption");
                let time = 0;
                switch (replaceTimeOption) {
                    case "s":
                        time += replaceTime * 1000;
                        break;
                    case "m":
                        time += replaceTime * 60 * 1000;
                        break;
                    case "h":
                        time += replaceTime * 60 * 60 * 1000;
                        break;
                }
                clearInterval(this.us_timer_id);
                this.us_timer_id = setInterval(() => {
                    this.updateWallpaper();
                }, time);
            },
            updateWallpaper() {
                // 更新壁纸
                let src;
                if (this.us_form.keyword.length > 0) {
                    src = this.getKeywordImgBackground(this.us_form.keyword);
                } else {
                    src = this.getRandomImgBackground();
                }
                this.downloadFile(src, UsPublic.IMG_PATH, UsPublic.IMG_NAME);
            },
            getKeywordImgBackground(keyword) {
                UsPublic.unsplashUrl.pathname = `${UsPublic.LOCAL_SCREEN.width}x${UsPublic.LOCAL_SCREEN.height}`;
                return encodeURI(UsPublic.unsplashUrl.href + `/?${keyword}`);
            },
            getRandomImgBackground() {
                // 随机获取图片
                UsPublic.unsplashUrl.pathname = `random/${UsPublic.LOCAL_SCREEN.width}x${UsPublic.LOCAL_SCREEN.height}`;
                return UsPublic.unsplashUrl.href;
            },
            downloadFile(url, path, name) {
                if (!UsPublic.fs.existsSync(path)) {
                    UsPublic.jmMkdir.sync(path);
                }
                // 根据url下载图片
                this.us_request = UsPublic.request(url);
                this.us_request.on('response', (response) => {
                    let size = parseInt(response.headers['content-length']);
                    let num = 0;
                    let ct = [];
                    response.on('data', (chunk) => {
                        ct.push(chunk)
                        num += chunk.length;
                        // console.log(parseInt((num / size) * 100));
                        this.$Loading.update(parseInt((num / size) * 100));
                    })
                    response.on('end', () => {
                        this.us_loading.downloadImage = false;
                        this.$Loading.finish();
                        this.us_src = `data:image/jpeg;base64,${Buffer.concat(ct).toString("base64")}`;
                        UsPublic.wallpaper.set(`${path}/${name}`);
                    });
                });
                this.us_request.on('error', (err) => {
                    console.log(err);
                });
                this.us_request.pipe(UsPublic.fs.createWriteStream(`${path}/${name}`));
            },
            copyImage(src, target) {
                // 复制文件到指定目录
                if (!UsPublic.fs.existsSync(target)) {
                    UsPublic.jmMkdir.sync(target);
                }
                UsPublic.fs.readFile(src, function (err, data) {
                    if (!err) {
                        let date = new Date();
                        let fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}.${date.getMilliseconds()}.jpg`;
                        UsPublic.fs.writeFile(`${target}/${fileName}`, data, function (err) {
                            if (!err) {
                                console.log("下载壁纸成功");
                            }
                        });
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .us_image {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
    }

    div[class^="ivu-layout"] {
        background-color: unset;
    }

    .ivu-layout-header, .ivu-layout-footer {
        padding: unset;
        position: relative;
    }

    .ivu-layout-content {
        height: 428px;
    }

    .ivu-layout-footer {
        height: 48px;
    }

    .ivu-btn-group {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .us_close {
        position: absolute;
        top: 0;
        right: 0;
    }

    .ivu-form .ivu-col .ivu-btn {
        width: 100%;
    }
</style>
