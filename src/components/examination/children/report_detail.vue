<template>
  <div>
    <!-- <h1>这是举报详情的页面</h1> -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>举报列表</el-breadcrumb-item>
      <el-breadcrumb-item>帖子举报详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="header">
      <el-col class="container">
        <div class="container_box">
          <!-- 文章的内容区域  通过后端传过来的数据 -->
          <!-- 把url传到这个组件里面 -->
          <forumstatic :url.sync="$store.state.ImgUrl + articleInfo.detailPage"></forumstatic>
        </div>
      </el-col>
    </el-row>
    <!-- 主体区域   举报内容 -->

    <el-row class="main">
      <el-col class="main_list_left"
              :span="14">
        <ul>
          <!-- 循环这个li -->
          <li v-for="item in reportList"
              :key="item.id">
            <div>
              <div class="main_head">
                <div class="author">举报人:{{item.customerId}}</div>
                <div class="time">{{item.createTime}}</div>
              </div>
              <div class="report_content">{{item.reason}}</div>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="10"
              class="right">
        <!-- 这是右边区域   管理员处理区域 -->
        <el-row class="main_right">
          <div class="main_right_box">
            <p>审核:</p>
            <div class="select">
              <template>
                <el-select v-model="result"
                           placeholder="请选择">
                  <el-option v-for="item in results_options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </div>
          </div>
          <div class="remark_box">
            <!-- 这里是备注区域 -->
            <div class="description">请输入备注: </div>
            <el-input type="textarea"
                      placeholder="请输入备注"
                      v-model="remark_input"
                      clearable
                      resize="none">
            </el-input>
          </div>
        </el-row>
        <el-row class="main_right_footer">
          <div class="submit_btn">
            <el-button plain
                       @click="processReport">提交</el-button>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import forumstatic from '../forum_static.vue'
export default {
  components: {
    forumstatic
  },
  created() {
    this.getReportDetails()
  },
  data() {
    return {
      processResult: {
        result: '',
        remark: '',
        targetId: '',
        id: '',
        type: ''
      },
      results_options: [
        { value: 1, label: '未发现异常' },
        { value: 3, label: '警告并删除' },
        { value: 4, label: '冻结账号' }
      ],
      articleInfo: '',
      // result
      result: '',
      // 备注
      remark_input: '',
      reportList: []
    }
  },
  methods: {
    // 获取管理员的id值
    async getReportDetails() {
      // js的slice方法
      var id = location.href.slice(
        location.href.indexOf('?targetId=') + 10,
        location.href.indexOf('&type=')
      )
      var targetIdType = location.href.slice(
        location.href.indexOf('&type=') + 6
      )
      this.getArticleInfo(id)
      const { data: res } = await this.$http.get(
        `user/report/admin/detail/${id}/${targetIdType}`
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('加载举报信息失败,请稍后重试')
      } else {
        // 请求数据成功
        this.$Message.success('加载成功')
        var list = res.data
        list.forEach(async item => {
          item.customerId = await this.getUserName(item.customerId)
          this.reportList.push(item)
        })
        this.reportList = list
        console.log(this.reportList)
      }
    },

    async getArticleInfo(id) {
      const { data: res } = await this.$http.get(
        `life/forum/article//brief/${id}`
      )
      if (res.code !== 200) {
        return
      }
      console.log('文章信息')
      console.log(res)
      this.articleInfo = res.data
    },

    async processReport() {
      var targetId = location.href.slice(
        location.href.indexOf('?id=') + 4,
        location.href.indexOf('&type=')
      )

      var targetIdType = location.href.slice('&type=' + 6)
      const { data: res } = await this.$http.get(
        `user/report/admin/detail/${targetId}/${targetIdType}`
      )
      this.processResult.targetId = targetId
      this.processResult.remark = this.remark_input
      this.processResult.result = this.result
      this.processResult.type = targetIdType

      const { data: processRes } = await this.$http.post(
        `user/admin/report/process`,
        this.processResult
      )
      if (processRes.code !== 200) {
        return this.$Message.error('处理失败,请稍后重试')
      }
    },
    async getUserName(userId) {
      const { data: res } = await this.$http.get(`user/user/${userId}`)
      if (res.code != 200) return
      return res.text
    }
  }
}
</script>
<style lang="less" scoped>
// 头部区域
.header,
.container {
  height: 350px;
  background-color: #fff;
  border-radius: 2px;
}
.container_box {
  height: 300px;
  padding: 20px;
  overflow: auto;
  cursor: pointer;
}
.main {
  margin-top: 10px;
  background-color: #fff;
}
.main,
.main_list_left {
  height: 350px;
  font-size: 13px;
  color: #4d4d4d;
  line-height: 20px;
}
.main_list_left {
  > ul {
    margin: 0;
    padding: 0;
    height: 350px;
    overflow-y: scroll;
  }
}
.main_list_left > ul > li {
  list-style: none;
  > div {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    .main_head {
      height: 25px;
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      // 作者
      .author {
        > span {
          font-size: 13px;
          font-weight: 600;
          font-style: normal;
        }
      }
      .time {
        font-size: 12px;
        color: #555;
      }
    }
    .report_content {
    }
  }
}
.container_box,
.main_list_left > ul {
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
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 5px rgba(223, 223, 223, 0.4);
    border-radius: 0;
    background: rgba(1, 1, 1, 0.2);
  }
}
// 右部区域
.main_right {
  padding: 10px 20px;
  .main_right_box {
    font-size: 14px;
    font-weight: 500;
    font-style: normal;
    line-height: 20px;
    color: #4d4d4d;
    display: flex;
    align-items: center;
    > p,
    > div {
      margin: 6px;
    }
  }
  // 处理备注区域
  .remark_box {
    margin-top: 10px;
    width: 90%;
    height: 60px;
    padding-left: 10px;
    > div.description {
      padding: 10px 0;
    }
  }
}
.right {
  height: 300px;
  position: relative;
}

// 右底部区域
.main_right_footer {
  position: absolute;
  bottom: 50px;
  right: 60px;
  .submit_btn {
  }
}
</style>