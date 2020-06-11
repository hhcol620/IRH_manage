<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        系统管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>举报列表</el-breadcrumb-item>
      <el-breadcrumb-item>实名审核详情</el-breadcrumb-item>
    </el-breadcrumb>

  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>