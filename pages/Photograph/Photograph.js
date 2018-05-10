// pages/Photograph/Photograph.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: 'maruizes',
    choosed: true,
    isFree: 2,
    SeriseID: 0,
    Uid: 0,
    CurrentModelID: 0,
    isLoading: false,
    series_showBackGroud: '',
    pageLoad: false,
    price: 0,
    guid_text_1: '',
    guid_text_2: '',
    isShare: false,
    isDisplayPay: false,
    isDisplayGuide: false,
    more: false
  },

  isDisplayGuideBind: function () {
    let that = this;
    app.globalData.isDisplayGuideApp = false;
    that.setData({ isDisplayGuide: app.globalData.isDisplayGuideApp });
  },

  toAgree: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/toAgree/toAgree`,
    })
  },

  isChoosed: function () {
    let that = this;
    that.setData({ choosed: !that.data.choosed })
  },

  toHome: function () {
    let that = this;
    if (!that.data.isShare) {
      let pages = getCurrentPages(),
        delta;
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].route == 'pages/faceHome/faceHome') {
          delta = pages.length - i - 1;
          break;
        }
      }
      wx.navigateBack({ delta });
    } else {
      wx.reLaunch({
        url: `/pages/faceHome/faceHome`,
      })
    }

  },

  toFaceChange: function () {
    let that = this;

  },

  //获取系列详情
  GetSeriseDetail: function () {
    let that = this;
    app.faceChange.GetSeriseDetail(that.data.SeriseID).then(res => {
      console.log('获取系列详情', res.data);
      if (res.success) {
        that.setData({ pageLoad: true, isFree: res.data.SPayStatus, series_showBackGroud: res.data.serise.series_showBackGroud, price: res.data.serise.price, guid_text_1: res.data.serise.guid_text_1, guid_text_2: res.data.serise.guid_text_2 })
      } else {
        if (res.status == 6028) {
          if (that.data.more) {
            wx.redirectTo({
              url: `/pages/moreSeries/moreSeries`,
            })
          } else {
            let pages = getCurrentPages(),
              delta;
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].route == 'pages/faceHome/faceHome') {
                delta = pages.length - i - 1;
                break;
              }
            }
            wx.navigateBack({ delta });
          }

        }
      }
    })
  },

  toChooseImage: function () {
    let that = this;
    if (app.globalData.isDisplayGuideApp) {
      app.globalData.isDisplayGuideApp = false;
      that.setData({ isDisplayGuide: app.globalData.isDisplayGuideApp });
      return;
    }
    if (that.data.choosed) {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          that.setData({ isLoading: true });
          wx.uploadFile({
            url: `https://facechange.codebook.com.cn/FCAPI/FaceSerise/CreateFaceImage?SeriseID=${that.data.SeriseID}&Uid=${that.data.Uid}&CurrentRoleID=0`,
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {},
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log('data', data)
              if (data.success) {
                if (data.data.path.indexOf('https') == -1) {
                  data.data.path = data.data.path.replace(/http/g, "https");
                } else {
                  console.log(data.data.path.indexOf('https'));
                }
                wx.navigateTo({
                  url: `/pages/makePhoto/makePhoto?path=${data.data.path}&roleID=${data.data.roleID}&modelID=${data.data.modelID}&CurrentSeriseID=${that.data.SeriseID}&price=${that.data.price}&share_img=${data.data.share_img}&share_title=${data.data.share_title}`,
                  success: function () {
                    that.setData({ isLoading: false })
                  }
                });
              } else {
                that.setData({ isLoading: false })
                wx.showToast({
                  title: '无法识别脸部，请上传正脸图片',
                  icon: 'none'
                })
              }
            },
            fail: function (res) {
              that.setData({ isLoading: false });
              console.log(res.message);
              wx.showToast({
                title: '无法识别脸部，请上传正脸图片',
                icon: 'none'
              })
            }
          })
        }
      })
    } else {
      // console.log('请同意');
      wx.showToast({
        title: '请同意协议',
      })
    }



  },

  toMore: function(){
    let that  = this;
    wx.redirectTo({
      url: `/pages/moreSeries/moreSeries`,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    //that.setData({ userName: app.globalData.userInfo.nickname, Uid: app.globalData.userInfo.uid });
    that.setData({ SeriseID: options.id, isDisplayGuide: app.globalData.isDisplayGuideApp });
    // that.GetSeriseDetail();
    if (options.isShare) {
      that.setData({ isShare: true })
    }
    if (options.more) {
      that.setData({ more: true })
    }
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
    let that = this;
    console.log(app.globalData.uid)
    if (app.globalData.uid) {
      that.setData({ userName: app.globalData.userInfo.nickname, Uid: app.globalData.userInfo.uid });
      that.GetSeriseDetail();
    } else {
      app.uidCallback = function () {
        that.setData({ userName: app.globalData.userInfo.nickname, Uid: app.globalData.userInfo.uid });
        that.GetSeriseDetail();
      };
    }

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

  },
  paymoney: function () {
    let that = this;
    that.setData({ isDisplayPay: true })
  },
  //支付
  UserPaySerise: function () {
    let that = this;
    let BuySeriseID = that.data.SeriseID;
    app.faceChange.UserPaySerise(BuySeriseID).then(function (res) {
      console.log('支付', res.data);
      if (res.success) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            that.setData({ isDisplayPay: false, isFree: 2 });
          },
          'fail': function (res) {
            wx.showToast({
              title: '付款失败',
            })
          }
        })
      }
    })

  },
  closePay: function () {
    let that = this;
    that.setData({ isDisplayPay: false })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '逗脸',
      path: `/pages/Photograph/Photograph?isShare=true&id=${that.data.SeriseID}`,
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