<template>
    <div class="videoShow">
        <table class="videoTable" valign="middle">
        <tr class="title">
            {{videoData.title}}
        </tr>
        <tr valign="middle" v-for="(video,index) in videoData.items" :key="index" class="videoItem">
            <td class="singleV">
            <a :href="video.url">{{video.des}}
            <img class="moreIcon" src="./more.png">
            </a>
            </td>
        </tr>
        <tr align="left" class="more">
            <td>
            <a href="">查看详情
            <img class="moreIcon" src="./more.png">
            </a>
            </td>
        </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            videoData:Object
        }
    }
</script>

<style lang="sass">
.videoShow
    width: 19.445875rem
    padding: 1rem
    margin: 1rem 0
    background-color: rgb(248,248,248)
    .videoTable
        .title
            padding-bottom: 1rem
            line-height: 1.375rem
            font-weight: 700
            font-size: 1rem
            border-bottom: 1px solid rgb(221,221,221)
        .videoItem
            height: 3.11125rem
            border-bottom: 1px solid #dddddd
            font-size: .875rem    
</style>
