<template>
    <div class="doc">
        <a :href="data.url" class="link">
            <img src="//static.clewm.net/cli/images/doc@2x.png ">
            <div class="info">
                <div class="name">{{data.name}}</div>
                <div class="capacity">{{data.capacity}}</div>
            </div>
        </a>
    </div>
    
</template>
<script>
    export default{
        name: 'DocBlock',
        props:{
            data:Object
        }
    }
</script>

<style lang="sass">
.doc
    box-sizing: border-box
    width: 343.134px
    height: 3.9375rem
    margin: 1rem 0
    background-color: rgb(248,248,248)
    .link
        display: inline-block
        padding: .875rem
        width: 100%
    img
        width: 1.875rem
        margin-right: .625rem
    .info
        display: inline-block
        width: 16.15125rem
        vertical-align: middle
        .name
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            font-size: .875rem
            line-height: 1.125rem
            font-weight: 700
            color: #000
        .capacity
            heigth: 1.109312rem
            margin: .125rem 0
            font-size: .75rem
            line-height: 1.125rem
            color: rgb(153,153,153)
            font-weight: 700
</style>
