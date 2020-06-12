<template>
  <div>
    <!-- 这个是静态模块的组件 -->
    <div style="height:auto;"
         class="container">
      <iframe id="show-iframe"
              frameborder="0"
              scrolling="yes"
              style="background-color:transparent; position：absolute;width: 100%;
         height:100%; top: 0;left:0;bottom:0;"
              :src='url'
              @load="setInframeHeight"></iframe>
    </div>
  </div>
</template>
<script>
export default {
  props: ['url'],
  data() {
    return {}
  },
  created() {
    this.con()
  },
  methods: {
    con() {
      console.log(this.url)
    },
    setInframeHeight() {
      /**
       * iframe-宽高自适应显示
       */
      const oIframe = document.getElementById('show-iframe')
      // const deviceWidth = document.documentElement.clientWidth
      const deviceHeight = document.documentElement.clientHeight
      oIframe.style.height = Number(deviceHeight) + 80 + 'px' //数字是页面布局高度差，其中的100可以根据自己的界面进行调整
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
#show-iframe {
  border-radius: 6px;
  overflow: hidden;
}
.container {
  border-radius: 6px;
  overflow: hidden;
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 5px rgba(197, 197, 197, 0.6);
    background: rgba(0, 0, 0, 0.6);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 5px rgba(223, 223, 223, 0.4);
    border-radius: 0;
    background: rgba(1, 1, 1, 0.2);
  }
}
</style>