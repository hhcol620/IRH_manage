<template>
  <div>
    <!-- 这是举报列表组件 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>举报列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入举报人ID"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.customerId"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入反馈备注"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.remark"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.data"
                     placeholder="请选择处理结果"
                     @change="selectChange">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getReportsBySearchCondition">搜索</el-button>
          <el-button class="primary"
                     @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
      <div class="container">
        <el-tabs @tab-click="handleClick"
                 v-model="value_type">
          <el-tab-pane v-for="(item,index) in options"
                       :key="index"
                       :label="item.label"
                       :name="item.value+''">
            <!-- 循环显示数据，点击可以弹框显示具体的内容 -->
            <div v-for="item in reportList"
                 :key="item.id">
              <el-row :gutter="10">
                <el-col :span="3"
                        :class="['time',item.result === 1 ?'timefailColor':(item.result === 2?'timeprocessColor':(item.result === 3? 'timewarningColor':(item.result === 4?'timefreezeColor':'timedeleteColor')))] ">
                  <p>{{item.createTime|timeSplit}}</p>
                </el-col>
                <el-col :span="20"
                        class="list_content">
                  <el-row class="content_box">
                    <p>ID为{{item.id}}的
                      <span>{{item.type|report_type_format}} </span>举报:
                      <i>{{item.remark}}</i>
                    </p>
                  </el-row>
                  <el-row class="stateBtn">
                    <el-col class="box_btn"
                            :span="10">
                      <span>举报人ID: <i>{{item.customerId}}</i></span>
                      <span>处理状态: <i>{{item.result|report_result_format}}</i></span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>

          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 30, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    /* 
     result[0].type   1-商品举报 2-留言举报 3-评价举报 4-帖子举报
    */
    return {
      // 举报类型对应
      options: [
        {
          value: '1',
          label: '商品举报'
        },
        {
          value: '2',
          label: '留言举报'
        },
        {
          value: '3',
          label: '评价举报'
        },
        {
          value: '4',
          label: '帖子举报'
        }
      ],

      //
      // 处理结果    1-举报失败 2-处理中 3-警告 4-冻结账号 5-删除相关内容
      opt: [
        {
          value: '1',
          label: '举报失败'
        },
        {
          value: '2',
          label: '处理中'
        },
        {
          value: '3',
          label: '警告'
        },
        {
          value: '4',
          label: '冻结账号'
        },
        {
          value: '5',
          label: '删除相关内容'
        }
      ],

      // 下拉框的值
      value_type: '1',
      // table页默认位置
      activeName: 'messages',
      // 请求参数    分页查询
      queryInfo: {
        // 当前页
        currentPage: 1,
        // 页面大小
        pageSize: 2,
        // result[0].type   1-商品举报 2-留言举报 3-评价举报 4-帖子举报
        // result: [{ type: 1 }],
        // 查询条件
        searchCondition: {
          //todo consumerId报错
          // 举报人 id
          customerId: '',
          // 举报反馈表的id
          id: '',
          // 反馈备注
          remark: '',
          // 举报的类型     1-商品举报 2-留言举报 3-评价举报 4-帖子举报
          type: 1,
          // 处理结果    1-举报失败 2-处理中 3-警告 4-冻结账号 5-删除相关内容
          result: ''
        }
      },
      // 分页查询返回的数据
      reportList: {},
      // 数据总条数
      totalCount: 0
    }
  },
  // 页面加载就执行
  created() {
    //分页查询举报的数据
    this.getReportsBySearchCondition()
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getReportsBySearchCondition()
    },
    // 监听页面的当前页数的变化
    handleCurrentChange(newCurrentPage) {
      // console.log(newCurrentPage)
      this.queryInfo.currentPage = newCurrentPage
      this.getReportsBySearchCondition()
    },
    // table的切换
    handleClick() {
      this.queryInfo.searchCondition.type = this.value_type - 0
      // console.log('ok')
      // 当切换tab栏就应该重新获取了
      this.getReportsBySearchCondition()
    },
    // 监听下拉框的选择
    selectChange() {
      // console.log(this.queryInfo.searchCondition.type)
      // 当下拉框发生变化，重新获取数据
      this.getReportsBySearchCondition()
    },
    // 分页查询所有的举报
    async getReportsBySearchCondition() {
      const { data: res } = await this.$http.post(
        'user/admin/report/statisic',
        this.queryInfo.searchCondition
      )
      // console.log(res)
      if (res.code !== 200) {
        // 获取失败
        return this.$Message.error('获取举报列表信息失败')
      } else {
        // 获取成功
        this.reportList = res.data.data
        this.totalCount = res.data.totalCount
        // res.console.log(this.reportList)
      }
    },
    // 搜索重置
    resetSearch() {
      // 搜索框的重置
      this.queryInfo.searchCondition.customerId = ''
      this.queryInfo.searchCondition.remark = ''
      // tab栏的重置
      this.value_type = 1 + ''
      // 下拉框的内容重置
      this.queryInfo.searchCondition.data = ''
      // 重置之后，重新获取列表
      this.getReportsBySearchCondition()
    }
  }
}
</script>
<style lang="less" scoped>
// 定义四种颜色  分别表示 举报失败  处理中  警告  冻结账号 删除内容
// 举报失败
@failColor: #34495e;
// 处理中
@processColor: #1abc9c;
// 警告
@warningColor: #f1c40f;
// 冻结账号
@freezeColor: #95a5a6;
// 删除内容
@deleteColor: #e74c3c;

.container {
  margin: 20px 0 20px 0;
}
.timefailColor {
  background-color: @failColor;
}
.timeprocessColor {
  background-color: @processColor;
}
.timewarningColor {
  background-color: @warningColor;
}
.timefreezeColor {
  background-color: @freezeColor;
}
.timedeleteColor {
  background-color: @deleteColor;
}
.time {
  margin: 10px 0 10px 20px;
  height: 100px;
  color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  text-align: center;
  line-height: 12px;
  p:nth-child(1) {
    font-size: 26px;
  }
  p:nth-child(2) {
    font-size: 14px;
  }
}
.list_content {
  height: 100px;
  margin: 10px 0 10px 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  .content_box {
    p {
      margin: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      span {
        color: #e74c3c;
        font-size: 15px;
        line-height: 20px;
      }
      i {
        display: block;
        margin: 5px 0 0 20px;
        width: 80%;
        font-style: normal;
        color: #333;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .stateBtn {
    display: flex;
    justify-content: flex-end;
    .box_btn {
      span {
        font-size: 14px;
        margin: 10px;
        i {
          font-size: 14px;
          font-style: normal;
          color: #e74c3c;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>