<template>
    <img class="us_image" v-bind:src="us_src" v-bind:alt="us_alt">
</template>

<script>
    export default {
        name: "UsImage",
        props: {
            UsPublic:Object
        },
        data() {
            return {
                us_src: '',
                us_alt: '',
            }
        },
        created() {
            this.UsPublic.updateWallpaper(this);
        },
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

</style>
