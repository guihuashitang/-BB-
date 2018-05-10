// pages/makePhoto/makePhoto.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    isFirst: app.globalData.isMakePoint,
    isDetail: '',
    txt: '查看详情',
    isDisplayPay: false,
    isSave: false,
    shakeData: {
      x: 0,
      y: 0,
      z: 0
    },
    isEnable: true,
    pageLoad: true,
    path: '',
    roleID: 0,
    CurrentSeriseID: 0,
    CurrentModelID: 0,
    status: 0,
    rotate: '',
    price: 0,
    share_guid_text: '',
    moredetail: '',
    imagewidth: '100%',//缩放后的宽 
    imageheight: '100%',//缩放后的高 
    position: '0%',
    moredetailBackimage: '',
  },

  toDetails: function () {
    let that = this;
    if (!app.globalData.isMakePoint) {
      if (that.data.isDetail == '') {
        that.setData({ isDetail: 'isDetail', txt: '回到角色', rotate: 'rotate' })
        setTimeout(function () {
          that.setData({ dis: 'dis' })
        }, 400)
      } else {
        that.setData({ isDetail: '', txt: '查看详情', rotate: '' })
        setTimeout(function () {
          that.setData({ dis: '' })
        })
      }
    } else {
      app.globalData.isMakePoint = false
      that.setData({ isFirst: app.globalData.isMakePoint })
    }
  },

  imageUtil: function (e) {
    let that = this;
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽 
    var originalHeight = e.detail.height;//图片原始高 
    var originalScale = originalWidth / originalHeight;//图片高宽比 
    //获取屏幕宽高 
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale  = windowHeight / windowWidth;//屏幕高宽比 
        //高为标准
        var now_height = originalHeight * originalScale ;
        var now_width = originalScale * (windowHeight-80)
        that.setData({ imagewidth: now_width, imageheight: windowHeight - 80, position: '50%' });


        //宽为标准
        // var now_height = windowWidth / originalScale;
        // var now_width = originalScale * (windowHeight - 80)
        // that.setData({ imagewidth: windowWidth-45, imageheight: now_height, position: '50%' });


        //没用
        // if (originalScale > windowscale){
        //   that.setData({ imagewidth: now_width, imageheight: windowHeight-80, position: '50%' });
        // }else{
        //   that.setData({ imagewidth: windowWidth-45, imageheight: now_height, position: '50%' });
        // }
      }
    })
  },
  closePay: function () {
    let that = this;
    that.data.isEnable = true;
    that.setData({ isDisplayPay: false })
  },
  //保存图片
  toSavePhoto: function () {
    let that = this;
    that.setData({ pageLoad: false });
    let MergedFaceImageURL = that.data.path;
    let ShowBarText = that.data.share_guid_text;
    let Wx_PagePath = '/pages/Photograph/Photograph?isShare=true&id=' + that.data.CurrentSeriseID;
    let CurrentSeriseID = that.data.CurrentSeriseID;
    console.log('保存图片toSavePhoto');
    app.faceChange.DownLoadMergeImage(MergedFaceImageURL, ShowBarText, Wx_PagePath, CurrentSeriseID, app.globalData.uid).then(function (res) {
      console.log('DownLoadMergeImage111', res)
      if (res.success) {
        console.log('DownLoadMergeImage222', res);
        if (res.data.path.indexOf('https:') == -1) {
          res.data.path = res.data.path.replace(/http:/g, "https:");
          if (res.data.path.indexOf('https://f3.5rs.me:443/') !== -1) {
            res.data.path = res.data.path.replace(/me:443/g, "me");
            console.log('c',res.data.path)
          }
        } else {
          if (res.data.path.indexOf('https://f3.5rs.me:443/') !== -1) {
            res.data.path = res.data.path.replace(/me:443/g, "me");
          }
          console.log('保存图片',res);
        }
        let path = res.data.path;
        wx.getSetting({
          success: function (res) {
            console.log('授权',res)
            if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] != undefined) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: function () {
                  // 用户已经授权保存相册
                  that.downLoadImg(path);
                },
                fail: function () {
                  console.log("保存成功")
                  // 用户没有授权保存相册
                  wx.openSetting({
                    success: function (res) {
                      // 用户已经授权保存相册
                      that.downLoadImg(path);
                    },
                    fail: function (res) {
                    }
                  })
                }
              })
            } else {
              // 用户已经授权保存相册
              that.downLoadImg(path);
            }
          }
        })
      } else {
        wx.showToast({
          title: '请上传正脸图片',
        })
      }
    })

  },

//下载图片
downLoadImg: function(imgUrl){
let that = this;
  console.log('下载xxxxx', imgUrl);
wx.downloadFile({
  url: imgUrl,
  success: function (res) {
    console.log('下载', res);
    var filePath = res.tempFilePath;
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function (res) {
        that.setData({ pageLoad: true, isSave: true });
      },
      fail: function (res) {
        console.log('保存失败', res)
        that.setData({ pageLoad: true });
      }
    })
  },
  fail: function (res) {
    console.log('下载失败', res)
    that.setData({ pageLoad: true });
  }
})
},

  saveSuccess: function () {
    let that = this;
    that.setData({ isSave: false })
  },

  //摇一摇
  shake: function () {
    let that = this;
    var count = 0;
    wx.onAccelerometerChange(function (res) {
      var x = res.x.toFixed(4);
      var y = res.y.toFixed(4);
      var z = res.z.toFixed(4);
      var flagX = that.getNumShake(that.data.shakeData.x, x);
      var flagY = that.getNumShake(that.data.shakeData.y, y);
      var flagZ = that.getNumShake(that.data.shakeData.z, z);
      that.data.shakeData = {
        x: res.x.toFixed(4),
        y: res.y.toFixed(4),
        z: res.z.toFixed(4)
      }
      if (flagX && flagY || flagX && flagZ || flagY && flagZ) {
        console.log(flagX, flagY, flagZ)
        if (that.data.isEnable) {
          that.setData({ isLoading: true, dis: '', rotate: '' });
          that.data.isEnable = false;
          that.playShakeMusic();
          that.ShakeCreateFaceImage();
        }

      }
    })
  },

  //摇一摇生成图片
  ShakeCreateFaceImage: function () {
    let that = this;
    app.faceChange.ShakeCreateFaceImage(that.data.CurrentSeriseID, that.data.roleID).then(function (res) {
      if (res.success) {
        console.log('res', res)
        // console.log(res.status)
        if (res.status == 6027) {
          that.setData({ isDisplayPay: true, isLoading: false, status: res.status });
        } else {
          // console.log('摇一摇生成图片接口', res.data);
          if (res.data.path.indexOf('https') == -1) {
            res.data.path = res.data.path.replace(/http/g, "https");
          } else {
            console.log(res.data.path.indexOf('https'));
          }
          that.data.isEnable = true;
          that.setData({ path: res.data.path, roleID: res.data.roleID, status: res.status, share_title: res.data.share_title,share_img: res.data.share_img});
          that.GetRoleDetail();
        }
      }
    })
  },

  //摇一摇播放
  playShakeMusic: function () {
    let that = this;
    console.log('播放')
    wx.playBackgroundAudio({
      dataUrl: 'http://image.chubanyun.net/sound/face/wx_shake.mp3',
      title: '摇一摇',
      success: function (res) {

      }
    })

  },

  //支付
  UserPaySerise: function () {
    let that = this;
    let BuySeriseID = that.data.CurrentSeriseID;
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
            that.data.isEnable = true;
            that.setData({ isDisplayPay: false, status: 0 });
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

  //计算摇一摇
  getNumShake: function (val1, val2) {
    return (Math.abs(val1 - val2) >= 1);
  },

  //根据角色ID获取角色更多信息
  GetRoleDetail: function () {
    let that = this;
    app.faceChange.GetRoleDetail(that.data.roleID).then(function (res) {
      if (res.success) {
        if (res.data.moredetailBackimage==null ){
          res.data.moredetailBackimage  = ''
        }
        that.setData({ moredetail: res.data.moredetail, share_guid_text: res.data.share_guid_text, role_name: res.data.role_name, isLoading: false, moredetailBackimage: res.data.moredetailBackimage })
      }
    })
  },

  shakeClick: function(){
    let that = this;
    if (that.data.isEnable) {
      that.setData({ isLoading: true, dis: '', rotate: '' });
      that.data.isEnable = false;
      that.playShakeMusic();
      that.ShakeCreateFaceImage();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({ CurrentSeriseID: options.CurrentSeriseID, path: options.path, roleID: options.roleID, price: options.price, share_img: options.share_img, share_title: options.share_title })
    that.data.isEnable = true;
    that.GetRoleDetail();
    that.shake();
    that.setData({ isFirst: app.globalData.isMakePoint });
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
    // let that = this;
    // that.data.isEnable = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    that.data.isEnable = false
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
      title:  that.data.share_title,
      path: `/pages/Photograph/Photograph?isShare=true&id=${that.data.CurrentSeriseID}`,
      imageUrl: that.data.share_img,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})