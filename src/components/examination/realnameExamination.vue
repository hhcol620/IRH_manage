<template>
    <div>
        <!-- 这是帖子管理 -->
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>实名认证审核</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input v-model="queryInfo.searchCondition.userId"
                              placeholder="用户ID"
                              clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="queryInfo.searchCondition.approveId"
                              placeholder="审核人ID"
                              clearable></el-input>
                </el-col>

                <el-col :span="5">
                    <!--搜索框-->
                    <el-select v-model="queryInfo.searchCondition.state"
                               placeholder="认证状态">
                        <el-option v-for="item in opt"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"
                               @click="getRecordList">搜索</el-button>
                    <el-button @click="reset_Search">重置</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="recordList"
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
                               @click="approveUser(scope.row)">审核</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.currentPage"
                           :page-sizes="[10, 30, 50, 100]"
                           :page-size="queryInfo.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>


        <!-- 修改用户对话框 -->
        <el-dialog title="审核"
                   :visible.sync="editDialogVisible"
                   width="65%">
            <el-form :model="recordDetailInfo"
                     ref="editFormRef"
                     label-width="70px">
                <el-form-item label="编号">
                    <el-input v-model="recordDetailInfo.id"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="用户id">
                    <el-input v-model="recordDetailInfo.userId"
                              disabled></el-input>
                </el-form-item>
                <el-form-item label="输入名称"
                              prop="applyUserId">
                    <el-input v-model="recordDetailInfo.inputName" disabled></el-input>
                </el-form-item>
                <el-form-item label="输入账号"
                              prop="applyAmount">
                    <el-input v-model="recordDetailInfo.inputCardNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="图片"
                              prop="createTime">
                    <img :src="$store.state.ImgUrl + recordDetailInfo.picuri"
                         alt="">
                </el-form-item>

                <el-form-item label="输入审核备注"
                              prop="applyAmount">
                    <el-input v-model="updateRecord.remark"></el-input>
                </el-form-item>

                <el-form-item label=""
                              prop="state">
                    <el-select v-model="updateRecord.state"
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
                   @click="updateInfo">提交审核</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        editDialogVisible: false,
        //1-认证中  2-认证成功  3-认证失败
        opt: [
          {
            value: '1',
            label: '认证中'
          },
          {
            value: '2',
            label: '认证成功'
          },
          {
            value: '3',
            label: '认证失败'
          }],
        updateRecord:{},
        queryInfo: {
          currentPage: 1,
          pageSize: 10,
          searchCondition: {
            id: '',
            state: '',
            approveId:'',
            userId:''
          }
        },
        recordDetailInfo:{},
        recordList: [],
        // 总数据条数
        total: 0,
        // 为table指定列的定义
        columns: [
          {
            label: '用户id',
            prop: 'userId'
          },
          {
            label: '认证类型',
            prop: 'type'
          },
          {
            label: '认证状态',
            prop: 'state'
          },{
            label:'时间',
            prop:'createTime'
          },
          {
            label: '操作',
            type: 'template',
            template: 'operate'
          }
        ]
      }
    },
    created() {
      // 生命周期函数内调用这个方法  获取列表
      this.getRecordList()
    },
    methods: {
      // 获取帖子列表
      async getRecordList() {
        this.recordList = []
        const { data: res } = await this.$http.post(
          'security/admin/authen',
          this.queryInfo
        )
        if (res.code !== 200) {
          return this.$Message.error('获取信息失败')
        }
        this.recordList = res.data.data
        this.total = res.data.totalCount
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getRecordList()
      },
      // 监听currentPage改变
      handleCurrentChange(newPage) {
        this.queryInfo.currentPage = newPage
        this.getRecordList()
      },
      // 监听搜索框重置
      reset_Search() {
        //  先重置输入框  再发起数据请求,获取最新的列表
        this.queryInfo.searchCondition.id = ''
        this.queryInfo.searchCondition.state = ''
        this.queryInfo.searchCondition.userId =''
        this.queryInfo.searchCondition.approveId =''
        this.getRecordList()
      },
      // 监听删除文章
      async approveUser(param) {
        this.recordDetailInfo = param
        this.editDialogVisible = true
      },

      async updateInfo(){
        let id = this.recordDetailInfo.id
        this.updateRecord.id = id
        const { data: res } = await this.$http.post(
          'security/admin/authen/approve',
          this.updateRecord
        )
        this.editDialogVisible = false
        if(res.code !== 200){
          this.$Message.error('操作失败')
        }else{
          this.$Message.error('操作失败')
        }
        this.editDialogVisible = false
      },
      async getUserName(userId){
        const { data: res } = await this.$http.get(`user/user/${userId}`)
        if(res.code != 200) return;
        return res.text;
      }
    }
  }
</script>
<style lang="less" scoped>
    .treeTable {
        margin-top: 15px;
    }

    .more_icon {
        margin: 0;
        padding: 0;
        li {
            text-align: center;
            float: left;
            list-style: none;
            height: 20px;
            margin: 4px;
            font-size: 12px;
            line-height: 20px;
            font-style: normal;
            color: #666;
            > i.iconfont {
                line-height: 20px;
                margin: 0 2px;
                font-size: 12px;
                color: #666;
            }
        }
    }
</style>