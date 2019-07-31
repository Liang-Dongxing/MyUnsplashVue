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
        <Modal v-model="us_modal" title="设置" v-on:on-ok="us_modal_ok" v-on:on-cancel="us_modal_cancel">

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
            us_modal_ok() {
                this.us_modal = false;
            },
            us_modal_cancel() {
                this.us_modal = false;
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
</style>
