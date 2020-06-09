<template>
  <div>
    <!-- 商品管理模块 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      <el-breadcrumb-item>公益基金申请</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入需求"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.productName"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.oldDegree"
                     placeholder="请选择希望新旧程度">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getDemandsBySearchCondition">搜索</el-button>
          <el-button class="primary"
                     @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
      <div class="container">
        <div class="container_box"
             v-for="item in demand_List_Obj"
             :key="item.id">
          <el-row>
            <el-col :span="2"
                    class="main_img_box">
              <!-- 这是主图 -->
              <img src="http://img11.360buyimg.com//n12/jfs/t1/99733/2/8261/174001/5e045083Ec79b2c6e/fac2d957b511c1da.jpg"
                   alt=""
                   class="main_img">
            </el-col>
            <el-col :span="22"
                    class="goods_message_box">
              <!-- 商品信息 -->
              <el-row :gutter="20">
                <el-col :span="19"><span class="demand">
                    <h2>{{item.topic}}</h2>
                  </span></el-col>
                <el-col :span="5"
                        class="time"><span>发布时间: <i>{{item.createTime}}</i></span></el-col>
              </el-row>

              <el-row class="delete_btn">
                <el-col :span="2">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click="delete_btn(item.id)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="sizes, prev, pager, next, jumper, total"
                     :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 需求商品新旧程度表   为下拉菜单提供
      opt: [
        {
          value: '1',
          label: '1成新'
        },
        {
          value: '2',
          label: '2成新'
        },
        {
          value: '3',
          label: '3成新'
        },
        {
          value: '4',
          label: '4成新'
        },
        {
          value: '5',
          label: '5成新'
        },
        {
          value: '6',
          label: '6成新'
        },
        {
          value: '7',
          label: '7成新'
        },
        {
          value: '8',
          label: '8成新'
        },
        {
          value: '9',
          label: '9成新'
        },
        {
          value: '10',
          label: '10成新'
        }
      ],

      // 分页查询商品信息
      queryInfo: {
        // 当前页
        currentPage: 1,
        pageSize: 10,
        searchCondition: {
          // 分类的id
          categoryId: '',
          // 商品的id
          id: '',
          //标题
          topic: '',
          //发布者id
          consumerId: ''
        }
      },
      // 需求的记录数
      totalCount: 0,
      // 需求列表
      demand_List_Obj: []
    }
  },
  created() {
    this.getDemands()
  },
  methods: {
    // 监听页面大小的变化
    handleSizeChange(newSize) {
      // console.log();
      this.queryInfo.pageSize = newSize
      this.getGoods()
    },
    // 监听当前页面的切换
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.currentPage = newCurrentPage
      this.getGoods()
    },
    // 监听搜索按钮
    getDemandsBySearchCondition() {
      this.getDemands()
    },
    // 监听重置按钮
    resetSearch() {
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.productName = ''
      this.queryInfo.searchCondition.oldDegree = ''
      // 输入框重置之后,重新发起请求,获取列表
      this.getDemands()
    },
    // 请求服务器 得到列表数据
    async getDemands() {
      const { data: res } = await this.$http.post(
        'goods/admin/demand',
        this.queryInfo
      )
      console.log(res)
      if (res.code !== 200) {
        // 获取商品数据失败
        return this.$Message.error('加载需求列表失败')
      } else {
        this.demand_List_Obj = res.data.data
        console.log(this.demand_List_Obj)
        this.totalCount = res.data.totalCount
        this.$Message.success('加载需求列表成功')
      }
    },
    // 监听下架按钮
    async delete_btn(id) {
      // console.log(id)
      // 弹框提示用户是否要删除
      const confimResult = await this.$confirm(
        '此操作将删除该需求,是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confimResult != 'confirm') {
        return this.$Message.info('取消')
      }
      // console.log('确认了')
      const { data: res } = await this.$http.delete(`user/admin/goods/${id}`)
      if (res.code !== 200) {
        // 失败
        return this.$Message.error('删除失败,请稍后重试')
      } else {
        // 成功
        this.$Message.success('删除成功!!!')
        this.getGoods()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container_box {
  height: 80px;
  margin: 20px 0px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.main_img_box {
  height: 80px;
  display: flex;
  // justify-content: center;
  padding-left: 20px;
  align-items: center;
}
.main_img {
  height: 60px;
}

// 更多按钮
.delete_btn {
  height: 46px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.goods_message_box {
  .el-row .el-col {
    margin-top: 6px;
    height: 46px;
    overflow: hidden;
  }
}
// 需求
.demand {
  font-size: 14px;
  color: #333;
  line-height: 21px;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  i {
    font-style: normal;
    font-size: 13px;
  }
}
// 发布时间
.time {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  span {
    display: inline-block;
    font-size: 12px;
    color: #333;
    line-height: 21px;
    i {
      font-size: 12px;
    }
  }
}

// 更多
.el-dropdown-menu {
  padding: 0;
  margin: 0;
}
.el-dropdown-menu__item {
  line-height: 30px;
}
</style>