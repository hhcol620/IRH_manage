<template>
  <div>
    <!-- 这是帖子管理 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">论坛管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>帖子管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="queryInfo.searchCondition.id"
                    placeholder="帖子ID"
                    clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="queryInfo.searchCondition.title"
                    placeholder="帖子名称"
                    clearable></el-input>
        </el-col>

        <el-col :span="4">
          <el-input v-model="queryInfo.searchCondition.userId"
                    placeholder="作者id"
                    clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getArticleList">搜索</el-button>
          <el-button @click="reset_Search">重置</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="articleList"
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

        <!-- 更多 -->
        <template slot="more"
                  slot-scope="scope">
          <ul class="more_icon">
            <!-- 浏览 -->
            <li>
              <i class="iconfont icon-liulan">{{scope.row.browserTimes}}</i>
            </li>
            <!-- 转发 -->
            <li>
              <i class="iconfont icon-zhuanfa1"></i>{{scope.row.forwardTimes}}
            </li>
            <!-- 点赞 -->
            <li>
              <i class="iconfont icon-zan1"></i>{{scope.row.upTotal}}
            </li>
            <!-- 回复 -->
            <li>
              <i class="iconfont icon-icon_huifu-mian"></i>{{scope.row.browserTimes}}
            </li>
          </ul>
        </template>
        <!-- 操作 -->
        <template slot="operate"
                  slot-scope="scope">
          <el-button type="danger"
                     plain
                     size="mini"
                     @click="click_delete_article_by_id(scope.row.id)">删除</el-button>
          <el-button type="primary"
                     plain
                     size="mini"
                     @click="click_more_article_by_id(scope.row.id)">更多</el-button>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        currentPage: 1,
        pageSize: 10,
        searchCondition: {
          // 帖子的id
          id: '',
          // 帖子的名称
          title: '',
          userId: ''
        }
      },
      // 文章信息的数据列表, 默认为空
      articleList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '文章标题',
          prop: 'title'
        },
        {
          label: '作者',
          prop: 'userId'
        },
        {
          label: '发帖时间',
          prop: 'createTime'
        },
        {
          label: '热度',
          type: 'template',
          template: 'more',
          minWidth: '200px',
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
    this.getArticleList()
  },
  methods: {
    // 获取帖子列表
    async getArticleList() {
      this.articleList = []
      const { data: res } = await this.$http.post(
        'life/admin/article/list',
        this.queryInfo
      )
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('获取文章信息失败')
      }
      // 把数据列表,赋值给catelist
      var list = res.data.data
      list.forEach( async item => {
        item.userId = await this.getUserName(item.userId)
        this.articleList.push(item)
      })
      // 为总数据条数赋值
      this.total = res.data.totalCount
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getArticleList()
    },
    // 监听currentPage改变
    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage
      this.getArticleList()
    },
    // 监听搜索框重置
    reset_Search() {
      //  先重置输入框  再发起数据请求,获取最新的列表
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.title = ''
      this.queryInfo.searchCondition.userId =''
      this.getArticleList()
    },
    // 监听删除文章
    click_delete_article_by_id(id) {
      console.log(id)
    },
    // 监听更多按钮
    click_more_article_by_id(id) {
      console.log(id)
    },
    async click_delete_article_by_id(id){
      const { data: res } = await this.$http.delete(`user/admin/forum/${id}`)
      if (res.code !== 200) {
        return this.$Message.error('删除失败')
      }
      this.getArticleList()
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