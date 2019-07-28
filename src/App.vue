<template>
    <div class="us_main">
        <UsImage/>
    </div>
</template>

<script>
    import UsImage from "./components/UsImage";

    export default {
        name: 'app',
        components: {
            UsImage,
        },
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }

    html, body {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .us_main {
        width: 100%;
        height: 100%;
        /*-webkit-app-region: drag;*/
    }
</style>
