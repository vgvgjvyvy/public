// custom-tab-bar/index.js
import {
  storeBindingsBehavior
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../store/store'

Component({
  behaviors: [storeBindingsBehavior], // 添加这个 behavior

  storeBindings: {
    store,
    fields: {
      sum: 'sum',
      active: "activeTabBarIndex"
    },
    actions: {
      updateActive: "updateActiveTabBarIndex"
    },
  },

  observers: {
    "sum": function (val) {
      this.setData({
        "list[0].info": val
      })
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // active: 0,
    "list": [{
        "pagePath": "/pages/message/message",
        "text": "message",
        "iconPath": "/static/icons/CRMEB-葡萄-线性.png",
        "selectedIconPath": "/static/icons/CRMEB-葡萄-面性.png",
        info: 0
      },
      {
        "pagePath": "/pages/demo2/demo",
        "text": "demo2",
        "iconPath": "/static/icons/CRMEB-桃子-线性.png",
        "selectedIconPath": "/static/icons/CRMEB-桃子-面性.png"
      },
      {
        "pagePath": "/pages/list/list",
        "text": "list",
        "iconPath": "/static/icons/CRMEB-晴天-线性.png",
        "selectedIconPath": "/static/icons/CRMEB-晴天-面性.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      // this.setData({
      //   active: event.detail
      // });
      this.updateActive(event.detail)
      wx.switchTab({
        url: this.data.list[event.detail].pagePath
      })
    },
  }
})