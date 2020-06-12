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
      <el-breadcrumb-item>评价举报</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="container">
      <el-col :span="8"
              class="scrollbar">
        <div class="left">
          <!-- 这是左边区域  展示商品详情  显示商品的介绍 商品的图片  -->
          <div class="title">{{targetInfo.buyerId}}</div>
          <div class="title">{{targetInfo.salerId}}</div>
          <div class="title">{{targetInfo.content}}</div>
          <div class="desc_img">
            <img :src="$store.state.ImgUrl + targetInfo.mainPicUrl"
                 alt="">
          </div>
          <div class="desc_img" v-for="item in targetInfo.otherImgUrl">
            <img :src="$store.state.ImgUrl + item"
                 alt="">
          </div>
        </div>
      </el-col>
      <el-col :span="8"
              class="scrollbar">
        <div class="middle" v-for="it in reportList">
          <!-- 这是中间区域  上面显示举报的信息 -->
          <div class="reportItem" @click="showReportDetail(it)">
            <!-- 点击这个每一项 打开弹框 显示整条举报的详细信息 -->
            <!-- 每条举报的顶部 举报人举报时间 -->
            <div class="item_top">
              <div class="top_l">举报人Id: {{it.customerId}}</div>
              <div class="top_r"> 举报时间: {{it.createTime}}</div>
            </div>
            <!-- 举报的描述内容 -->
            <div class="item_bottom">
              <div class="bottom_desc">
                {{it.reason}}
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
                      placeholder="请认真输入审核备注"
                      v-model="remark_input"
                      clearable
                      resize="none">
            </el-input>
          </div>
          <!-- 提交 -->
          <div class="submit_btn">
            <el-button plain
                       @click="processReport">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>


    <!-- 修改用户对话框 -->
    <el-dialog title="审核"
               :visible.sync="showReportDetailVisible"
               width="65%">
      <el-form :model="reportDetail"
               ref="editFormRef"
               label-width="150px">
        <el-form-item label="举报人id">
          <el-input v-model="reportDetail.customerId"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="举报时间"
                      prop="applyUserId">
          <el-input v-model="reportDetail.createTime"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="举报理由"
                      prop="applyUserId">
          <el-input v-model="reportDetail.reason"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="证明材料"
                      prop="createTime">
          <el-image style="width: 100px;"  v-for="it in reportDetail.picList"
                    :src="$store.state.ImgUrl + it"
                    :preview-src-list="[$store.state.ImgUrl + it]">
          </el-image>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    created() {
      this.getReportDetail()
    },
    data() {
      return {
        showReportDetailVisible: false,
        // 审核操作的下拉框  1-举报失败 2-处理中 3-警告并删除相关内容 4-冻结账号
        options: [
          {
            value: '1',
            label: '未发现不良信息'
          },
          {
            value: '3',
            label: '警告并删除相关内容'
          },
          {
            value: '4',
            label: '冻结账号'
          }
        ],
        targetId:'',
        targetType:'',
        value: '',
        remark_input: '',
        reportList:[],
        targetInfo:{},
        imgList:{},
        processResult: {
          result: '',
          remark: '',
          targetId:'',
          id:'',
          type: ''
        },
        reportDetail:{}
      }
    },
    methods: {
      async getReportDetail(){
        //获得商品的id和类型
        let targetId = location.href.slice(location.href.indexOf('?targetId=') + 10, location.href.indexOf('&type='))
        let type = location.href.slice(location.href.indexOf('&type=') + 6)
        this.targetId = targetId;
        this.targetType = type;
        const { data: res } = await this.$http.get(
                `user/report/admin/detail/${targetId}/${type}`
        )
        if(res.code !== 200){
          return this.$Message.error('加载举报信息失败,请稍后重试')
        }
        this.reportList = res.data
        const { data: info } = await this.$http.get(
                `order/evaluate/${targetId}`
        )
        this.targetInfo = info.data
        console.log(this.targetInfo)
      },

      async processReport() {
        this.processResult.targetId = this.targetId;
        this.processResult.remark = this.remark_input;
        this.processResult.result = this.result;
        this.processResult.type = this.targetType;
        const { data: processRes } = await this.$http.post(
                `user/report/admin/process`, this.processResult
        )
        if (processRes.code !== 200) {
          return this.$Message.error('处理失败,请稍后重试')
        }
        return this.$Message.error('处理成功')
      },
      async showReportDetail(info){
        this.reportDetail = info
        if(info.pics !== null && info.pics !== undefined){
          this.reportDetail.picList = info.pics.split(",");
        }
        console.log(info)
        this.showReportDetailVisible = true
      }
    }
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
        padding: 20px;
        font-style: normal;
        font-weight: 500;
        color: #4d4d4d;
        .title {
          font-size: 16px;
          color: #333;
          line-height: 30px;
        }
        .desc_text {
          font-size: 14px;
          line-height: 21px;
        }
        .desc_img {
          margin-top: 10px;
          img {
            width: 100%;
            &:nth-child(1) {
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            }
            &:last-child {
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
            }
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