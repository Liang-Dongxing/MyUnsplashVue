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
        <Modal v-model="us_modal">
            <div slot="header" class="ivu-modal-header-inner">
                <Icon type="md-settings"/>
                设置
            </div>
            <div>
                <Form v-bind:modal="us_form" label-position="top">
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
                    refreshImage: true,
                    downloadImage: true
                },
                us_loading: {
                    downloadImage: true
                },
                us_form: {
                    path: UsPublic.SAVE_PATH,
                    replaceImg: UsPublic.PROPERTIES.get("replaceImg"),
                    replaceTime: UsPublic.PROPERTIES.get("replaceTime"),
                    replaceTimeOption: UsPublic.PROPERTIES.get("replaceTimeOption"),
                    timeOption: [
                        {value: 's', label: '秒'},
                        {value: 'm', label: '分'},
                        {value: 'h', label: '时'},
                    ],
                    disabled: {
                        replaceTime: false,
                        replaceTimeOption: false
                    }
                }
            }
        },
        created() {
            this.$Spin.show();
            UsPublic.updateWallpaper(this);
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
                this.$Spin.hide();
                this.us_disabled.downloadImage = false;
                this.us_disabled.refreshImage = false;
                this.us_loading.downloadImage = false;
            },
            us_refreshImage() {
                this.$Spin.show();
                this.us_disabled.downloadImage = true;
                this.us_disabled.refreshImage = true;
                UsPublic.updateWallpaper(this);
            },
            us_downloadImage() {
                UsPublic.copyImage(`${UsPublic.IMG_PATH}\\${UsPublic.IMG_NAME}`, `${UsPublic.SAVE_PATH}`);
            },
            us_imageSavePath() {
                let path = UsPublic.ELECTRON.dialog.showOpenDialog({properties: ['openDirectory']});
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
                let path = this.us_form.path;
                if (path.length > 0) {
                    UsPublic.PROPERTIES.set("savePath", path);
                    UsPublic.SAVE_PATH = path
                }
                let switchValue = this.us_form.replaceImg;
                if (switchValue) {
                    UsPublic.PROPERTIES.set("replaceTime", this.us_form.replaceTime);
                    UsPublic.PROPERTIES.set("replaceTimeOption", this.us_form.replaceTimeOption);
                    UsPublic.PROPERTIES.set("replaceImg", switchValue);
                } else {
                    UsPublic.PROPERTIES.set("replaceImg", switchValue);
                }
                UsPublic.PROPERTIES.save(UsPublic.PRO_FILE_PATH);
                this.us_timer();
                this.us_modal = false;
            },
            us_modal_cancel() {
                this.us_modal = false;
            },
            us_close() {
                UsPublic.IPC_RENDERER.sendSync('win-message', true);
            },
            us_timer() {
                let replaceTime = UsPublic.PROPERTIES.get("replaceTime");
                let replaceTimeOption = UsPublic.PROPERTIES.get("replaceTimeOption");
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
                    UsPublic.updateWallpaper(this);
                }, time);
            }
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
