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

      <tree-table class="treeTable"
                  :data="catelist"
                  :columns="columns"
                  :selection-type='false'
                  :expand-type='false'
                  show-index
                  index-text='#'
                  border>
        <!-- 是否有效 -->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted===false"
             style="color:lightgreen;"></i>
          <i class="el-icon-error"
             v-else
             style="color:lightgreen;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if='scope.row.cat_level===0'>一级</el-tag>
          <el-tag type="success"
                  size="mini"
                  v-if='scope.row.cat_level===1'>二级</el-tag>
          <el-tag type="warning"
                  size="mini"
                  v-if='scope.row.cat_level===2'>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="">
          <el-button type="primary"
                     plain
                     size="mini">编辑</el-button>
          <el-button type="danger"
                     plain
                     size="mini">删除</el-button>
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
                      prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 指定数据源 -->
          <el-cascader v-model="selectedKeys"
                       :options="parentCateList"
                       :props="cascaderProps"
                       @change="parentCateChanged"
                       clearable></el-cascader>

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
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
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
        cat_name: '',
        // 父级分类的id 不能为空 默认设置为0
        cat_pid: 0,
        // 分类等级默认为1级分类  值默认为0
        cat_level: 0
      },
      // 添加分类的表单的验证规则对象
      addCatFormRules: {
        cat_name: [
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
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        collapseTags: 'true',
        checkStrictly: true
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
      const { data: res } = await this.$http.post('/admin/goods/es', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取商品失败')
      }
      // 把数据列表,赋值给catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
      console.log(this.catelist)
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
    // 获取父级分类的数据类表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
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
        this.addCatForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 当前分类的等级赋值
        this.addCatForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCatForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addCatForm.cat_level = 0
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
          'categories',
          this.addCatForm
        )
        if (res.meta.status !== 201) {
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
      this.addCatForm.cat_pid = 0
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