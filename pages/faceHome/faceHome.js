// pages/faceHome/faceHome.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatordots: true,
    currentIndex: 0,
    circular: false,
    isPoint: app.globalData.isHoemPoint,
    imgList: [],
    pageLoad: false,
    imagewidth: '',//缩放后的宽 
    imageheight: '100%',//缩放后的高 
    position: '0%',
    widHei: [],
    autoplay: true
  },

  imageUtil: function (e) {
    let that = this;
    let { widHei } = that.data; 
    var imageSize = {};
    var originalWidth = e.detail.width/2;//图片原始宽 
    var originalHeight = e.detail.height/2;//图片原始高 
    var originalScale = originalWidth / originalHeight;//图片高宽比 
    //获取屏幕宽高 
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale =  windowWidth/ windowHeight ;//屏幕高宽比 
        that.setData({ windowWidth: windowWidth, windowHeight: windowHeight })
        var now_height = windowWidth / originalScale;
        var now_width = originalScale * windowHeight
        if (originalScale > windowscale) {
          console.log('a', now_width, windowHeight)
          widHei.push({ 'imagewidth': now_width, 'imageheight': windowHeight, 'position': '50%'})
        } else { 
          widHei.push({ 'imagewidth': windowWidth, 'imageheight': now_height, 'position': '50%'})
          console.log('2', windowWidth,)
        }
        that.setData({ widHei })
      }
    })
  },

  toPhoto: function(e){
    let that = this;
    var id = e.currentTarget.dataset;
    if (app.globalData.isHoemPoint){
      app.globalData.isHoemPoint = false;
      that.setData({ isPoint: app.globalData.isHoemPoint })
    }else{
      // console.log('id',id)
      wx.navigateTo({
        url: `/pages/Photograph/Photograph?id=${id.id}`,
      })
    } 

  },

//获取首页展示的系列列表
  GetHomePageSeriseList: function(){
    let that =this;
    app.faceChange.GetHomePageSeriseList().then(function(res){
       console.log('获取首页展示的系列列表',res.data);
      if(res.success){
        that.setData({ imgList: res.data, pageLoad: true });
        wx.setNavigationBarColor({
          frontColor: that.data.imgList[0].homepage_titleFontColor,
          backgroundColor: that.data.imgList[0].homepage_titleRGB,
          animation: {
            duration: 200,
            timingFunc: 'easeIn'
          }
        })
      }
    })
  },

  changeColor: function (event){
    let that = this;
    let current = event.detail.current;
    let source = event.detail.source;
    console.log('source', source)
    wx.setNavigationBarColor({
      frontColor: that.data.imgList[current].homepage_titleFontColor,
      backgroundColor: that.data.imgList[current].homepage_titleRGB,
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    if (source){
      that.setData({ currentIndex: current  })
    }
  },

  toprev: function(e){
    let that =  this;
    if (that.data.currentIndex-1>=0){
      that.setData({ currentIndex: that.data.currentIndex - 1 })
    }else{
      var id = e.currentTarget.dataset;
      if (app.globalData.isHoemPoint) {
        app.globalData.isHoemPoint = false;
        that.setData({ isPoint: app.globalData.isHoemPoint })
      } else {
        // console.log('id',id)
        wx.navigateTo({
          url: `/pages/Photograph/Photograph?id=${id.id}`,
        })
      } 
    }
  },
  toNext: function(e){
    let that = this;
    if (that.data.currentIndex + 1 < that.data.imgList.length){
      that.setData({ currentIndex: that.data.currentIndex + 1 })
    }else{
      var id = e.currentTarget.dataset;
      if (app.globalData.isHoemPoint) {
        app.globalData.isHoemPoint = false;
        that.setData({ isPoint: app.globalData.isHoemPoint })
      } else {
        // console.log('id',id)
        wx.navigateTo({
          url: `/pages/Photograph/Photograph?id=${id.id}`,
        })
      } 
    }
 
  },

  toMore: function(){
    let that = this;
    wx.navigateTo({
      url: `/pages/moreSeries/moreSeries`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.GetHomePageSeriseList();
    that.setData({ isPoint: app.globalData.isHoemPoint})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ autoplay: true })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ autoplay: false })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({ autoplay: false })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '逗脸',
      path: `pages/faceHome/faceHome`,
      // imageUrl: "http://image.chubanyun.net/images/TRQ/share.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})