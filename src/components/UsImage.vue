<template>
    <img class="us_image" v-bind:src="us_src" v-bind:alt="us_alt">
</template>

<script>
    import UsPublic from "./UsPublic";

    export default {
        name: "UsImage",
        data() {
            return {
                us_src: '',
                us_alt: '',
            }
        },
        created() {
            UsPublic.updateWallpaper(this);
        },
    }
</script>

<style scoped>
    .us_image {
        height: 100%;
        width: 100%;
    }

</style>
