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
      <el-breadcrumb-item>留言举报</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="container">
      <el-col :span="8"
              class="scrollbar">
        <div class="left">
          <!-- 这是显示留言  留言的作者头像昵称  留言的内容 留言的时间  -->
          <div class="leftItem">
            <div class="item_top">
              <div class="userInfo">
                <img src="https://image.suning.cn/uimg/ZR/share_order/158742573335722703.jpg"
                     alt=""
                     class="headerImg">
                <div class="nickname">张三</div>
              </div>
              <div class="createTime">2020-11-09 10:00:00</div>
            </div>
            <div class="item_bottom">
              这是回复的内容这是回复的内容
              这是回复的内容这是回复的内容
              这是回复的内容这是回复的内容
              这是回复的内容这是回复的内容
              这是回复的内容这是回复的内容
              这是回复的内容这是回复的内容
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8"
              class="scrollbar">
        <div class="middle">
          <!-- 这是中间区域  上面显示举报的信息 -->
          <div class="reportItem">
            <!-- 点击这个每一项 打开弹框 显示整条举报的详细信息 -->
            <!-- 每条举报的顶部 举报人举报时间 -->
            <div class="item_top">
              <div class="top_l">举报人: 张三</div>
              <div class="top_r"> 举报时间: 2020-06-11 18:00:00</div>
            </div>
            <!-- 举报的描述内容 -->
            <div class="item_bottom">
              <div class="bottom_desc">
                这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息
              </div>
            </div>
          </div>
          <div class="reportItem">
            <!-- 点击这个每一项 打开弹框 显示整条举报的详细信息 -->
            <!-- 每条举报的顶部 举报人举报时间 -->
            <div class="item_top">
              <div class="top_l">举报人: 张三</div>
              <div class="top_r"> 举报时间: 2020-06-11 18:00:00</div>
            </div>
            <!-- 举报的描述内容 -->
            <div class="item_bottom">
              <div class="bottom_desc">
                这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息这里是举报的备注信息
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8"
              class="scrollbar">
        <div class="right">
          <!--   下面放操作 -->
          <!-- 审核选择下拉框 -->
          <div class="select_b">
            审核:
            <el-select v-model="value"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 请输入审核备注 -->
          <div class="remark">
            <div class="description">请输入备注: </div>
            <el-input type="textarea"
                      placeholder="请输入备注"
                      v-model="remark_input"
                      clearable
                      resize="none">
            </el-input>
          </div>
          <!-- 提交 -->
          <div class="submit_btn">
            <el-button plain>提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      // 审核操作的下拉框
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      remark_input: ''
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.el-row.container {
  margin-top: 20px;
  background-color: #fff;
  height: 700px;
  // overflow: hidden;
  > .el-col {
    height: 100%;
    overflow: auto;
    .left {
      div.leftItem {
        padding: 10px;
        div.item_top {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #333;
          font-weight: 500;
          font-style: normal;

          div.userInfo {
            display: flex;

            img.headerImg {
              height: 36px;
              width: 36px;
              border-radius: 50%;
            }
            div.nickname {
              margin-left: 10px;
            }
          }

          div.createTime {
            font-size: 12px;
          }
        }
        div.item_bottom {
          padding: 0 10px;
          font-size: 14px;
          color: #333;
          font-weight: 500;
          font-style: normal;
          color: #4d4d4d;
        }
      }
    }
    .middle {
      padding: 10px;
      div.reportItem {
        padding: 10px;
        height: 66px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        color: #4d4d4d;
        line-height: 21px;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #d9d9d9;
        cursor: pointer;
        div.item_top {
          display: flex;
          justify-content: space-between;
          div.top_l {
            color: #333;
          }

          div.top_r {
            font-size: 12px;
          }
        }

        div.item_bottom {
          div.bottom_desc {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }
    .right {
      height: 90%;
      padding: 10px;
      font-size: 14px;
      color: #4d4d4d;
      font-weight: 500;
      font-style: normal;
      line-height: 21px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .remark {
        margin-top: 10px;
        > div.description {
          padding: 10px 0;
        }
      }
      .submit_btn {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
}
</style>