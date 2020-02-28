<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20"
              class="searchC">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入用户id"
                    v-model="queryInfo.searchCondition.id"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入用户姓名"
                    v-model="queryInfo.searchCondition.realName"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入用户昵称"
                    v-model="queryInfo.searchCondition.nickname"
                    class="input-with-select"
                    clearable
                    @clear="getAdminList">
          </el-input>
        </el-col>

        <el-col :span="5">
          <el-select v-model="queryInfo.searchCondition.type"
                     clearable
                     placeholder="用户身份"
                     @clear="getAdminList">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="8">
          <div class="block">
            <!-- queryInfo.searchCondition.searchEndTime -->
            <el-date-picker v-model="Alongtime"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>

        <el-col :span="6">
          <el-button type="primary"
                     @click="searchByquery(queryInfo.query)">搜索</el-button>
          <el-button class="primary"
                     @click="resetQuery()">重置</el-button>
        </el-col>
        <el-col :span="5"
                class="addAdminBox">
          <el-button type="primary"
                     @click="addAdmin">添加用户</el-button>
        </el-col>

      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="adminList"
                stripe
                border
                @row-dblclick="clickToDetail">
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
                          @close="removeRoleById(scope.row.id,item.id)">{{item.roleName}}</el-tag>
                </el-tooltip>

              </div>
            </div>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id"
                         label="ID"></el-table-column>
        <el-table-column prop="nickname"
                         label="昵称"></el-table-column>
        <el-table-column prop="realName"
                         label="真实姓名"></el-table-column>
        <el-table-column prop="phoneNum"
                         label="手机号"></el-table-column>
        <el-table-column label="身份"
                         prop="type">
          <template scope="scope">
            <!-- 使用过滤器将后端传过来的数字类型的数据转为对应的身份名 -->
            <el-tag>{{scope.row.type | admin_type_Format}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="email"
                         label="邮箱地址">
        </el-table-column>

        <el-table-column prop="createTime"
                         label="注册时间">
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

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="60%"
               @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form  :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item label="邮箱地址"
                      prop="email">
          <el-input v-model="addForm.email"  />
        </el-form-item>
        <el-form-item label="用户密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称"
                      prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>

        <el-form-item>
          <el-radio-group v-model="addForm.gender">
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">男</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="身份"
                      prop="type">
          <el-select v-model="addForm.type"
                     placeholder="请选择身份">
            <el-option label="普通会员"
                       value="10"></el-option>
            <el-option label="服务人员"
                       value="20"></el-option>
            <el-option label="校园组织"
                       value="30"></el-option>
            <el-option label="公益组织"
                       value="35"></el-option>
            <el-option label="校园社团"
                       value="40"></el-option>
            <el-option label="用户"
                       value="50"></el-option>
          </el-select>
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

    <!-- 修改用户信息的对话框 -->
    <el-dialog title="提示"
               :visible.sync="editDialogVisible"
               width="60%">

      <!-- 内容主体区域 -->
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item hidden
                      label="用户ID"
                      prop="id">
          <el-input v-model="editForm.id"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="基本信息">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="昵称"
                            prop="nickname">
                <el-input v-model="editForm.nickname"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="姓名"
                            prop="realName">
                <el-input v-model="editForm.realName"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="性别"
                            prop="gender">
                <el-radio-group v-model="editForm.gender"
                                disabled>
                  <el-radio :label="1">女</el-radio>
                  <el-radio :label="2">男</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="学校信息">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item label="学校名称">
                <el-input v-model="editForm.schoolName"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="学院名称">
                <el-input v-model="editForm.academyName"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="专业">
                <el-input v-model="editForm.majorName"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="寝室信息">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item label="寝室楼号">
                <el-input v-model="editForm.buildingNum"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="寝室号">
                <el-input v-model="editForm.dormNum"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="editForm.phoneNum"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="身份"
                      prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="10">普通会员</el-radio>
            <el-radio :label="20">服务人员</el-radio>
            <el-radio :label="30">校园组织</el-radio>
            <el-radio :label="35">公益组织</el-radio>
            <el-radio :label="40">校园社团</el-radio>
            <el-radio :label="50">用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 需要改变的状态10:注销 20:锁定 30:审核中 40:审核通过 -->
        <el-form-item label="状态"
                      prop="state">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="20">锁定</el-radio>
            <el-radio :label="30">审核中</el-radio>
            <el-radio :label="40">审核通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述"
                      prop="desc">
          <el-input type="textarea"
                    v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
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
    var checkEmail = (rules, value, cb) => {
      var res = this.checkValue(2)
      if (res.code == 200) {
        return cb()
      }else {
        cb(new Error("邮箱地址已经被注册"))
      }
    }

    var checkNickname = (rules, value, cb) => {
      var res = this.checkValue(2)
      if (res.code == 200) {
        return cb()
      } else {
        cb(new Error('用户昵称已经存在'))
      }
    }

    return {
      //用来标识校验邮箱、昵称是否通过；只有通过了才能为true
      available: '',
      // 获取用户列表参数对象
      queryInfo: {
        // 搜索关键字
        searchCondition: {
          id: '',
          realName: '',
          nickname: '',
          roleList: [],
          // 身份
          type: '',
          searchStartTime: '',
          searchEndTime: ''
        },
        // 当前的页数
        currentPage: 1,
        // 当前每页多少条数据
        pageSize: 10,
        data: []
      },
      // 数据总条数
      totalCount: 0,
      // 用户信息表
      adminList: [],
      listObj: [],
      // 添加用户弹框
      addDialogVisible: false,
      // 添加用户信息
      // 添加用户的表单信息
      addForm: {
        buildingNum: '',
        dormNum: '',
        schoolName: '',
        academyName: '',
        majorName: '',
        createTime: '',
        realName: '',
        nickname: '',
        password: '',
        type: '',
        email: '',
        phoneNum: '',
        gender: ''
      },
      checkValueDto: {
        type: '',
        validValue: ''
      },
      // 添加用户表单的规则验证对象
      addFormRules: {
        email: [
          { required: true, message: '请输入用户email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
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
        nickname: [
          { validator: checkNickname, trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择身份', trigger: 'change' }],
        gender: [{ required: this, message: '请选择性别', trigger: 'change' }],
        desc: []
      },
      // 编辑用户信息的对话框
      editDialogVisible: false,
      // 编辑这个按钮打开对话框  存储一些信息  主要修改状态
      editForm: {},
      // 身份
      opt: [
        {
          value: '10',
          label: '普通会员'
        },
        {
          value: '20',
          label: '服务人员'
        },
        {
          value: '30',
          label: '校园组织'
        },
        {
          value: '35',
          label: '公益组织'
        },
        {
          value: '40',
          label: '校园社团'
        },
        {
          value: '50',
          label: '用户'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 选择时间段   在事件里面不对这个进行修改
      Alongtime: ''
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    // 发起请求  获取用户信息并存到 adminList
    async getAdminList() {
      if (this.Alongtime != null) {
        let newDate = this.Alongtime.toString()
        const ss = newDate.split(',')
        this.queryInfo.searchCondition.searchStartTime = ss[0]
        this.queryInfo.searchCondition.searchEndTime = ss[1]
      }

      const { data: res } = await this.$http.post(
        'user/admin/list',
        this.queryInfo
      )
      if (res.code !== 200) {
        return this.$Message.error('获取列表失败')
      }
      this.adminList = res.data.data
      this.totalCount = res.data.totalCount
      this.$Message.success('加载用户列表成功')
    },
    // 标签上面点击删除执行下面方法
    // 根据id删除用户下角色
    async removeRoleById(userId, roleId) {
      // console.log(userId, roleId)
      // 弹框提示用户是否要删除
      const confimResult = await this.$confirm(
        '此操作将永久删除该角色,是否继续',
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
      const { data: res } = await this.$http.delete(
        `user/admin/${userId}/${roleId}`
      )
      console.log(res)
      // 请求接口暂时不对, 后期需要修改######################
      if (res.code != 200) {
        return this.$Message.error('删除角色失败')
      }
      // 删除成功
      this.$Message.success('删除角色成功')
      // 删除之后重新发起请求,获取用户列表
      this.getAdminList()
    },
    // 根据关键字查询用户
    async searchByquery() {
      // 调用获取用户的方法就可以了
      this.getAdminList()
    },
    //查看输入的值是否唯一   1-邮箱地址   2-昵称
    async checkValue(type) {
      if (type == 1) {
        this.checkValueDto.type = 'email'
        this.checkValueDto.validValue = this.addForm.email
      } else if (type == 2) {
        this.checkValueDto.type = 'nickname'
        this.checkValueDto.validValue = this.addForm.nickname
      }
      const { data: check } = await this.$http.post(
        '/user/user/check',
        this.checkValueDto
      )
      console.log('返回值' + check.code)
      return check.code
    },
    // 用户状态   监听switch按钮的变化
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
      this.queryInfo.searchCondition.realName = ''
      this.queryInfo.searchCondition.type = ''
      this.queryInfo.searchCondition.searchStartTime = ''
      this.queryInfo.searchCondition.searchEndTime = ''
      this.queryInfo.searchCondition.nickname = ''
      // 重置之后然后再发起请求   获取所有用户
      this.getAdminList()
    },
    // 添加用户
    addAdmin() {
      // console.log('添加用户')
      this.addDialogVisible = true
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      //对话框关闭,触发
      console.log('对话框关闭了')
      this.$refs.addFormRef.resetFields()
    },
    // 发起添加用户的请求
    addAdminReq() {
      // 发起添加用户的请求之前,首先先进行数据验证
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          // 如果数据验证不通过,下面的请求也就不能发起
          return
        } else {
          // 数据验证通过,可以发起请求
          // console.log(this.addForm)
          // debugger
          const { data: res } = await this.$http.post(
            'user/admin',
            this.addForm
          )
          // console.log(res.code)
          // debugger
          if (res.code !== 200) {
            return this.$Message.error('添加失败')
          }
          this.$Message.success('添加用户信息成功')
          // 添加成功之后隐藏对话框
          this.addDialogVisible = false
          // 刷新列表  重新列表数据
          this.getAdminList()
        }
      })
    },
    // 修改用户信息对话框
    async showEditDialog(id) {
      console.log(id)
      /* 
        在弹框之前首先发起请求,根据id查询用户信息
      */
      const { data: res } = await this.$http.get(`user/admin/${id}`)
      console.log(res.data.state)
      this.editForm = res.data
      // 请求成功,将请求过来的数据渲染到页面上也就是弹出的对话框里面
      this.editDialogVisible = true
    },
    // 根据id删除对应的用户
    async removeAdminById(id) {
      // console.log(id)
      //先进行弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
        const { data: res } = await this.$http.put('user/admin', this.editForm)
        if (res.code !== 200) return this.$Message.error(res.text)
        this.$Message.success(`删除ID为${id}用户成功!`)
        // 删除成功之后,再次发情获取用户列表的请求
        this.getAdminList()
      }
    },
    //当某一行被点击时会触发该事件  这个时候跳转到用户信息的详情页中
    clickToDetail(row) {
      // console.log(row.id)
      this.$router.push(`/Administrators_Detail?id=${row.id}`)
    },
    // 编辑用户    修改用户的状态信息
    async editDialogSubmit() {
      // 这个就是用户的id 等下有用
      const { data: res } = await this.$http.delete(
        `user/admin/${this.editForm.id}/${this.editForm.state}`
      )
      // console.log(res)
      if (res.code !== 200) {
        // 则证明,修改用户的状态失败
        return this.$Message.error('修改用户的状态失败')
      }
      // 证明修改用户状态成功
      this.$Message.success('修改用户的状态成功')
      // 关闭dialog对话框
      this.editDialogVisible = false
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

// 设置添加用户按钮左对齐
.addAdminBox {
  // float: right;
  display: flex;
  justify-content: flex-end;
}
.searchC {
  > .el-col {
    padding: 3px 0;
  }
}
</style>