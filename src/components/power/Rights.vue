<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 根据关键字搜索 添加权限 -->
      <el-row :gutter='20'>
        <el-col :span="6">
          <el-input placeholder="请输入权限名"
                    v-model="queryInfo.searchCondition.authName"
                    class="input-with-select"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchByName"></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <div class="block">
            <el-date-picker
                    v-model="searchEndTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="注册开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="rightsList"
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称"
                         prop="authName"></el-table-column>
        <el-table-column label="权限ID"
                         prop="id"></el-table-column>
        <el-table-column label="权限描述"
                         prop="authDesc"></el-table-column>
        <el-table-column label="权限状态"
                         prop="state">
          <template scope="scope">
            <!-- {{scope.row.state}} -->
            <!-- 禁用是1   启用是2 -->
            <el-tooltip placement="top-start"
                        effect="dark"
                        :enterable="false"
                        :content="scope.row.state === 1?'启用':'禁用'">

              <el-switch v-model="scope.row.state"
                         :inactive-value="1"
                         :active-value="2"
                         @change="switch_state_submit(scope.row)">

              </el-switch>
            </el-tooltip>

          </template>
        </el-table-column>
        <el-table-column label="更新时间"
                         prop="updateTime"></el-table-column>
        <el-table-column label="操作"
                         prop="">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 20, 50]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount"></el-pagination>
    </el-card>

    <!-- 修改权限对话框 -->
    <el-dialog title="修改权限信息"
               :visible.sync="editDialogVisible"
               width="60%">
      <el-form :model="editList">
        <el-form-item hidden label="权限id"
                      prop="id">
          <el-input v-model="editList.id"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="父权限id"
                      prop="id">
          <el-input v-model="editList.parentId"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="权限名称"
                      prop="id">
          <el-input v-model="editList.authName"
                    ></el-input>
        </el-form-item>

        <el-form-item label="请求方式"
                      prop="id">
          <el-input v-model="editList.httpMethod"
          disabled></el-input>
        </el-form-item>

        <el-form-item label="权限描述"
                      prop="id">
          <el-input v-model="editList.authDesc"
                    disabled></el-input>
        </el-form-item>

        <el-form-item prop="id">
          <el-row :gutter="20">
            <el-col :span="4" ><el-form-item label="创建时间"><el-input v-model="editList.createTime" disabled></el-input></el-form-item></el-col>
            <el-col :span="4" ><el-form-item label="最后一次更新时间"><el-input v-model="editList.updateTime" disabled></el-input></el-form-item></el-col>
          </el-row>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogSubmit">确 定</el-button>
        <!-- 确定这个地方应该是一个双向绑定的表单,点击确定先进行表单预验证,然后进行提交服务器通过状态码判断是否提交成功 -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分页查询
      queryInfo: {
        // 查询关键字
        searchCondition: {
          authName: '',
          id: '',
          state: ''
        },
        // 当前页码
        currentPage: 1,
        // 页面大小
        pageSize: 10
      },
      totalCount: 0,
      // 所有的权限列表
      rightsList: [],
      editFormData: {},
      editDialogVisible: false,
      // 存储dialog对话框的数据内容
      editList: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchStartTime: '',
      searchEndTime: ''
    }
  },
  // 声明周期函数  发起数据请求
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 解构赋值
      const { data: res } = await this.$http.post('user/admin/auth/list', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.code !== 200) {
        // 请求失败,提示用户请求权限列表失败
        return this.$Message.error('加载权限列表失败,请稍后重试')
      } else {
        // 请求成功
        // 将响应的数据存入权限列表 rightsList
        this.rightsList = res.data.data
        this.totalCount = res.data.totalCount
        this.$Message.success('加载权限列表成功')
        // console.log(this.rightsList)
      }
    },
    // 监听pageSize 改变的事件
    handleSizeChange(newSize) {
      // console.log('页码发生了变化')
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getRightsList()
    },
    // 监听CurrentPage 改变的事件
    handleCurrentChange(currentPage) {
      // console.log('当前页面发生了变化')
      // console.log(currentPage)
      this.queryInfo.currentPage = currentPage
      this.getRightsList()
    },
    // 搜索框输入关键字  搜索事件
    searchByName() {
      // console.log(this.queryInfo.searchCondition.authName)
      // 重新发起请求,重新获取权限列表
      this.getRightsList()
    },
    // 权限状态的修改
    async switch_state_submit(row) {
      //权限状态的修改
      // console.log(state, authId)
      // 获取到了最新的状态值,然后就可以发起请求了
      const { data: res } = await this.$http.delete(
        `user/admin/auth/${row.id}/${row.state}`
      )
      // console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('修改权限状态失败')
      } else {
        // 修改权限状态成功
        // 提示用户修改成功
        this.$Message.success('修改权限状态成功')
        // 刷新列表
        this.getRightsList()
      }
    },
    // 打开权限编辑对话框 *************接口有部分内容缺失******
    async showEditDialog(authId) {
      // 先发起根据id发起请求
      const { data: res } = await this.$http.get(`user/admin/auth/${authId}`)
      // console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('加载权限信息失败')
      } else {
        // 加载信息成功,然后打开dialog对话框
        this.editList = res.data;
        this.editDialogVisible = true;
        console.log(res)
      }
    },
    // 提交修改后的权限信息
    async editDialogSubmit() {
      const { data: res } = await this.$http.put(
              `user/admin/auth`, this.editList
      )
      // console.log(res)
      if (res.code !== 200) {
        // 则证明,修改管理员的状态失败
        return this.$Message.error('修改失败')
      }
      // 证明修改管理员状态成功
      this.$Message.success('修改成功')
      // 关闭dialog对话框
      this.editDialogVisible = false
      this.getRightsList();
    }
  }
}
</script>
<style lang="less" scoped>
</style>