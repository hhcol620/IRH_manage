<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->

      <tree-table :data="catelist"
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

        <template slot="order"
                  slot-scope="scope">
          <p>{{scope.row.desc}}</p>
        </template>

        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     plain
                     size="mini"
                     @click="click_edit_cate_by_id(scope.row.id)">编辑</el-button>
          <el-button type="danger"
                     plain
                     size="mini"
                     @click="click_delete_cate_by_id(scope.row.id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="querInfo.pagenum"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="querInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCatDialogVisable"
               width="50%"
               @close="addCatDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCatForm"
               :rules="addCatFormRules"
               ref="addCatFormRef"
               label-width="100px">
        <el-form-item label="分类名称"
                      prop="name">
          <el-input v-model="addCatForm.name"></el-input>
        </el-form-item>

        <el-form-item label="描述"
                      prop="desc">
          <el-input v-model="addCatForm.desc"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- options 指定数据源   props 用来指定配置的对象 -->
          <el-cascader v-model="selectedKeys"
                       :options="parentCateList"
                       :props="cascaderProps"
                       @change="parentCateChanged"
                       clearable
                       change-on-select></el-cascader>

        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCatDialogVisable = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类的数据列表, 默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'name'
        },
        {
          label: '描述',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCatDialogVisable: false,
      // 添加分类的表单数据对象
      addCatForm: {
        // 将要添加分类的名称
        name: '',
        // 父级分类的id 不能为空 默认设置为0
        parentId: 0,
        desc: ''
      },
      // 添加分类的表单的验证规则对象
      addCatFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '分类名称的长度应该在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表  空数组
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'childs',
        expandTrigger: 'hover',
        collapseTags: 'true',
        checkStrictly: 'true'
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    // 生命周期函数内调用这个方法  获取列表
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('goods/admin/category/tree')
      console.log(res)
      if (res.code !== 200) {
        return this.$Message.error('获取商品分类失败')
      }
      // 把数据列表,赋值给catelist
      this.catelist = res.data
      // 为总数据条数赋值
      this.total = res.data.length
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮打开对话框  将对话框的addCatDialogVisable 的属性值设置为true
    showAddCatDialog() {
      // 先获取父级分类的数据列表   在展示出对话框
      this.getParentCateList()
      this.addCatDialogVisable = true
    },
    // 获取父级分类的数据类表    在添加分类的对话框打开之后,立刻获取父级分类数据列表,在添加分类的时候,可以选择父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('user/admin/goods/category')
      if (res.code !== 200) {
        return this.$Message.error('获取父级分类数据失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 判断 selectedKeys 数组中的length大于0 证明选中了数据分类 否则就没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCatForm.parentId = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 当前分类的等级赋值
        this.addCatForm.parentId = this.selectedKeys.length + 1
        return
      } else {
        this.addCatForm.parentId = 0
        // 当前分类的等级赋值
        this.addCatForm.parentId = 0
      }
      console.log(this.selectedKeys)
    },
    // 点击按钮添加分类
    addCate() {
      // console.log(this.addCatForm)
      // 先进行一个表单的预验证
      this.$refs.addCatFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'user/admin/goods/category',
          this.addCatForm
        )
        if (res.code !== 200) {
          return this.$Message.error('添加分类失败!')
        }
        this.$Message.success('添加分类成功!')
        this.getCateList()
        this.addCatDialogVisable = false
      })
    },
    // 监听对话框的关闭数据
    addCatDialogClosed() {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.parentId = 0
    },
    //监听编辑按钮
    async click_edit_cate_by_id(id) {
      // 根据传过来的id值请求数据,做下一步的渲染
      console.log(id)
      // 立刻发起请求,根据id获取商品分类的信息
      const { data: res } = await this.$http.get(`user/admin/goods/category/{id}`)
      console.log(res)
    },
    // 监听分类的删除按钮
    async click_delete_cate_by_id(id) {
      // 根据传递过来的id值,请求对应的接口,获取对应的数据
      console.log(id)
      // 点击删除之后,先提示用户是否确认删除
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirm)
      if (confirm !== 'confirm') {
        // 用户点击了取消
        return this.$Message.info('您点击了取消')
      } else {
        // 用户点击了确定了按钮
        // 先发起删除请求
        // id要使用传进来的id值
        const { data: res } = await this.$http.delete(
          `user/admin/goods/category/${id}`
        )
        // console.log(res)
        if (res.code !== 200) {
          // 删除失败
          this.$Message.error('删除分类失败')
        } else {
          // 删除成功
          this.$Message.success('删除分类成功')
          // 重新获取新的分类列表
          this.getCateList()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>