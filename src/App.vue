<template>
    <UsMain/>
</template>

<script>
    import UsMain from "./components/UsMain";

    export default {
        name: 'app',
        components: {
            UsMain
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
        -webkit-app-region: drag;
    }

    .ivu-btn-group,.ivu-modal {
        -webkit-app-region: no-drag;
    }
</style>
