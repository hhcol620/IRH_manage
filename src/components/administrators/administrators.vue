<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入管理员名字"
                    v-model="queryInfo.searchCondition.name"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
            <!-- <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchByquery(queryInfo.query)"></el-button> -->
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入管理员ID"
                    v-model="queryInfo.searchCondition.id"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入管理员身份"
                    v-model="queryInfo.searchCondition.type"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="searchByquery(queryInfo.query)">搜索</el-button>
          <el-button class="primary"
                     @click="resetQuery()">重置</el-button>
        </el-col>
        <el-col :span="5"
                class="addAdminBox">
          <el-button type="primary"
                     class="addAdminBtn"
                     @click="addAdmin">添加管理员</el-button>
        </el-col>

      </el-row>
      <!-- 管理员列表区域 -->
      <el-table :data="adminList"
                stripe
                border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="roleListTag">
              <div class="tag"
                   v-for="(item,index) in scope.row.roleList"
                   :key="index">
                <el-tooltip class="item"
                            effect="dark"
                            :content="item.roleDesc"
                            placement="top"
                            :enterable="false">
                  <el-tag closable
                          @close="removeRoleById(item.id)">{{item.roleName}}</el-tag>
                </el-tooltip>

              </div>
            </div>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name"
                         label="姓名"></el-table-column>
        <el-table-column prop="id"
                         label="ID"></el-table-column>
        <el-table-column prop="desc"
                         label="描述"></el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间">
        </el-table-column>
        <el-table-column prop="type"
                         label="身份"></el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeAdminById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>

    </el-card>

    <!-- 添加管理员的对话框 -->
    <el-dialog title="添加管理员"
               :visible.sync="addDialogVisible"
               width="60%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item label="管理员名称"
                      prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="身份"
                      prop="type">
          <el-select v-model="addForm.type"
                     placeholder="请选择身份">
            <el-option label="服务人员"
                       value="shanghai"></el-option>
            <el-option label="校园组织"
                       value="shanghai"></el-option>
            <el-option label="公益组织"
                       value="shanghai"></el-option>
            <el-option label="校园社团"
                       value="shanghai"></el-option>
            <el-option label="管理员"
                       value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述"
                      prop="desc">
          <el-input type="textarea"
                    v-model="addForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addAdminReq">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改管理员信息的对话框 -->
    <el-dialog title="提示"
               :visible.sync="editDialogVisible"
               width="60%">
      <span>这是一段信息</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    /* 
      验证密码的校验规则
      cb回调函数
     */
    var checkPassword = (rules, value, cb) => {
      const password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/
      if (password.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('至少包含一位大写字母和一位小写字母和数字'))
    }
    return {
      // 获取管理员列表参数对象
      queryInfo: {
        // 搜索关键字
        searchCondition: {
          id: '',
          name: '',
          roleList: [],
          // 身份
          type: ''
        },
        // 当前的页数
        currentPage: 1,
        // 当前每页多少条数据
        pageSize: 2,
        result: []
      },
      // 数据总条数
      totalCount: 0,
      // 管理员信息表
      adminList: [],
      listObj: [],
      // 添加管理员弹框
      addDialogVisible: false,
      // 添加管理员信息
      // 添加管理员的表单信息
      addForm: {
        name: '',
        password: '',
        type: '',
        desc: ''
      },
      // 添加管理员表单的规则验证对象
      addFormRules: {
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur'
          },
          { validator: checkPassword, trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择身份', trigger: 'change' }],
        desc: []
      },
      // 编辑管理员信息的对话框
      editDialogVisible: false
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    // 发起请求  获取管理员信息并存到 adminList
    async getAdminList() {
      // 解构赋值  data重命名为res
      const { data: res } = await this.$http.post(
        'admin/list/1',
        this.queryInfo
      )
      if (res.code != 200) return this.$Message.error('获取管理员列表失败')
      console.log(res)
      // this.console.log(res.data.result)
      this.adminList = res.data.result
      this.totalCount = res.data.totalCount
    },
    // 标签上面点击删除执行下面方法
    // 根据id删除管理员下角色
    async removeRoleById(roleId) {
      // 弹框提示用户是否要删除
      const confimResult = await this.$confirm(
        '此操作将永久删除该文件,是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confimResult != 'confirm') {
        return this.$Message.info('取消了删除')
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete(`/role/${roleId}`)
      console.log(res)
      // 请求接口暂时不对, 后期需要修改######################
      if (res.code !== 200) {
        return console.log('no')
      }
      // 删除之后重新发起请求,获取管理员列表
      this.getAdminList()
    },
    // 根据关键字查询管理员
    async searchByquery(id) {
      const { data: res } = await this.$http.get(`/admin/${id}`)
      // console.log(res)
      if (res.code !== 200) return this.$Message.error('查找失败')
      else {
        this.$Message.success('查找成功')
        this.listObj.push(res.data)
        this.adminList = this.listObj
        console.log(this.adminList)
      }
    },
    // 管理员状态   监听switch按钮的变化
    adminStateChanged(adminInfo) {
      // console.log(adminInfo)
      // 当switch发生变化,也就是状态发生改变了,这个时候发起请求,存储到后台
      console.log(adminInfo)
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getAdminList()
    },
    // 监听页码值发生切换
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.currentPage = newPage
      this.getAdminList()
    },
    // 重置所有的输入框
    resetQuery() {
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.name = ''
      this.queryInfo.searchCondition.type = ''
    },
    // 添加管理员
    addAdmin() {
      console.log('添加管理员')
      this.addDialogVisible = true
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      //对话框关闭,触发
      console.log('对话框关闭了')
      this.$refs.addFormRef.resetFields()
    },
    // 发起添加管理员的请求
    addAdminReq() {
      // 发起添加管理员的请求之前,首先先进行数据验证
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          // 如果数据验证不通过,下面的请求也就不能发起
          return
        } else {
          // 数据验证通过,可以发起请求
          const { data: res } = await this.$http.post('admin', this.addForm)
          // console.log(res.code)
          if (res.code !== 200) {
            return this.$Message.error('添加失败')
          }
          this.$Message.success('添加管理员信息成功')
          // 添加成功之后隐藏对话框
          this.addDialogVisible = false
          // 刷新列表  重新列表数据
          this.getAdminList()
        }
      })
    },
    // 修改管理员信息对话框
    async showEditDialog(id) {
      console.log(id)
      /* 
        在弹框之前首先发起请求,根据id查询管理员信息
      */
      const { data: res } = await this.$http.put('admin', { id })
      console.log(res)
      // 请求成功,将请求过来的数据渲染到页面上也就是弹出的对话框里面
      this.editDialogVisible = true
    },
    // 根据id删除对应的用户
    async removeAdminById(id) {
      // console.log(id)
      //先进行弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该管理员, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$Message.info('取消了删除')
      } else {
        // 点击了确认,就可以发起了请求
        const { data: res } = await this.$http.put('admin', { id })
        if (res.code !== 200) return this.$Message.error('删除失败,请稍后重试!')
        this.$Message.success(`删除ID为${id}管理员成功!`)
        // 删除成功之,再次发情获取管理员列表的请求
        this.getAdminList()
      }
    }
  }
}
</script>
<style lang="less">
.roleListTag {
  display: flex;
  flex-direction: wrap;
  justify-content: flex-start;
  .tag {
    margin: 6px;
  }
}
.el-pagination__total {
  margin: 0 20px;
}

// 设置添加管理员按钮左对齐
.addAdminBox {
  // float: right;
  display: flex;
  justify-content: flex-end;
}
</style>