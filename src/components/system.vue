<template>
  <div>
    <!-- 这是  图表模块 -->
    <!-- 这是帖子分类的模块 -->
    <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域 -->
    <el-card>

      <el-collapse accordion
                   v-model="active">
        <!-- 服务器信息 -->
        <el-collapse-item title="服务器信息"
                          name="system">
          <el-collapse v-model="activeName">
            <el-collapse-item name="first">
              <template slot="title">
                <div class="title"> 1号服务器信息<i class="header-icon el-icon-info"></i></div>
              </template>
              <div class="container_box">
                <div class="box">
                  <div id="myChartWhater_cpu_1"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">cpu利用率</p>
                </div>
                <div class="box">
                  <div id="myChartWhater_storage_1"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">内存利用率</p>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="second">
              <template slot="title">
                <div class="title"> 2号服务器信息<i class="header-icon el-icon-info"></i></div>
              </template>
              <div class="container_box">
                <div class="box">
                  <div id="myChartWhater_cpu_2"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">cpu利用率</p>
                </div>
                <div class="box">
                  <div id="myChartWhater_storage_2"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">内存利用率</p>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="third">
              <template slot="title">
                <div class="title"> 3号服务器信息<i class="header-icon el-icon-info"></i></div>
              </template>
              <div class="container_box">
                <div class="box">
                  <div id="myChartWhater_cpu_3"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">cpu利用率</p>
                </div>
                <div class="box">
                  <div id="myChartWhater_storage_3"
                       :style="{width: '340px', height: '220px',}"
                       class="echart"></div>
                  <p class="description">内存利用率</p>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>

        <el-collapse-item title="用户注册"
                          name="user">
          <div class="container_box">
            <div class="box_user">
              <!-- 日期选择器 -->
              <div class="time_select">

                <el-select v-model="time"
                           placeholder="请选择时间段"
                           size="mini"
                           @change="changeReq">
                  <el-option label="最近一周"
                             value="1"></el-option>
                  <el-option label="最近一个月"
                             value="2"></el-option>
                  <el-option label="最近半年"
                             value="3"></el-option>
                  <el-option label="最近一年"
                             value="4"></el-option>

                </el-select>
              </div>
              <div id="userMessage"
                   :style="{width: '1000px', height: '500px',}"
                   class="userechart"></div>
              <p class="userechartdescription"><span>用户信息</span></p>
            </div>
            <div class="box"></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
// 水球
import 'echarts-liquidfill/src/liquidFill.js'
export default {
  data() {
    return {
      userTrend: {},

      // 1号服务器信息
      /*first: {
        cpuscore: 0.3,
        cpuhealthyName: '良好',
        storagescore: 0.8,
        storagehealthyName: '良好'
      },
      second: {
        cpuscore: 0.7,
        cpuhealthyName: '良好',
        storagescore: 0.7,
        storagehealthyName: '良好'
      },
      third: {
        cpuscore: 0.7,
        cpuhealthyName: '良好',
        storagescore: 0.7,
        storagehealthyName: '良好'
      },*/
      // 默认打开的折叠面板
      active: 'system',
      activeName: 'first',
      // 时间选择器
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
      },
      time: '1'
    }
  },
  created() {
    // 页面加载   默认请求一周
    this.changeReq(1)
  },
  // dom渲染完毕   执行下面的生命周期函数
  mounted() {
    // 1号服务器
    this.initWater(
      'myChartWhater_cpu_1',
      this.first.cpuscore,
      this.first.cpuhealthyName
    )
    this.initWater(
      'myChartWhater_storage_1',
      this.first.storagescore,
      this.first.storagehealthyName
    )
    // 二号服务器
    this.initWater(
      'myChartWhater_cpu_2',
      this.second.cpuscore,
      this.second.cpuhealthyName
    )
    this.initWater(
      'myChartWhater_storage_2',
      this.second.storagescore,
      this.second.storagehealthyName
    )
    // 三号服务器
    this.initWater(
      'myChartWhater_cpu_3',
      this.third.cpuscore,
      this.third.cpuhealthyName
    )
    this.initWater(
      'myChartWhater_storage_3',
      this.third.storagescore,
      this.third.storagehealthyName
    )
    this.initUserMessage()
  },
  methods: {
    // 水球
    initWater(id, score, name) {
      let value = score
      let myChart = echarts.init(document.getElementById(id))
      let colorScore = score * 100
      let colorList = []
      if (colorScore >= 80) {
        let color1 = 'rgb(240,60,0)'
        let color2 = 'rgb(255,40,0)'
        colorList.push(color1)
        colorList.push(color2)
      } else if (colorScore >= 60 && colorScore < 80) {
        let color1 = 'rgb(161,253,60)'
        let color2 = 'rgb(150,250,60)'
        colorList.push(color1)
        colorList.push(color2)
      } else if (colorScore < 60) {
        let color1 = 'rgb(68,207,46)'
        let color2 = 'rgb(60,200,40)'
        colorList.push(color1)
        colorList.push(color2)
      }
      var data = []
      data.push(value)
      data.push(value)
      myChart.setOption({
        backgroundColor: 'white', //容器背景颜色
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: 'rgb(97, 142, 205)'
          }
        },
        series: [
          {
            type: 'liquidFill',
            radius: '100%', //水球的半径
            data: data,
            backgroundStyle: {
              color: 'white'
            },
            label: {
              normal: {
                formatter:
                  '{a|' +
                  (value * 100).toFixed(2) +
                  '}' +
                  '%' +
                  ' ' +
                  '\n' +
                  '\n' +
                  '{b|' +
                  name +
                  '}',
                textStyle: {
                  fontSize: 18, //字体大小
                  // 设置字体颜色
                  color: '#3498db'
                },
                position: ['50%', '50%'],
                rich: {
                  //富文本 对字体进一步设置样式。a对应的value,b对应的healthyName
                  a: {
                    fontSize: 60,
                    lineHeight: 10,
                    fontWeight: 'bold',
                    padding: [0, 0, 0, 20]
                  },
                  b: {
                    fontSize: 30,
                    lineHeight: 30,
                    fontWeight: 'bold'
                  }
                }
              }
            },
            outline: {
              show: true, //是否显示轮廓 布尔值
              borderDistance: 0, //外部轮廓与图表的距离 数字
              itemStyle: {
                borderColor: '#edf2f6', //边框的颜色
                borderWidth: 1 //边框的宽度
              }
            },
            color: [...colorList]
          }
        ]
      })
    },
    // 用户信息
    initUserMessage() {
      let userEchart = echarts.init(document.getElementById('userMessage'))
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            // saveAsImage: { show: true }
            // 这个就是右上角几个功能   只保留一个保存为图片
            // dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ['line', 'bar'] },
            // restore: { show: true },
          }
        },
        legend: {
          data: ['总人数', '新增人数']
        },
        xAxis: [
          {
            type: 'category',
            data: this.userTrend.abscissaUnit,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '总人数',
            min: 0,
            max: this.userTrend.max,
            interval: this.userTrend.interval,
            axisLabel: {
              formatter: '{value} 人'
            }
          }
        ],
        series: [
          {
            name: '总人数',
            type: 'line',
            smooth: true, //平滑曲线显示
            showAllSymbol: true, //显示所有图形。
            symbol: 'circle', //标记的图形为实心圆
            symbolSize: 10, //标记的大小
            itemStyle: {
              //折线拐点标志的样式
              color: '#058cff'
            },
            lineStyle: {
              color: '#058cff'
            },
            areaStyle: {
              color: 'rgba(5,140,255, 0.2)'
            },
            data: this.userTrend.userTotals
          },
          {
            name: '新增人数',
            type: 'bar',
            data: this.userTrend.increments
          }
        ]
      }
      userEchart.setOption(option)
    },
    // 监听选择时间段的事件   在这里发起请求
    async changeReq(type) {
      const { data: res } = await this.$http.get(`user/system/userTrend/${type}`)
      if(res.code != 200){
        return this.$Message.error('查询失败')
      }else {
        this.userTrend = res.data;
        this.initUserMessage()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container_box {
  display: flex;
  .box {
    width: 50%;
    .echart {
      margin: 0 auto;
    }
    p.description {
      text-align: center;
      color: #666;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .box_user {
    position: relative;
    .userechartdescription {
      text-align: center;
    }
  }
}
div.title {
  margin-left: 30px;
}
.time_select {
  z-index: 999;
  position: absolute;
  left: 70%;
}
</style>