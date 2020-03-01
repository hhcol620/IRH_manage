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
        <el-table-column type="index" hidden></el-table-column>
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
export default {
  data() {
    return {
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
      orderbyId: {}
    }
  },
  created() {
    this.getOrderList()
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
      const { data: res } = await this.$http.post(
        'user/admin/order',
        this.queryInfo
      )
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
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>