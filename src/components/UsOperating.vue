<template>
    <Layout>
        <Header></Header>
        <Content></Content>
        <Footer></Footer>
    </Layout>
</template>

<script>
    export default {
        name: "UsOperating"
    }
</script>

<style scoped>
    div[class^="ivu-layout"] {
        background-color: unset;
    }

    .ivu-layout-header, .ivu-layout-footer {
        padding: unset;
    }
    .ivu-layout-content{
        height: 428px;
    }
    .ivu-layout-footer{
        height: 48px;
    }
</style>
