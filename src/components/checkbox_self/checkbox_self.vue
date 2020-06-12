<template>
  <div>
    <div v-for="item in arrList"
         :key="item.id"
         class="Item_check"><input type="checkbox"
             name="checkOrder"
             :value="item.id"
             :id="item.id"
             ref="checkbox"
             @change="checkBoxData" />
      <label :for="item.id">
        <div class="content">
          <div class="code">订单号 : {{item.orderCode}}</div>
          <div class="price">成交价格: {{item.price|savePrecision}}</div>
        </div>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: ['arrList'],
  data() {
    return {
      arrl: []
    }
  },
  created() {},
  methods: {
    checkBoxData(e) {
      // console.log(this.$refs.checkbox)
      let arr = this.$refs.checkbox
      let str = ''
      let arrl = []
      arr.map((v, i) => {
        if (v.checked === true) {
          let val = v.value
          str = !str ? str + v.value : str + ',' + v.value
          arrl.push(val)
          v.parentElement.style = 'border:1px solid #3498db'
        } else {
          v.parentElement.style = 'border:1px solid #d1d1d1'
        }
      })
      this.$emit('getstr', str)
      let count = 0
      let list = this.arrList
      list.forEach((v, i) => {
        arrl.forEach((p, q) => {
          if (v.id == p) {
            count += v.price
          }
        })
      })
      this.arrl = arrl
      console.log(count)
      this.$emit('input', count)
    }
  },
  computed: {}
}
</script>
<style lang="less" scoped>
.Item_check {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 36px;
  border: 1px solid #d1d1d1;
  margin: 6px 0;
  cursor: pointer;
  label {
    width: 100%;
    padding: 10px 0;
    cursor: pointer;
  }
  .content {
    margin-left: 20px;
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
</style>