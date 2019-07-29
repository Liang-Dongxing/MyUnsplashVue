<template>
    <div class="us_main">
        <UsImage v-bind:UsPublic="UsPublic"/>
        <UsOperating/>
    </div>
</template>

<script>
    import UsPublic from "./components/UsPublic";
    import UsImage from "./components/UsImage";
    import UsOperating from "./components/UsOperating";

    export default {
        name: 'app',
        components: {
            UsImage,
            UsOperating,
        },
        data() {
            return {
                UsPublic
            }
        }
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
        -webkit-app-region: drag;
    }
</style>
