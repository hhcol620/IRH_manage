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
      <!-- 用户列表区域 -->
      <el-table :data="userList"
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username"
                         label="姓名"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"></el-table-column>
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>
        <el-table-column prop="mg_state"
                         label="状态">
          <!-- 作用域插槽会覆盖上面的prop -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
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
            <el-button type="primary"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-setting"
                         size="mini"
                         @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('手机号不合法,请输入正确的手机号'))
    }
    return {
      // 获取管理员列表参数对象
      queryInfo: {
        // 搜索关键字
        id: '',
        // 当前的页数
        pageCount: 1,
        // 当前每页多少条数据
        pageSize: 2
      },
      // 管理员信息表
      adminList: [],
      // 总共的数据条数
      totalCount: 0,
      // 控制添加管理员的Dialog对话框
      addDialogVisible: false,
      // 添加管理员表单数据
      addForm: {
        adminname: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度应该在 3 到 10 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: ',密码长度应该在 6 到 15 个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 查询到的管理员信息
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisable: false,
      userInfo: '',
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的分配角色id值
      selectedRoleId: ''
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    // 发起请求  获取用户信息并存到 adminList
    async getAdminList() {
      // 解构赋值  data重命名为res
      const { data: res } = await this.$http.post('list/1')
      if (res.code != 200) return this.$Message.error('获取用户列表失败')
      this.adminList = res.data.result
      console.log(this.adminList);
      this.totalCount = res.data.totalCount
    }
  }
}
</script>
<style lang="less" scoped>
</style>