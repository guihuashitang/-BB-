// pages/moreSeries/moreSeries.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreList: [],
    widthN: 100,
    pageIndex: 1,
    pageSize: 18,
    pageLoad: false,
    pageMore: false,
    pageLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.GetSeriseList();
    //获取屏幕宽高 
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        console.log(windowWidth)
        var now_width = (windowWidth - 75)/3;
        console.log(now_width)
        that.setData({ widthN: now_width });
      }
    })
  },

  GetSeriseList: function(){
    let that = this;
    let { moreList} = that.data;
    app.faceChange.GetSeriseList(that.data.pageIndex, that.data.pageSize).then(res=>{
      if(res.success){
        console.log(res)
        that.setData({ pageLoad: true })
        if (res.totalCount == moreList.length) {
          console.log(res.totalCount == moreList.length)
          that.setData({ pageMore: true, pageLoading: false })
          return
        }
        if (res.totalCount<18){
          that.setData({ pageMore: true, pageLoading: false })
        }
        moreList = moreList.concat(res.data)
        that.setData({ moreList });
      }
    })
  },

  toBottom: function () {
    let that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    console.log('bottom')
    that.setData({ pageIndex })
    if (that.data.pageLoading && !that.data.pageMore) {
      that.GetSeriseList();
    }
  },

  toPhoto: function (e) {
    let that = this;
    let { id } = e.currentTarget.dataset;
    console.log(id)
    wx.redirectTo({
        url: `/pages/Photograph/Photograph?id=${id}&more=true`,
      })

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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  let that = this;
  that.toBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})