<!--
 * @Author: your name
 * @Date: 2019-11-30 11:35:23
 * @LastEditTime: 2019-12-01 11:20:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pro\src\components\power\Roles.vue
 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入角色名称"
                    v-model="queryInfo.searchCondition.roleName"
                    class="input-with-select"
                    clearable
                    @clear="getRolesList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入角色ID"
                    v-model="queryInfo.searchCondition.id"
                    class="input-with-select"
                    clearable
                    @clear="getRolesList">
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入角色权限名称"
                    v-model="queryInfo.searchCondition.authInfoList.authName"
                    class="input-with-select"
                    clearable
                    @clear="getRolesList">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getRolesList">搜索</el-button>
          <el-button class="primary"
                     @click="inputReset_get">重置</el-button>
        </el-col>
        <el-col :span="5"
                class="addRoles">
          <el-button type="primary"
                     @click="addRoles">添加角色</el-button>
        </el-col>

      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList"
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1) in scope.row.authInfoList"
                    :key="item1.id">
              <el-col :span="8">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="6">
                <p>描述: {{item1.authDesc}}</p>
              </el-col>
            </el-row>
            <!-- <pre>
            {{ scope.row }}
          </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色ID"
                         prop="id"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editorRoleDialogVisible(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[2, 10, 30, 100]"
                     :page-size="2"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightDialogVisible"
               width="50%"
               @close="setDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key='id'
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRightDialogVisible=false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色编辑对话框 -->
    <el-dialog title="角色编辑"
               :visible.sync="roleEditorDialogVisible"
               width="50%"
               @close="roleEditorDialogClosed">

      <el-form ref="roleEditorDialogFormRef"
               :model="roleEditorDialogform"
               :rules="roleEditVerifyRul"
               label-width="80px">
        <!-- 内容主体区域 -->
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="roleEditorDialogform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="roleEditorDialogform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="roleEditorDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="roleEditorDialog">确 定</el-button>
      </span>

    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="addRoleDialogVisable"
               @close="addRoleDialogClosed">
      <el-form :model="addRoleForm"
               ref="addRoleRef"
               :rules="addRoleRules">
        <el-form-item label="角色名称"
                      label-width="80px"
                      prop="roleName">
          <el-input v-model="addRoleForm.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      label-width="80px"
                      prop="roleDecription">
          <el-input v-model="addRoleForm.roleDecription"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRoleAffirm">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        //  搜索关键字
        searchCondition: {
          // 创建人姓名
          createManagement: '',
          // 角色id
          id: '',
          // 角色描述
          roleDesc: '',
          // 角色名称
          roleName: '',
          // 角色状态
          state: '',
          // 具有的权限的列表
          authInfoList: {
            // 权限名称
            authName: '',
            // 权限id
            id: '',
            // 父权限id
            parentId: '',
            // 权限状态
            state: ''
          }
        },
        // 当前的页数
        currentPage: 1,
        // 当前每页多少条数据
        pageSize: 2
      },

      // 总条数
      totalCount: 0,

      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 存取所有权限的数据 默认为空  数据获取成功之后为其赋值
      rightsList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: 'authName'
      },
      // 默认选中的id值数组
      defKeys: [],
      roleId: '',
      // 角色编辑对话框
      roleEditorDialogVisible: false,

      // 角色编辑对话框内容双向编辑
      roleEditorDialogform: {},
      // 角色编辑对话框内容预验证对象
      roleEditVerifyRul: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在至少 6 个字符', trigger: 'blur' }
        ]
      },
      // 控制添加角色对话框
      addRoleDialogVisable: false,
      // 添加角色
      addRoleForm: {
        roleName: '',
        roleDecription: ''
      },
      // 添加角色表单的验证对象
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDecription: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, message: '长度至少 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.post(
        '/admin/role/list',
        this.queryInfo
      )
      if (res.code !== 200) {
        return this.$Message.error('获取用户列表失败')
      } else {
        this.$Message.success('获取用户列表成功')
        console.log(res)
        this.roleList = res.data.result
        this.totalCount = res.data.totalCount
        // console.log(this.totalCount)
        // console.log(this.roleList)
      }
    },
    // 根据id删除对应的权限
    async removeRightByid(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$Message.info('您取消了删除')
      } else {
        const { data: res } = await this.$http.delete(
          `role/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('删除权限成功')
        }
        // this.getRolesList()
        role.children = res.data
      }
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get(
        `/admin/role/ra/${this.roleId}`
      )
      if (res.code !== 200) {
        return this.$Message.error('获取列表失败')
      } else {
        // 把获取到的数据保存到data中的rightsList数组中
        this.rightsList = res.data.authInfoList
        // console.log(this.rightsList)
        console.log(res)
      }
      // 递归获取三级节点的id
      // this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取所有角色下所有的三级权限的id,并保存到defKeys数组中
    // getLeafKeys(node, arr) {
    //   // 如果node节点不包含children属性,则是三级节点
    //   if (!node.children) {
    //     return arr.push(node.id)
    //   }

    //   node.children.forEach(item => this.getLeafKeys(item, arr))
    // },
    // 监听分配权限对话框关闭的事件
    setDialogClosed() {
      this.defKeys = []
    },
    // 点击提交角色分配权限
    async allotRights() {
      // 展开数组  ...
      const keys = [...this.$refs.treeRef.getCheckedKeys()]
      // console.log(keys)
      const idStr = keys.join(',')
      const roleId = this.roleId
      const { data: res } = await this.$http.put('/admin/role/editRoleAuth', {
        authId: idStr,
        // 分配权限的角色id
        roleId: roleId
      })
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('分配权限失败')
      }
      this.$Message.success('分配用户成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 打开编辑对话框
    async editorRoleDialogVisible(id) {
      // console.log(id)
      const { data: res } = await this.$http.get(`/admin/role/${id}`)
      if (res.code !== 200) {
        return this.$Message.error('获取数据失败')
      }
      this.roleEditorDialogform = res.data
      console.log(this.roleEditorDialogform)
      this.roleEditorDialogVisible = true
    },
    // 监听角色编辑对话框的关闭事件
    roleEditorDialogClosed() {
      // 重置整个表单
      this.$refs.roleEditorDialogFormRef.resetFields()
    },
    // 编辑角色对话框,修改之后验证并提交
    roleEditorDialog() {
      this.$refs.roleEditorDialogFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 校验通过,发起表单的提交请求
        const { data: res } = await this.$http.post(
          '/admin/role/edit' + this.roleEditorDialogform.id,
          {
            roleName: this.roleEditorDialogform.roleName,
            roleDesc: this.roleEditorDialogform.roleDesc
          }
        )
        console.log(res.meta.status)
        if (res.meta.status !== 200) {
          return this.$Message.error('更新用户信息失败！')
        }
        // 更新信息成功之后
        // 关闭对话框
        this.roleEditorDialogVisible = false
        // 刷新数据
        this.getRolesList()
        // 提示修改成功
        this.$Message.success('获取数据成功')
      })
    },
    // 删除角色，MessageBox弹框提示
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          concelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认了删除，则返回值为字符串 confirm
      // 如果用户点击取消删除，则返回字符串为cancel
      console.log(confirmResult)
      if (confirmResult != 'confirm') {
        return this.$Message.info('已经取消了删除')
      } else {
        // 确认了删除
        const { data: res } = await this.$http.delete(`/admin/role/${id}`)
        if (res.code !== 200) {
          return this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除角色成功!')
          this.getRolesList()
        }
      }
    },

    // 点击添加角色按钮
    addRoles() {
      this.addRoleDialogVisable = true
    },
    // 监听添加角色对话框的关闭 关闭下面事件处理函数执行
    addRoleDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 点击确认 执行下面的这个事件处理函数   添加新角色
    addRoleAffirm() {
      this.$refs.addRoleRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        //表单预校验通过 发起提交请求
        const { data: res } = await this.$http.post(
          '/admin/role',
          this.addRoleForm
        )
        console.log(res)
        if (res.code !== 200) {
          return this.$Message.error('添加角色失败,请稍后重试')
        }
        this.$Message.success('添加角色成功')
        // 隐藏添加用户对话框
        this.addRoleDialogVisable = false
        // 重新获取角色信息列表
        this.getRolesList()
      })
    },
    // 分页区域的事件
    // 监听页面内多少条数据切换
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      this.getRolesList()
    },
    // 监听当前页数的切换
    handleCurrentChange(newCurrentPage) {
      // console.log(currentPage)
      this.currentPage = newCurrentPage
      this.getRolesList()
    },
    // 搜索框重置清空   发起没有条件的请求，请求到没有条件的角色的列表
    inputReset_get() {
      this.queryInfo.searchCondition.roleName = ''
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.authInfoList.authName = ''
      // 清空完成后重新发起请求没有条件的列表
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}

// 添加角色按钮
.addRoles {
  display: flex;
  justify-content: flex-end;
}
</style>
