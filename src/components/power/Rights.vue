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
      <el-table :data="rightsList"
                border
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称"
                         prop="authName"></el-table-column>
        <el-table-column label="路径"
                         prop="path"></el-table-column>
        <el-table-column label="权限等级"
                         prop="level">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'"
                    size="mini">一级权限</el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.level==='1'"
                    size="mini">二级权限</el-tag>
            <el-tag type="warning"
                    v-else
                    size="mini">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有的权限列表
      rightsList: []
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
      const { data: res } = await this.$http.get('right/list')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取权限列表失败!')
      } else {
        this.rightsList = res.data
        // console.log(this.rightsList)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>