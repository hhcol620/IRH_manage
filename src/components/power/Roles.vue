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
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList"
                border
                stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']">
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightByid(scope.row,item3.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children"
                        :key="item2.id"
                        :class="[i2 === 0 ? '' : 'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightByid(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            v-for="item3 in item2.children"
                            :key="item3.id"
                            closable
                            @close="removeRightByid(scope.row,item3.id)">
                      {{item3.authName}}</el-tag>
                    <!--  -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
            {{ scope.row }}
          </pre> -->
          </template>
        </el-table-column>

        <el-table-column type="index"></el-table-column>
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
        <el-form-item label="角色名称">
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
      //
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 存取所有权限的数据 默认为空  数据获取成功之后为其赋值
      rightsList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
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
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
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
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取用户信息失败')
      } else {
        this.roleList = res.data
        console.log(this.roleList)
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
          `roles/${role.id}/rights/${rightId}`
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
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取列表失败')
      } else {
        // 把获取到的数据保存到data中的rightsList数组中
        this.rightsList = res.data
        console.log(this.rightsList)
      }
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取所有角色下所有的三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的事件
    setDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 展开数组  ...
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('分配权限失败')
      }
      this.$Message.success('分配用户成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 打开编辑对话框
    async editorRoleDialogVisible(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
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
        const { data: res } = await this.$http.put(
          'roles/' + this.roleEditorDialogform.id,
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
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除角色成功!')
          this.getRolesList()
        }
      }
    },

    // 点击添加角色按钮
    addRole() {
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
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加角色失败')
        }
        this.$Message.success('添加角色成功')
        // 隐藏添加用户对话框
        this.addRoleDialogVisable = false
        // 重新获取角色信息列表
        this.getRolesList()
      })
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
</style>
