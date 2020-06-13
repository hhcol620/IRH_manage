<template>
  <div>
    <!-- <h1>这是举报详情的页面</h1> -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>公益基金审批</el-breadcrumb-item>
      <el-breadcrumb-item>审批详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主要内容区域 -->
    <el-row class="container">
      <el-col :span="8"
              class="scrollbar">
        <div class="left">
          <div class="title">活动发起: {{targetInfo.applyUser.nickname}}</div>
          <div class="createTime">2020-11-09 19:00:00</div>
          <div class="desc_text">{{targetInfo.title}}</div>
          <div class="desc_text">{{targetInfo.reason}}</div>
          <div class="desc_text">{{targetInfo.witnessName}}</div>
          <div class="desc_text">{{targetInfo.witnessPhone}}</div>
          <div class="desc_img">
            <img :src="$store.state.ImgUrl + targetInfo.reasonPicUrl"
                 alt="">
          </div>

        </div>
      </el-col>
      <el-col :span="8"
              class="scrollbar">
        <div class="middle">

          <div class="search">
            <!-- 价格范围 -->
            <div class="priceRange">
              <el-input v-model="search.searchCondition.minMoney"
                        placeholder="最低价格"></el-input>
              <el-input v-model="search.searchCondition.maxMoney"
                        placeholder="最高价格"></el-input>
            </div>
            <el-select v-model="search.searchCondition.orderFieldType"
                       placeholder="价格排序">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="orderItem">
            <!-- 显示 订单号 价格 -->
            <checkbox :arrList="orderArr"
                      v-model="amount"
                      @getstr="get_Str"
                      class="checkbox"></checkbox>
          </div>
        </div>
      </el-col>
      <el-col :span="8"
              class="scrollbar">
        <div class="right">
          <div class="checkedOrders scrollbar">
            <checked :arrList="checkedOrders"
                     class="checkbox"></checked>
          </div>
          <!--   下面放操作 -->
          <!-- 审核选择下拉框 -->
          <div class="amount">累计金额: {{amount|savePrecision}}</div>
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
import Vue from 'vue'
import checkbox from '../../checkbox_self/checkbox_self.vue'
import checked from '../../checked_slef/checked_self.vue'
Vue.component('checkbox', checkbox)
Vue.component('checked', checked)
export default {
  created() {
    this.getApplyInfo()
    this.getDonationOrderList()
  },
  data() {
    return {
      targetId:'',
      // 订单 多选框数组
      orderArr: [],
      targetInfo:{
        applyUser:{}
      },
      // 存总金额
      amount: 0.0,
      // 存用,分割的id字符串
      idStr: '',
      // value
      value: '',
      options: [
        {
          value: 'DESC',
          label: '价格降序'
        },
        {
          value: 'ASC',
          label: '价格升序'
        }
      ],
      // 被选中数组项
      checkedOrders: [],
      search:{
        currentPage:1,
        pageSize:10,
        searchCondition:{
          orderFieldType: '',
          minMoney:'',
          maxMoney:''
        }
      }
    }
  },
  methods: {
    // 获取子组件传过来的字符串 , 分割的
    get_Str(e) {
      // console.log(e)
      this.idStr = e
    },
    async getDonationOrderList(){
      const { data: res } = await this.$http.post(`order/admin/donation/order/list`, this.search)
      if(res.code !== 200){

      }
      this.orderArr = res.data.data
      console.log(this.orderArr)
    },
    async getApplyInfo(){
      let targetId = location.href.slice(location.href.indexOf('?targetId=') + 10)
      this.targetId = targetId;
      const { data: res } = await this.$http.get(`order/donation/detail/2/${targetId}`)
      if(res.code !== 200){

      }
      this.targetInfo = res.data
      let userId = res.data.applyUserId
      let userInfo = this.getUserName(userId)
      this.targetInfo.applyUser = userInfo
    },
    async getUserName(userId) {
      const { data: res } = await this.$http.get(`user/user/${userId}`)
      if (res.code !== 200) return
      console.log(res)
      return res.data
    }
  },
  watch: {
    idStr: function() {
      this.checkedOrders = []
      let str = this.idStr
      let arr = str.split(',')
      arr.forEach((v, i) => {
        this.orderArr.forEach((p, q) => {
          if (v == p.id) {
            this.checkedOrders.push(p)
          }
        })
      })
      // console.log(this.checkedOrders)
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
      line-height: 21px;
      .title {
        font-size: 16px;
        color: #333;
        line-height: 30px;
      }
      .createTime {
        font-size: 12px;
        line-height: 16px;
      }
      .desc_text {
        margin-top: 10px;
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
      .orderItem {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
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
      .checkedOrders {
        height: 260px;
      }
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
.checkbox {
  width: 100%;
}
.amount {
  font-size: 36px;
  line-height: 100px;
}
.search {
  display: flex;
  .priceRange {
    display: flex;
    .el-input {
      margin: 0 2px;
    }
  }
  .el-select {
    margin-left: 10px;
  }
}
</style>