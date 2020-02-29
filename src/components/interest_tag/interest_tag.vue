<template>
  <div>
    <!-- 兴趣标签组件 -->
    <!-- <h2>兴趣标签组件</h2> -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>兴趣标签</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <!-- 主体区域 -->
      <!-- 查找搜索  search -->
      <el-row :gutter="24">
        <el-col :span="5">
          <el-input v-model="queryInfo.searchCondition.id"
                    clearable
                    placeholder="标签ID"></el-input>
        </el-col>
        <el-col :span="5">

          <el-input v-model="queryInfo.searchCondition.tagName"
                    clearable
                    placeholder="标签名"></el-input>
        </el-col>

        <el-col :span="8">
          <el-date-picker v-model="aLongTime"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="get_Interest_tag_by_searchCondition">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="interest_tag"
                style="width: 100%">
        <el-table-column prop="id"
                         label="ID">
        </el-table-column>
        <el-table-column prop="tagName"
                         label="标签名">
        </el-table-column>
        <el-table-column prop="total"
                         label="使用总数">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="edit_btn(scope.row.id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="delete_by_id(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 30, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑标签"
                 :visible.sync="EditDialogVisible"
                 width="50%">
        <el-form ref="edit_list_Ref"
                 :model="edit_list"
                 :rules="edit_list_Rul"
                 label-width="120px">
          <el-form-item label="标签ID"
                        prop="id">
            <el-input v-model="edit_list.id"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="标签名称"
                        prop="tagName">
            <el-input v-model="edit_list.tagName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="EditDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="edit_submit">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询内容
      queryInfo: {
        pageSize: 10,
        currentPage: 1,
        searchCondition: {
          id: '',
          tagName: '',
          searchStartTime: '',
          searchEndTime: ''
        }
      },
      // 时间段
      aLongTime: '', //这个不要修改  需要按照这个显示  (回显)
      // 总条数
      totalCount: 0,
      // 标签列表
      interest_tag: [],
      // 编辑对话框  默认关闭
      EditDialogVisible: false,
      // 对话框的列表  from 表单数据
      edit_list: {},
      // 编辑对话框的表单的验证规则
      edit_list_Rul: {
        id: [
          { required: true, message: 'id不能为空' },
          { type: 'number', message: 'id值必须为数字值' }
        ],
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
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
      }
    }
  },
  created() {
    this.get_Interest_tag_by_searchCondition()
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.get_Interest_tag_by_searchCondition()
    },
    // 监听当前页面的变化
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.currentPage = newCurrentPage
      this.get_Interest_tag_by_searchCondition()
    },
    // 分页获取兴趣列表
    async get_Interest_tag_by_searchCondition() {
      // 发起请求

      if (this.aLongTime != null) {
        let newDate = this.aLongTime.toString()
        const ss = newDate.split(',')
        this.queryInfo.searchCondition.searchStartTime = ss[0]
        this.queryInfo.searchCondition.searchEndTime = ss[1]
      }

      const { data: res } = await this.$http.post(
        `user/interest/admin`,
        this.queryInfo
      )
      if (res.code !== 200) {
        // 获取失败
        return this.$Message.error('获取列表信息失败')
      } else {
        // 成功
        this.interest_tag = res.data.data
        this.totalCount = res.data.totalCount
        this.$Message.success('获取列表信息成功')
      }
    },
    // 重置搜索框   然后重新发起请求
    resetSearch() {
      // 重置
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.tagName = ''
      // 清空之后重新发起请求
      this.get_Interest_tag_by_searchCondition()
    },
    // 删除标签
    async delete_by_id(id) {
      // 先提提示用户将永久删除标签
      console.log(id)
      const confirm = await this.$confirm(
        '此操作将永久删除该标签,且会把所有用户引用该标签的记录都删掉, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') {
        // 点击了取消
        return this.$Message.info('您点击了取消')
      } else {
        // 成功
        // console.log('ok')
        // 发起请求
        const { data: res } = await this.$http.delete(
          `user/interest/admin/${id}`
        )
        // console.log(res)
        if (res.code !== 200) {
          // 失败
          this.$Message.error('删除标签失败')
        } else {
          this.$Message.success('删除标签成功')
          // 重新获取新的列表 刷新
          this.get_Interest_tag_by_searchCondition()
        }
      }
    },
    // 编辑
    async edit_btn(id) {
      // console.log(id)
      // 先进行网络请求 ，将请求到的数据保存起来，渲染到将要打开的对话框的里面
      const { data: res } = await this.$http.get(`user/interest/admin/${id}`)
      if (res.code !== 200) {
        // 失败
        return this.$Message.error('获取标签信息失败')
      }
      this.edit_list = res.data
      this.EditDialogVisible = true
      //
    },
    // 编辑确认  提交数据
    edit_submit() {
      // 在发起数据之前需要先进行表单预验证
      this.$refs.edit_list_Ref.validate(async valid => {
        if (!valid) return
        /* 解构赋值 */
        // 预验证成功
        const { data: res } = await this.$http.put(
          `user/interest/admin`,
          this.edit_list
        )
        // console.log(res)
        if (res.code !== 200) {
          // 失败
          return this.$Message.error('提交信息失败，请稍后重试')
        } else {
          this.$Message.success('编辑标签成功')
          this.EditDialogVisible = false
          // 重新获取数据   刷新列表
          this.get_Interest_tag_by_searchCondition()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>