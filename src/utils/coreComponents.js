import Vue from 'vue'

import {
  Table, Button, Layout, Menu, Steps, DatePicker,
  Form, Input, Rate, Select, List, Calendar, Card, Tag,
  Timeline, Tooltip, message, Modal, LocaleProvider, Skeleton, Breadcrumb
  } from 'ant-design-vue'

Vue.use(Table)
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Steps)
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Rate)
Vue.use(Select)
Vue.use(Form)
Vue.use(List)
Vue.use(Calendar)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Timeline)
Vue.use(Tooltip)
Vue.use(Modal)
Vue.use(LocaleProvider)
Vue.use(Skeleton)
Vue.use(Breadcrumb)

Vue.prototype.$message = message
