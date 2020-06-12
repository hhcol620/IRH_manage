<template>
  <div>
    <!-- 商品管理模块 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      <el-breadcrumb-item>公益基金审批</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表区域 -->
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
      <tree-table :data="donationApproveList"
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
        <template slot="operate"
                  slot-scope="scope">
          <el-button type="danger"
                     plain
                     size="mini"
                     @click="toDetail(scope.row.id)">发放资金</el-button>
          <el-button type="primary"
                     plain
                     size="mini"
                     @click="reviewmore(scope.row.id)">更多</el-button>
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
          label: '活动名称',
          prop: 'title',
          width: '120'
        },
        {
          label: '申请金额',
          prop: 'applyAmount',
          width: '120'
        },
        {
          label: '申请时间',
          prop: 'createTime'
        },
        {
          label: '赞成数量',
          prop: 'userUpTotal',
          width: '100'
        },
        {
          label: '不赞成数量',
          prop: 'userDownTotal',
          width: '100'
        },
        {
          label: '审核备注',
          prop: 'remark'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],

      // 分页查询商品信息
      queryInfo: {
        // 当前页
        currentPage: 1,
        pageSize: 10,
        searchCondition: {
          state: 4
        }
      },
      // 需求的记录数
      totalCount: 0,
      // 需求列表
      donationApproveList: []
    }
  },
  created() {
    this.getDonationApproveList()
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newSize) {
      // console.log();
      this.queryInfo.pageSize = newSize
      this.getDonationApproveList()
    },
    // 监听当前页面的切换
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.currentPage = newCurrentPage
      this.getDonationApproveList()
    },
    // 监听搜索按钮
    getDemandsBySearchCondition() {
      this.getDonationApproveList()
    },
    // 监听重置按钮
    resetSearch() {
      this.getDonationApproveList()
    },
    // 请求服务器 得到列表数据
    async getDonationApproveList() {
      const { data: res } = await this.$http.post(
        'order/admin/donation/approve/list',
        this.queryInfo
      )
      console.log(res)
      if (res.code !== 200) {
        // 获取商品数据失败
        return this.$Message.error('加载列表失败')
      } else {
        this.donationApproveList = res.data.data
        console.log(this.donationApproveList)
        this.totalCount = res.data.totalCount
        this.$Message.success('加载列表成功')
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
    },
    // 跳转到详情
    toDetail() {
      this.$router.push(`commonweal_approve_detail`)
    },
    // 更多
    reviewmore() {}
  }
}
</script>
<style lang="less" scoped>
.container_box {
  height: 80px;
  margin: 20px 0px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.main_img_box {
  height: 80px;
  display: flex;
  // justify-content: center;
  padding-left: 20px;
  align-items: center;
}
.main_img {
  height: 60px;
}

// 更多按钮
.delete_btn {
  height: 46px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.goods_message_box {
  .el-row .el-col {
    margin-top: 6px;
    height: 46px;
    overflow: hidden;
  }
}
// 需求
.demand {
  font-size: 14px;
  color: #333;
  line-height: 21px;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  i {
    font-style: normal;
    font-size: 13px;
  }
}
// 发布时间
.time {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  span {
    display: inline-block;
    font-size: 12px;
    color: #333;
    line-height: 21px;
    i {
      font-size: 12px;
    }
  }
}

// 更多
.el-dropdown-menu {
  padding: 0;
  margin: 0;
}
.el-dropdown-menu__item {
  line-height: 30px;
}
.treeTable {
  margin-top: 20px;
}
.el-dialog {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 45%;
    }
  }
}
</style>