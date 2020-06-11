<template>
  <div>
    <!-- 商品管理模块 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      <el-breadcrumb-item>公益基金申请审核</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表区域 -->
    <el-card class="container_card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入活动名称"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.title"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入申请人id"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.applyUserId"
                    clearable>
          </el-input>
        </el-col>

        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.state"
                     placeholder="选择审核结果">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getDemandsBySearchCondition">搜索</el-button>
          <el-button class="primary"
                     @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
      <tree-table :data="donationApplyList"
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
                     v-if="scope.row.state === 2"
                     @click="DonationDetailById(scope.row.id)">审核</el-button>
          <el-button type="primary"
                     plain
                     size="mini"
                     @click="DonationDetailById(scope.row.id)">更多</el-button>
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

    <!-- 修改用户对话框 -->
    <el-dialog title="审核"
               :visible.sync="editDialogVisible"
               width="65%">
      <el-form :model="donationDetail"
               ref="editFormRef"
               label-width="150px">
        <el-form-item label="编号">
          <el-input v-model="donationDetail.id"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="donationDetail.title"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人"
                      prop="applyUserId">
          <el-input v-model="donationDetail.applyUser.nickname"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="申请金额"
                      prop="applyAmount">
          <el-input v-model="donationDetail.applyAmount"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="申请理由"
                      prop="reason">
          <el-input v-model="donationDetail.reason"
                    readonly
                    type="textarea"
                    :rows="2"
                    resize="none"></el-input>
        </el-form-item>
        <el-form-item label="支持次数"
                      prop="reason">
          <el-input v-model="donationDetail.userUpTotal"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="不支持次数"
                      prop="reason">
          <el-input v-model="donationDetail.userDownTotal"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="证明人姓名"
                      prop="witnessName">
          <el-input v-model="donationDetail.witnessName"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="证明人电话"
                      prop="witnessPhone">
          <el-input v-model="donationDetail.witnessPhone"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="提交时间"
                      prop="createTime">
          <el-input v-model="donationDetail.createTime"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="证明材料"
                      prop="createTime">
          <!-- <img :src="$store.state.ImgUrl + donationDetail.reasonPicUrl"
               alt=""> -->
          <el-image style="width: 100px;"
                    :src="$store.state.ImgUrl + donationDetail.reasonPicUrl"
                    :preview-src-list="[$store.state.ImgUrl + donationDetail.reasonPicUrl]">
          </el-image>
        </el-form-item>

        <el-form-item v-if="donationDetail.state === 2"
                      label="审核反馈"
                      prop="remark">
          <el-input v-model="updateDonation.remark"
                    type="textarea"
                    :rows="2"
                    resize="none"
                    placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item v-if="donationDetail.state === 3"
                      label="审核人"
                      prop="remark">
          <el-input v-model="updateDonation.approveId"
                    disabled></el-input>
        </el-form-item>

        <el-form-item v-if="donationDetail.state === 3"
                      label="审核反馈"
                      prop="remark">
          <el-input v-model="updateDonation.remark"
                    disabled></el-input>
        </el-form-item>

        <el-form-item v-if="donationDetail.state === 2"
                      label="审核结果"
                      prop="state">
          <el-select v-model="updateDonation.state"
                     placeholder="审核结果">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">关闭</el-button>
        <el-button type="primary"
                   v-if="donationDetail.state === 2"
                   @click="updateInfo">提交审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 1-删除  2-审核中  3-失败  4-审核通过 5-已转账
      opt: [
        {
          value: 3,
          label: '失败'
        },
        {
          value: 4,
          label: '审核通过'
        }
      ],
      editDialogVisible: false,
      columns: [
        {
          label: '活动名称',
          prop: 'title'
        },
        {
          label: '申请人',
          prop: 'applyUserId',
          width: '80'
        },
        {
          label: '申请金额',
          prop: 'applyAmount'
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
          label: '状态',
          prop: 'state'
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
          title: '',
          state: '',
          applyUserId: ''
        }
      },
      // 需求的记录数
      totalCount: 0,
      // 需求列表
      donationApplyList: [],
      donationDetail: {
        applyUser: {}
      },
      updateDonation: {}
    }
  },
  created() {
    this.getDonationApplyList()
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getDonationApplyList()
    },
    // 监听当前页面的切换
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.currentPage = newCurrentPage
      this.getDonationApplyList()
    },
    // 监听搜索按钮
    getDemandsBySearchCondition() {
      this.getDonationApplyList()
    },

    async updateInfo() {
      this.updateDonation.id = this.donationDetail.id
      this.updateDonation.applyUserId = this.donationDetail.applyUserId
      const { data: res } = await this.$http.post(
        `order/admin/donation/approve`,
        this.updateDonation
      )
      console.log(res)
      this.editDialogVisible = false
      this.getDonationApplyList()
    },

    async DonationDetailById(id) {
      const { data: res } = await this.$http.get(
        `order/donation/detail/2/${id}`
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('操作失败,请稍后重试')
      } else {
        // 成功
        this.donationDetail = res.data

        const userId = res.data.applyUserId
        if (userId !== null && userId !== undefined) {
          const { data: userInfo } = await this.$http.get(`user/user/${userId}`)
          if (userInfo.code === 200) {
            this.donationDetail.applyUser = userInfo.data
          }
        }

        // this.donationDetail.
        this.editDialogVisible = true
      }
    },
    // 监听重置按钮
    resetSearch() {
      this.queryInfo.searchCondition.state = ''
      this.queryInfo.searchCondition.title = ''
      this.queryInfo.searchCondition.applyUserId = ''
      this.getDonationApplyList()
    },
    // 请求服务器 得到列表数据
    async getDonationApplyList() {
      const { data: res } = await this.$http.post(
        'order/admin/donation/apply/list',
        this.queryInfo
      )
      console.log(res)
      if (res.code !== 200) {
        // 获取商品数据失败
        return this.$Message.error('加载申请列表失败')
      } else {
        this.donationApplyList = res.data.data
        console.log(this.donationApplyList)
        this.totalCount = res.data.totalCount
        this.$Message.success('加载申请列表成功')
      }
    }
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
.container_card {
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