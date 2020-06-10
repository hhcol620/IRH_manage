<template>
  <!-- 商品管理模块 -->
  <!-- 面包屑导航区域 -->
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
    <el-breadcrumb-item>审核信息</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span="5">
        <!--搜索框-->
        <el-input placeholder="请输入需求"
                  class="input-with-select"
                  v-model="queryInfo.searchCondition.productName"
                  clearable>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary"
                   @click="getDemandsBySearchCondition">搜索</el-button>
        <el-button class="primary"
                   @click="resetSearch">重置</el-button>
      </el-col>
    </el-row>
    <tree-table :data="examineList"
                :columns="columns"
                :selection-type='false'
                :expand-type='false'
                show-index
                index-text='#'
                border
                :show-row-hover="false"
                :tree-type="true"
                children-prop="childs"
                class="treeTable">
      <!-- 操作 -->
      <!-- 操作 -->
      <template slot="opt"
                slot-scope="scope">
        <el-button type="primary"
                   plain
                   size="mini"
                   @click="articleApprove(scope.row.targetId)">人工审核</el-button>
      </template>
    </tree-table>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 需求商品新旧程度表   为下拉菜单提供
        columns: [
          {
            label: '商品标题',
            prop: 'title'
          },
          {
            label: '发布时间',
            prop: 'createTime'
          },
          {
            label: 'AI审核反馈',
            prop: 'remark'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],

        // 分页查询商品信息
        queryInfo: {
          // 当前页
          currentPage: 1,
          pageSize: 10,
          searchCondition: {
            state: 2,
            type: 1
          }
        },
        // 需求的记录数
        totalCount: 0,
        // 需求列表
        examineList: []
      }
    },
    created() {
      this.articleExamineList()
    },
    methods: {
      // 监听页面大小的变化
      handleSizeChange(newSize) {
        // console.log();
        this.queryInfo.pageSize = newSize
        this.articleExamineList()
      },
      // 监听当前页面的切换
      handleCurrentChange(newCurrentPage) {
        this.queryInfo.currentPage = newCurrentPage
        this.articleExamineList()
      },
      // 监听搜索按钮
      getDemandsBySearchCondition() {
        this.articleExamineList()
      },

      articleApprove(id){

      },
      // 监听重置按钮
      resetSearch() {
        this.articleExamineList()
      },
      // 请求服务器 得到列表数据
      async articleExamineList() {
        const { data: res } = await this.$http.post(
                'user/admin/examine',
                this.queryInfo
        )
        console.log(res)
        if (res.code !== 200) {
          // 获取商品数据失败
          return this.$Message.error('加载文章审核列表失败')
        } else {
          this.examineList = res.data.data
          console.log(this.examineList)
          this.totalCount = res.data.totalCount
          this.$Message.success('加载文章审核列表成功')
        }
      },
      // 监听审核按钮
      async approve(id) {
        // console.log(id)
        // 弹框提示用户是否要删除
        const confimResult = await this.$confirm(
                '此操作将删除该需求,是否继续',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
        ).catch(err => err)
        if (confimResult != 'confirm') {
          return this.$Message.info('取消')
        }
        // console.log('确认了')
        const { data: res } = await this.$http.delete(`user/admin/goods/${id}`)
        if (res.code !== 200) {
          // 失败
          return this.$Message.error('删除失败,请稍后重试')
        } else {
          // 成功
          this.$Message.success('删除成功!!!')
          this.getGoods()
        }
      }
    }
  }
</script>