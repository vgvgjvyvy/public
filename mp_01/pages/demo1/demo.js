// pages/demo1/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: 'hello world',
    imgSrc: '/static/images/loong.jpeg',
    randomNum1: Math.random() * 10,
    randomNum2: Math.random().toFixed(2),
    count: 0,
    msg: '你好',
    type: 1,
    flag: true,
    arr1: ['苹果', '华为', '小米'],
    userList: [{
        id: 1,
        name: '小红'
      },
      {
        id: 2,
        name: '小黄'
      },
      {
        id: 1,
        name: '小绿'
      },
    ]
  },

  // 定义按钮的事件处理函数
  btnTapHandler(e) {
    console.log(e);
  },

  // +1 按钮的事件处理函数
  CountChange() {
    this.setData({
      count: this.data.count + 1
    })
  },

  btnTap2(e) {
    this.setData({
      count: this.data.count + e.target.dataset.info
    })
  },

  // input 输入框的事件处理函数
  inputHandler(e) {
    this.setData({
      msg: e.detail.value
    })
  },

  // 通过编程式导航跳转到 tabBar 页面
  goToDemo2() {
    wx.switchTab({
      url: '/pages/demo2/demo'
    })
  },

  // 通过编程式导航跳转到 tabBar 页面
  goToInfo() {
    wx.navigateTo({
      url: '/pages/info/info'
    })
  },

  goToInfo2() {
    wx.navigateTo({
      url:'/pages/info/info?name=ls&gender=男'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})