<template>
  <div>
    <!-- 订单模块 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 图表区域 -->
      <el-row class="chart"
              :gutter="20">
        <!-- 左半部分 -->
        <el-col :span="12">
          <!-- 上半部 -->
          <el-row class="left_head">
            <!-- 订单总量 -->
            <div class="circle">
              <span class="circleTitle">订单总量</span>
              <div class="wrapper left_circle">
                <div class="circleProgress rightcircle">
                </div>
              </div>
              <div class="wrapper right_circle">
                <div class="circleProgress leftcircle">
                </div>
              </div>
            </div>
            <!-- 今日成交 -->
            <div class="circle">
              <span class="circleTitle">今日成交</span>
              <div class="wrapper left_circle">
                <div class="circleProgress rightcircle">
                </div>
              </div>
              <div class="wrapper right_circle">
                <div class="circleProgress leftcircle">
                </div>
              </div>
            </div>
          </el-row>
          <!-- 下半部 -->
          <el-row class="left_footer">
            <el-col>
              <div id="transactionMessage"
                   :style="{width: '100%', height: '280px',}"
                   class="transactionechart"></div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 右半部分  交易金额和增长趋势 -->
        <el-col :span="12"
                class="right">
          <div class="echartsTitle">
            <span>近期平台交易总金额和增长趋势数据统计</span>
          </div>

          <el-row class="right_head">
            <el-col>
              <!-- 日期选择器 -->
              <div class="time_select">

                <el-select v-model="time"
                           placeholder="请选择时间段"
                           size="mini"
                           @change="changeReq">
                  <el-option label="最近一周"
                             value="1"></el-option>
                  <el-option label="最近一个月"
                             value="2"></el-option>
                  <el-option label="最近半年"
                             value="3"></el-option>
                  <el-option label="最近一年"
                             value="4"></el-option>

                </el-select>
              </div>
              <div id="transMessage"
                   :style="{width: '100%', height: '400px',}"
                   class="transactionechart"></div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入订单ID"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.id"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入订单编号"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.orderCode"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.tradeType"
                     placeholder="请选择交易方式">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getGoodsBySearchCondition">搜索</el-button>
          <el-button class="primary"
                     @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
      <!-- 主体内容列表区域 -->
      <el-table :data="listObjs"
                stripe
                border>
        <!-- 展开列 -->
        <!--<el-table-column type="expand">
          <template slot-scope="scope">
            <div class="roleListTag">
              <div class="tag"
                   v-for="(item,index) in scope.row.listObjs"
                   :key="index">
                <el-tooltip class="item"
                            effect="dark"
                            :content="item.roleDesc"
                            placement="top"
                            :enterable="false">
                  <el-tag>{{item.orderCode}}</el-tag>
                </el-tooltip>

              </div>
            </div>
            &lt;!&ndash; <pre>{{scope.row}}</pre> &ndash;&gt;
          </template>
        </el-table-column>-->
        <!-- 索引列 -->
        <el-table-column type="index"
                         hidden></el-table-column>
        <el-table-column prop="id"
                         label="ID"></el-table-column>
        <el-table-column prop="orderCode"
                         label="订单编号"></el-table-column>
        <el-table-column prop="salerId"
                         label="卖家id"></el-table-column>
        <el-table-column prop="buyerId"
                         label="买家id"></el-table-column>
        <el-table-column prop="productId"
                         label="商品id"></el-table-column>
        <el-table-column label="交易方式及订单状态"
                         prop="tradeType">
          <template scope="scope">
            <!-- 使用过滤器将后端传过来的数字类型的数据转为对应的身份名 -->
            <el-tag>{{scope.row.tradeType | orderTradeType}}</el-tag>&nbsp;&nbsp;
            <el-tag>{{scope.row.state | orderState}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime"
                         label="创建时间">
        </el-table-column>

        <el-table-column prop="updateTime"
                         label="最近更新时间">
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>
    </el-card>

    <!-- 更多的 弹框弹框区域 -->
    <el-dialog title="订单详情"
               :visible.sync="moreDialogVisible"
               width="60%">
      <!-- 弹框的主体区域 -->
      <div class="table">
        <table border="1"
               cellpadding='10'>
          <tr>
            <td>订单编号: {{orderbyId.orderCode}}</td>
            <td>订单ID: {{orderbyId.id}}</td>
          </tr>
          <tr>
            <td colspan="2">商品ID: {{orderbyId.productId}}</td>
          </tr>
          <tr>
            <td>卖家ID: {{orderbyId.salerId}}</td>
          </tr>
          <tr>
            <td>买家ID: {{orderbyId.buyerId}}</td>
            <td>买家用户名: {{}}</td>
          </tr>
          <tr>
            <td colspan="2">
              送货地址: {{orderbyId.address}}
            </td>
          </tr>
          <tr>
            <td colspan="2"
                class="orderMessage">订单备注:<p>{{orderbyId.orderRemark}}</p>
            </td>
          </tr>
          <tr>
            <td>支付金额: {{orderbyId.paymentMoney}}</td>
            <td>支付时间: {{orderbyId.paymentTime}}</td>
          </tr>
          <tr>
            <td colspan="2">订单创建时间: {{orderbyId.createTime}}</td>
          </tr>
          <tr>
            <td colspan="2">交易完成时间: {{orderbyId.finishTime}}</td>
          </tr>
          <tr>
            <td colspan="2">最后更新时间: {{orderbyId.updateTime}}</td>
          </tr>
        </table>

      </div>
      <!-- end -->
      <!-- <span slot="footer"
            class="dialog-footer">
        <el-button @click="moreDialogVisible = false"
                   size="mini">关 闭</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      orderTrend: {},    //订单趋势
      orderAmountTrend: {},  //订单总金额趋势
      // 交易方式  下拉选择
      opt: [
        { value: 10, label: '线上交易' },
        { value: 20, label: '线下交易' },
        { value: 30, label: '公益捐赠' }
      ],
      // 搜索条件
      queryInfo: {
        pageSize: 10,
        currentPage: 1,
        searchCondition: {
          // 订单id
          id: '',
          // 订单编号
          orderCode: '',
          // 买家用户名
          // 付款方式
          tradeType: ''
        }
      },
      // 总记录数
      totalCount: 0,
      // 存放订单列表数据
      listObjs: [],
      // 控制查看更多的对话框  默认是关闭的状态
      moreDialogVisible: false,
      // 对话框的表格存储的数据
      orderbyId: {},
      // 交易总量折线  数据
      // transactionOption: {
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   legend: {
      //     data: ['交易总量']
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: this.orderTrend.abscissaUnit,
      //       axisPointer: {
      //         type: 'shadow'
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       name: '交易总量',
      //       min: 0,
      //       max: this.orderAmountTrend.max,
      //       interval: this.orderAmountTrend.interval,
      //       axisLabel: {
      //         formatter: '{value} k'
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '交易总量',
      //       type: 'line',
      //       data: this.orderAmountTrend.max
      //     }
      //   ]
      // },
      // 交易金额和增长趋势
      // transMessOption: {
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   legend: {
      //     data: ['交易金额', '增长趋势']
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: this.orderTrend.abscissaUnit,
      //       axisPointer: {
      //         type: 'shadow'
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       name: '交易金额',
      //       min: 0,
      //       max: 2500,
      //       interval: 200,
      //       axisLabel: {
      //         formatter: '{value} k'
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '增长趋势',
      //       type: 'line',
      //       data: this.orderTrend.totals
      //     },
      //     {
      //       name: '交易金额',
      //       type: 'bar',
      //       data: this.orderTrend.increments
      //     }
      //   ]
      // },
      // 时间段
      time: ''
    }
  },
  created() {
    this.getOrderList()
  },
  mounted() {
    this.inittransaction(4)
    this.time = "最近一周"
    this.changeReq(1)
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      // 再次发起请求
      this.getOrderList()
    },
    // 监听当前页面的变化
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.currentPage = newCurrentPage
      // 再次发起请求
      this.getOrderList()
    },
    // 监听点击搜索的按钮
    getGoodsBySearchCondition() {
      // 发起分页请求
      this.getOrderList()
    },
    // 发起重置请求
    resetSearch() {
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.orderCode = ''
      this.queryInfo.searchCondition.tradeType = ''
      // 发起分页请求
      this.getOrderList()
    },
    // 页面加载发起的数据请求  分页列表请求
    async getOrderList() {
      console.log("查看list", this.queryInfo)
      const { data: res } = await this.$http.post('order/admin/order', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) {
        // 失败
        return this.$Message.error('获取订单信息失败')
      } else {
        // 成功
        this.listObjs = res.data.data
        this.totalCount = res.data.totalCount
        // 提示成功
        this.$Message.success('获取订单信息成功')
      }
    },
    // 监听打开更多的按钮
    async moreOpenDialog(id) {
      // 先发起请求,然后再去打开对话框
      const { data: res } = await this.$http.get(`user/admin/order/${id}`)
      // console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('获取订单信息失败')
      } else {
        // 获取信息成功
        this.orderbyId = res.data
        console.log(this.orderbyId)
        this.$Message.success('获取订单信息成功')
        this.moreDialogVisible = true
      }
    },
    // 渲染交易信息事件
    async inittransaction(type) {
      let transEchart = echarts.init(document.getElementById('transactionMessage'))
      const { data: res } = await this.$http.get(`user/admin/order/total/trend/${type}`)
      if (res.code != 200) {
        return this.$Message.error('查询失败')
      } else {
        this.orderAmountTrend = res.data
        console.log("最大值" + this.orderTrend.max)
      }

      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['交易总量']
        },
        xAxis: [
          {
            type: 'category',
            data: this.orderAmountTrend.abscissaUnit,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '交易总量',
            min: 0,
            max: this.orderAmountTrend.max,
            interval: this.orderAmountTrend.interval,
            axisLabel: {
              formatter: '{value} k'
            }
          }
        ],
        series: [
          {
            name: '交易总量',
            type: 'line',
            data: this.orderAmountTrend.increments
          }
        ]
      }
      transEchart.setOption(option)
    },
    // 渲染交易金额和增长趋势信息
    async inittransMessage(type) {
      let transEchart = echarts.init(document.getElementById('transMessage'))
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['交易金额', '增长趋势']
        },
        xAxis: [
          {
            type: 'category',
            data: this.orderTrend.abscissaUnit,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '交易金额',
            min: 0,
            max: this.orderTrend.max,
            interval: this.orderTrend.interval,
            axisLabel: {
              formatter: '{value} k'
            }
          }
        ],
        series: [
          {
            name: '增长趋势',
            type: 'line',
            data: this.orderTrend.orderTotals
          },
          {
            name: '交易金额',
            type: 'bar',
            data: this.orderTrend.increments
          }
        ]
      }
      transEchart.setOption(option)
    },
    // 时间选择器   这里发起请求
    async changeReq(type) {
      const { data: res } = await this.$http.get(`user/admin/order/amount/trend/${type}`)
      if (res.code != 200) {
        return this.$Message.error('查询失败')
      } else {
        this.orderTrend = res.data
        console.log("最大值" + this.orderTrend.max)
        this.inittransMessage(type)
      }
    }
  }
}
</script>
<style lang="less" scoped>
// 圆的宽和高
@circlewidth: 160px;
@circleheight: 160px;
// 半圆的宽
@circlewidth_half: 80px;
// 圆的radius   应该和半圆的宽值一样
@border-radius: 80px;
// 边框的宽度
@border-width: 12px;
// 边框的颜色
@border-color: #2ecc71;
// 边框的底色
@border-bgc: #9ffcc6;
.container {
  margin: 20px 0;
}
.list_box {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px;
  margin: 10px;
  p {
    margin: 0;
    padding: 0;
  }
  .orderCode {
    margin-left: 10px;
    p {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      line-height: 21px;
    }
  }
  .message {
    margin-left: 20px;
    p {
      font-size: 13px;
      line-height: 21px;
    }
    .time {
    }
    .more_btn {
      height: 36px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      .el-button {
        padding: 2px;
      }
    }
  }
}

// el-tag
.el-tag {
  padding: 0;
  font-size: 12px;
  line-height: 14px;
  height: 16px;
}

// 表格
.table {
  margin: 0 auto;
  table {
    border-collapse: collapse;
    border: none;
    width: 100%;
    tr {
      height: 20px;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      color: #333;
      line-height: 26px;
    }
    // 订单备注
    td.orderMessage {
      p {
        display: inline;
      }
    }
  }
}

// 弹框主体
/deep/.el-dialog__body {
  padding: 20px 30px;
}

//图标区域
.chart {
  height: 500px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

// 页面头部区域
.left_head {
  display: flex;
  justify-content: space-between;
  // position: relative;
  height: 200px;
  // border-bottom: 1px solid #ccc;
  box-shadow: 1px 1px 8px #ddd;
}
div.circle {
  position: relative;
  margin: 10px 50px;
  .wrapper {
    width: @circlewidth_half;
    height: @circleheight;
    position: absolute;
    top: 0;
    overflow: hidden;
    // border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .right_circle {
    right: 0;
  }
  .left_circle {
    left: 0;
  }
}
.circleProgress {
  box-sizing: border-box;
  width: @circlewidth_half;
  height: @circleheight;
  position: absolute;
  top: 0;
}
.rightcircle {
  border-radius: 0 @border-radius @border-radius 0;
  border: solid @border-color;
  border-width: @border-width @border-width @border-width 0;
  right: 0;
  animation: circleProgressLoad_right 1s linear;
  animation-iteration-count: 1;
  animation-iteration-count: 1;
}
.leftcircle {
  border-radius: 0 @border-radius @border-radius 0;
  border: solid @border-color;
  border-width: @border-width @border-width @border-width 0;
  left: 100%;
  transform: rotate(90deg);
  transform-origin: 0;
  animation: circleProgressLoad_left 1s linear;
  animation-iteration-count: 1;
  animation-iteration-count: 1;
}
// 动画

@keyframes circleProgressLoad_right {
  0% {
    transform: rotate(180deg);
    transform-origin: 0;
  }
  50%,
  100% {
    transform: rotate(360deg);
    transform-origin: 0;
  }
}
@keyframes circleProgressLoad_left {
  0%,
  50% {
    transform: rotate(0deg);
    transform-origin: 0;
  }
  100% {
    transform: rotate(90deg);
    transform-origin: 0;
  }
}

.circleTitle {
  width: @circlewidth;
  height: @circleheight;
  font-size: 14px;
  color: #4d4d4d;
  font-weight: 500;
  font-style: normal;
  position: absolute;
  transform: translate(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 10px;
  border: @border-width solid @border-bgc;
  > span {
  }
}
// 左下部
.left_footer {
  height: 280px;
  width: 100%;
  margin: 10px 0;
  padding-top: 10px;
  box-shadow: 1px 1px 8px #ddd;
  #transactionMessage {
  }
}

// 右部
.right {
  position: relative;
  .echartsTitle {
    margin-top: 20px;
    height: 60px;
    line-height: 30px;
    font-size: 20px;
    text-align: center;
  }
  .time_select {
    position: absolute;
    top: 0;
    left: 70%;
    z-index: 999;
    .el-select {
      width: 120px;
    }
  }
}
.right_head {
}
</style>