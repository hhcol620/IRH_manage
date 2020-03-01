<template>
  <div class="container">
    <!-- 这是管理员的详情组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item>管理员信息详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="adminDetail">
      <el-form ref="formList"
               :model="ListObj">
        <table border='1'
               cellsapcing='0'
               cellpadding="6"
               class="">
          <tr>
            <td colspan="2">
              <el-form-item label="管理员ID :">
                <el-input v-model="ListObj.id"
                          class="width3"></el-input>
              </el-form-item>
            </td>
            <td colspan="2">
              <el-form-item label="管理员名称 :">
                <el-input v-model="ListObj.nickname"
                          class="width3"></el-input>
              </el-form-item>
            </td>
            <td colspan="2">
              <el-form-item label="管理员密码 :">
                <el-input v-model="ListObj.password"
                          class="width3"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <el-form-item label="描述 :">
                <el-input v-model="ListObj.desc"
                          class="width6"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <el-form-item label="角色 :">
                <div class="tagContainer">
                  <div v-for="(item, index) in ListObj.roleList"
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

              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <el-form-item label="身份 :"
                            prop="type">
                <el-radio-group v-model="ListObj.type">
                  <el-radio :label="10">服务人员</el-radio>
                  <el-radio :label="20">校园组织</el-radio>
                  <el-radio :label="25">公益组织</el-radio>
                  <el-radio :label="30">校园社团</el-radio>
                  <el-radio :label="40">管理员</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <el-form-item label="状态 :"
                            prop="type">
                <el-radio-group v-model="ListObj.state">
                  <el-radio :label="10">注销</el-radio>
                  <el-radio :label="20">锁定</el-radio>
                  <el-radio :label="30">审核</el-radio>
                  <el-radio :label="40">审核通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="3">CreateTime: {{ListObj.createTime}}</td>
            <td colspan="3">UpdateTime: {{ListObj.updateTime}}</td>
          </tr>
        </table>
      </el-form>
    </div>
    <div class="submit_btn">
      <el-button @click="return_previous">取消</el-button>
      <el-button type="primary"
                 @click="edit_submit">确认</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ListObj: {
        nickname: '',
        id: '',
        password: '',
        desc: '',
        type: '',
        roleList: [],
        state: '',
        createTime: '',
        updateTime: ''
      }
      // state 状态
      // stateListObj: {
      //   10: '注销',
      //   20: '锁定',
      //   30: '审核',
      //   40: '审核通过'
      // }
    }
  },
  created() {
    this.getAdministratorId()
  },
  methods: {
    // 获取管理员的id值
    async getAdministratorId() {
      // js的slice方法
      var id = location.href.slice(location.href.indexOf('?id=') + 4)
      console.log(id)
      // 这个id也就是传过来的管理员的id 然后就是发起请求 请求这个id值的用户详细信息
      const { data: res } = await this.$http.get(`user/admin/${id}`)
      // console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('加载管理员信息失败,请稍后重试')
      } else {
        // 请求数据成功
        this.$Message.success('加载管理员信息成功')
        console.log(res.data)
        this.ListObj = res.data
        console.log(this.ListObj)
      }
    },
    // 取消按钮
    return_previous() {
      // console.log('取消了')
      // 取消了,然后跳转到上一个页面去 也就是管理员列表页面
      this.$router.push('administrators')
    },
    // 确定按钮
    async edit_submit() {
      // console.log('点击了确定')
      // 点击了确定 这个时候将数据 上传给服务器
      const { data: res } = await this.$http.put('/admin', this.ListObj)
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('管理员信息修改失败')
      } else {
        // 管理员信息修改成功
        this.$Message.success('管理员信息修改成功')
        // 修改成功,然后跳转到原来管理员列表页面
        this.$router.push('administrators')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.adminDetail {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
table {
  border-collapse: collapse;
  width: 100%;
}
table,
table tr td {
  border: 1px solid #ccc;
  color: #666;
  font-size: 14px;
  line-height: 28px;
  font-style: normal;
  font-weight: 500;
}
table tr td {
  padding: 5px 10px;
}
.el-form {
  width: 90%;
  .width3 {
    width: 200px;
  }
  .el-form-item {
    margin-bottom: 0;
    .el-input {
      background-color: #eaedf1;
    }
  }
}
/deep/.el-input__inner {
  background-color: #f1f2f3;
}

.submit_btn {
  margin-top: 20px;
  margin-right: 6%;
  display: flex;
  justify-content: flex-end;
}
.width6 {
  width: 90%;
}
.tagContainer {
  display: flex;
  flex-flow: wrap;
  .item {
    margin: 6px;
  }
}
</style>