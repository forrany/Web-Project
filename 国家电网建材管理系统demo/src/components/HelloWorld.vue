<template>
  <div class="wrapper">
    <h1 class="title">{{title}}</h1>
    <ul class="proj">
      <li v-for="(item,index) in content" :key="index" class="item">
        <h2 class="itemTitle">{{item.title}}</h2>
        <div v-if="item.image" class="image">
          <img :src="item.image" alt="图示">
        </div>
        <v-Docblock v-if="item.doc" :data="item.doc"/>
        <v-Video v-if="item.video" :videoData="item.video" />
      </li>
      <v-QrCode />
    </ul>
  </div>
</template>

<script>
import DocBlock from './docbolk/DocBlock'
import VideoBlock from './videoblock/VideoBlock'
import QrCode from './qrCode/QRblock'
export default {
  name: 'HelloWorld',
  data () {
    return {
      title:'钢结构吊装施工指导',
      content:[{
        title:'钢结构吊装流程',
        image:'//alicliimg.clewm.net/010/501/3501010/1530110187747e773c90bca83c6d23cb4534cf9f46d5a1530110125.png'
      },{
        title:'钢结构施工方案',
        doc:{
          name:'溉澜溪110kV变电站工程钢结构施工方案.docx',
          capacity:'916.33 KB',
          url:'https://active.clewm.net/CsMCDw?qrurl=http%3A%2F%2Fqr14.cn%2FCsMCDw&gtype=1&key=614b21590f043c1ab3155652a23de21f73c977d629'
        },
        video:{
          title:'视频展示',
          items:[{des:'钢结构安装工艺流程视频',url:'https://v.youku.com/v_show/id_XMTkzNjc0MzU5Ng==.html?x=&sharefrom=android&sharekey=9214b97a1a5f32477e4fd0effe7825ce2'}]
        }
      },{
        title:'验收标准',
        doc:{
          name:'钢结构吊装验收.docx',
          capacity:'15.45 KB',
          url:'https://active.clewm.net/EV9RZ3?qrurl=http%3A%2F%2Fqr14.cn%2FEV9RZ3&gtype=1&key=48505155e900df59031556e9301955afa5c67fd670'
        }
      }]
    }
  },
  components:{
    'v-Docblock':DocBlock,
    'v-Video':VideoBlock,
    'v-QrCode': QrCode
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
.title
  width: 100%
  height: 1.865563rem
  padding: 1.25rem 1rem 0 1rem
  line-height: 1.875rem
  text-align: left
  font-size: 1.5rem
  font-weight: 400
  color: #000
.proj
  padding: 1.25rem 1rem 1.3125rem 1rem
  .item
    .itemTitle
      line-height: 1.375rem
      font-size: .875rem
      font-weight: 600
      color: #000
      text-align: left
    .image
      width: 100%
      img
        width: 100%
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

