<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/header-photo.jpg"
             alt />
        <span>后台管理系统</span>
      </div>
      <div>
        <el-button type="info"
                   @click="logout">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button"
             @click="toggleCollpase">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409eff"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [
        {
          authName: '系统管理',
          children: [
            {
              authName: '用户列表',
              id: '00',
              path: 'administrators'
            },
            {
              authName: '角色列表',
              id: '02',
              path: 'roles'
            },
            {
              authName: '权限列表',
              id: '03',
              path: 'rights'
            },
            {
              authName: '兴趣标签',
              id: '04',
              path: 'interest'
            }
          ],
          id: 0,
          order: 0,
          path: 'users'
        },
        {
          authName: '商城管理',
          children: [
            {
              authName: '商品管理',
              id: 11,
              path: 'Goods'
            },
            {
              authName: '商品分类',
              id: 12,
              path: 'Goods_Cate'
            },
            {
              authName: '商品推荐标签',
              id: 13,
              path: 'Goods_Tag'
            },
            {
              authName: '需求管理',
              id: 14,
              path: 'Demand'
            },
            {
              authName: '订单管理',
              id: 15,
              path: 'Order'
            }
          ],
          id: 1,
          order: 1,
          path: 'mall_management'
        },
        {
          authName: '论坛管理',
          children: [
            {
              authName: '帖子管理',
              id: 21,
              path: 'forum_post'
            },
            {
              authName: '帖子分类',
              id: 22,
              path: 'forum_cate'
            },
            {
              authName: '文章标签',
              id: 23,
              path: 'forum_list'
            }
          ],
          id: 2,
          order: 2,
          path: 'forum_management'
        },
        {
          authName: '反馈及审核',
          children: [
            {
              authName: '举报列表',
              id: 31,
              path: 'admin_report'
            },
            {
              authName: '实名审核记录',
              id: 32,
              path: 'realnameExamination'
            },
            {
              authName: '信息发布审核',
              id: 33,
              path: 'ReleaseInfoExamination'
            },
            {
              authName: '公益基金审核',
              id: 34,
              path: 'commonweal_apply'
            },
            {
              authName: '公益基金审批',
              id: 35,
              path: 'commonweal_approve'
            }
          ],
          id: 3,
          order: 3,
          path: 'audit_report'
        }
      ],
      // 是否折叠
      isCollapse: false,
      activePath: '',
      // 图标对象
      iconObj: {
        '0': 'iconfont icon-ziyuanxhdpi',
        '1': 'iconfont icon-store_icon',
        '2': 'iconfont icon-luntan',
        '3': 'iconfont icon-xingming'
      }
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // async getMenuList() {
    /* data 重命名为 res */
    // const { data: res } = await this.$http.get('menus')
    // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    // this.menuList = res.data
    // console.log(res.data)
    // console.log(this.menuList)
    // },
    /* 点击按钮 实现侧边栏的收缩与展开 */
    toggleCollpase() {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 4px;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #fff;
    /* border-width: 4px;
  border-color: #eaedf1; */
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
    margin-left: 10px;
  }
  span {
    padding-left: 6px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-button {
  line-height: 0.8em;
}

.iconfont {
  margin-right: 10px;
  font-size: 18px;
}
</style>