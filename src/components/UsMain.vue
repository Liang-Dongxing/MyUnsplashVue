<template>
    <div class="us_main">
        <img class="us_image" v-bind:src="us_src" v-bind:alt="us_alt">
        <Layout>
            <Header></Header>
            <Content></Content>
            <Footer>
                <ButtonGroup size="small" shape="circle">
                    <Button type="primary" v-on:click="us_setting">
                        <Icon type="md-settings"/>
                    </Button>
                    <Button type="primary" v-on:click="us_refreshImage">
                        <Icon type="md-refresh"/>
                    </Button>
                    <Button type="primary" v-on:click="us_downloadImage">
                        <Icon type="md-download"/>
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
                            <Input v-model="us_form.path"/>
                        </Col>
                        <Col span="3">
                            <Button v-on:click="us_imageSavePath">...</Button>
                        </Col>
                    </FormItem>
                    <FormItem label="是否开启自动更换壁纸">
                        <iSwitch v-model="us_form.switch" v-on:change="us_form_switch"/>
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
                us_modal: true,
                us_form: {
                    path: UsPublic.SAVE_PATH,
                    switch: UsPublic.PROPERTIES.get("replaceImg")
                }
            }
        },
        created() {
            UsPublic.updateWallpaper(this);
        },
        methods: {
            us_setting() {
                this.us_modal = true;
            },
            us_refreshImage() {
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
            us_form_switch(status){

            },
            us_modal_ok() {
                this.us_modal = false;
            },
            us_modal_cancel() {
                this.us_modal = false;
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
    }

    .ivu-layout-content {
        height: 428px;
    }

    .ivu-layout-footer {
        height: 48px;
        position: relative;
    }

    .ivu-btn-group {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .ivu-form .ivu-col .ivu-btn {
        width: 100%;
    }
</style>
