<template>
  <div>
    <!-- 这是举报列表组件 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        反馈及审核
      </el-breadcrumb-item>
      <el-breadcrumb-item>信息发布审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入发布信息者ID"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.releaseUserId"
                    clearable>
          </el-input>
        </el-col>

        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入审核人ID"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.title"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.state"
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
                     @click="getReportsBySearch_num">搜索</el-button>
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
            <div v-for="item in examinationList"
                 :key="item.id"
                 @click="jumpPage(item.targetId)">
              <el-row :gutter="10">
                <el-col :span="20"
                        class="list_content">
                  <el-row class="content_box">
                    <p>ID为{{item.targetId}}的
                      <span>{{item.type|report_type_format}} </span>AI审核反馈:
                      <i>{{item.remark}}</i>
                    </p>
                  </el-row>
                  <el-row class="stateBtn">
                    <el-col class="box_btn"
                            :span="10">
                      <span v-if="item.createTime">审核时间: <i>{{item.createTime}}</i></span>
                    </el-col>
                  </el-row>
                  <el-row class="stateBtn">
                    <el-col class="box_btn"
                            :span="10">
                      <span v-if="item.approveRemark">人工审核反馈: <i>{{item.approveRemark}}</i></span>
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
            label: '商品发布审核'
          },
          {
            value: '2',
            label: '需求发布审核'
          },
          {
            value: '3',
            label: '文章发布审核'
          }
        ],

        opt: [
          {
            value: 1,
            label: '成功'
          },
          {
            value: 2,
            label: 'AI审核失败'
          },
          {
            value: 3,
            label: '人工审核失败'
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
          pageSize: 10,
          // 查询条件
          searchCondition: {
            type: 1,
            state: 2,
            title: '',
            releaseUserId:''
          }
        },
        // 分页查询返回的数据
        examinationList: {},
        // 数据总条数
        totalCount: 0
      }
    },
    // 页面加载就执行
    created() {
      //分页查询举报的数据
      this.getExaminationList()
    },
    methods: {
      // 监听页面大小的变化
      handleSizeChange(newPageSize) {
        this.queryInfo.pageSize = newPageSize
        this.getExaminationList()
      },
      // 监听页面的当前页数的变化
      handleCurrentChange(newCurrentPage) {
        this.queryInfo.currentPage = newCurrentPage
        this.getExaminationList()
      },
      // table的切换
      handleClick() {
        this.queryInfo.searchCondition.type = this.value_type - 0
        // 当切换tab栏就应该重新获取了
        this.getExaminationList()
      },
      // 监听下拉框的选择
      selectChange() {
        // console.log(this.queryInfo.searchCondition.type)
        // 当下拉框发生变化，重新获取数据
        this.getExaminationList()
      },
      // 分页查询所有的举报
      async getExaminationList() {
        const { data: res } = await this.$http.post(
                'user/admin/examine',
                this.queryInfo
        )
        // console.log(res)
        if (res.code !== 200) {
          return this.$Message.error('获取举报列表信息失败')
        } else {
          // 获取成功
          this.examinationList = res.data.data
          this.totalCount = res.data.totalCount
          console.log(this.examinationList)
        }
      },

      async getReportsBySearch_num() {
        const res = await this.$http.post('user/admin/examine')
        console.log(res)
        if (res.data.code !== 200) {
          return this.$Message.error('搜索失败')
        }
        this.examinationList = res.data.data
        this.totalCount = res.data.data.totalCount
      },
      // 搜索重置
      resetSearch() {
        // 搜索框的重置
        this.queryInfo.searchCondition.title = ''
        this.queryInfo.searchCondition.releaseUserId = ''
        this.queryInfo.searchCondition.state = ''
        // tab栏的重置
        this.value_type = 1 + ''
        // 下拉框的内容重置
        // 重置之后，重新获取列表
        this.getExaminationList()
      },
      // 跳转到举报的详情页面 把id传过来
      jumpPage(id) {
        this.$router.push(`/ReleaseInfoExamination_detail?targetId=${id}&type=${this.queryInfo.searchCondition.type}`)
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
    margin: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
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