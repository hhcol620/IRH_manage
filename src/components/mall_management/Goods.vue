<template>
  <div>
    <!-- 商品管理模块 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>商城管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品列表区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入商品ID"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.id"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-input placeholder="请输入商品名称"
                    class="input-with-select"
                    v-model="queryInfo.searchCondition.productName"
                    clearable>
          </el-input>
        </el-col>
        <el-col :span="5">
          <!--搜索框-->
          <el-select v-model="queryInfo.searchCondition.oldDegree"
                     placeholder="请选择新旧程度">
            <el-option v-for="item in opt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getGoodsBySearchCondition">搜索</el-button>
          <el-button class="primary"
                     @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
      <div class="container">
        <div class="container_box"
             v-for="item in goods_List_Obj"
             :key="item.id">
          <el-row>
            <el-col :span="4"
                    class="main_img_box">
              <!-- 这是主图 -->
              <img :src="$store.state.ImgUrl + item.mainPicUrl"
                   alt=""
                   class="main_img">
            </el-col>
            <el-col :span="19"
                    class="goods_message_box">
              <!-- 商品信息 -->
              <el-row>
                <el-col :span="6"><span class="proName">商品名称: <i>{{item.productName}}</i></span></el-col>
                <el-col :span="6"><span>商品ID: <i>{{item.id}}</i></span></el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span>商品原价: <i class="originalPrice">{{item.originalPrice}}</i></span>

                </el-col>
                <el-col :span="6">
                  <span>商品售卖价格: <i class="salePrice">{{item.salePrice}}</i></span>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tradeType">交易类型: {{item.tradeType | tradeType}}</el-col>
              </el-row>
              <el-row>
                <el-col>商品详情页: <a :href="item.productDetailsPage"
                     class="proBtn">戳这里</a></el-col>
              </el-row>
              <el-row>
                <el-col class="goods_description">
                  <span>商品描述: <i>{{item.productDesc}}</i></span>
                </el-col>
              </el-row>
              <el-row class="down_btn">
                <el-col :span="4">
                  <el-button size="mini"
                             type="warning"
                             @click="down_btn(item.id)">下架</el-button>
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
      // 商品新旧程度表   为下拉菜单提供
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
          // 新旧程度   1 - 10  数值越大,越新
          oldDegree: '',
          // 商品名称
          productName: '',
          // 交易类型    10 正常交易 20 公益捐赠
          tradeType: ''
        }
      },
      // 商品的记录数
      totalCount: 0,
      // 存取商品列表
      goods_List_Obj: {}
    }
  },
  created() {
    this.getGoods()
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
    getGoodsBySearchCondition() {
      this.getGoods()
    },
    // 监听重置按钮
    resetSearch() {
      this.queryInfo.searchCondition.id = ''
      this.queryInfo.searchCondition.productName = ''
      this.queryInfo.searchCondition.oldDegree = ''
      // 输入框重置之后,重新发起请求,获取列表
      this.getGoods()
    },
    // 请求服务器 得到列表数据
    async getGoods() {
      const { data: res } = await this.$http.post(
        'goods/admin/es/list',
        this.queryInfo
      )
      console.log(res)
      if (res.code !== 200) {
        // 获取商品数据失败
        return this.$Message.error('加载商品列表失败')
      } else {
        this.goods_List_Obj = res.data.data
        console.log(this.goods_List_Obj)
        this.totalCount = res.data.totalCount
        this.$Message.success('加载商品列表成功')
      }
    },
    // 监听下架按钮
    async down_btn(id) {
      // console.log(id)
      // 弹框提示用户是否要删除
      const confimResult = await this.$confirm(
        '此操作将下架该商品,是否继续',
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
        return this.$Message.error('下架失败,请稍后重试')
      } else {
        // 成功
        this.$Message.success('下架成功!!!')
        this.getGoods()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container_box {
  height: 200px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.main_img_box {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.main_img {
  height: 160px;
}
.goods_message_box {
  margin-top: 6px;
  .el-row {
    margin: 8px 0;
    font-size: 14px;
    color: #333;
    font-style: normal;
    font-weight: 500;
  }
}
.goods_description {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
// 下架
.down_btn {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
// 商品名称
.proName {
  i {
    display: inline-block;
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
// 原价样式
.originalPrice {
  text-decoration: line-through;
  text-decoration-color: #eb2f06;
  font-weight: 300;
  font-size: 20px;
}
// 售价样式
.salePrice {
  font-size: 20px;
  color: #333;
  font-style: normal;
  font-weight: 500;
}
</style>