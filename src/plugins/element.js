/*
 * @Author: your name
 * @Date: 2019-11-30 10:43:48
 * @LastEditTime: 2019-12-01 09:23:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pro\src\plugins\element.js
 */
import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    RadioGroup,
    Radio,
    Tabs,
    TabPane,
    Dropdown,
    DropdownItem,
    DropdownMenu
} from 'element-ui'
/* import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
// 导入弹框提示组件
import {Message} from 'element-ui' */


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
// 把Message挂载vue的原型对象上,都可以通过this访问$Message
Vue.prototype.$Message = Message
Vue.prototype.$confirm = MessageBox.confirm