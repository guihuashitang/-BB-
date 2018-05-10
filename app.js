//app.js
var Config =
  {
    // services: "http://192.168.67.164:8888/",
    services: "https://facechange.codebook.com.cn/",
    //services: "http://localhost:34602/",
    uid: 0
  };
App({
  globalData: {
    userInfo: null,
    isHoemPoint: true,
    isMakePoint: true,
    uid: 0,
    isDisplayGuideApp: true,
  },
  onShow: function (options) {
    var that = this;

  },
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var that = this;
    // console.log("options", options);
    try {
      var value = wx.getStorageSync('weixinUserInfo')
      if (value) {
        that.globalData.userInfo = value;
        Config.uid = value.uid;
        that.globalData.uid = value.uid;
        console.log("Config.uid ", Config.uid)
      } else {
        that.userLogin();
      }
    } catch (e) {
      that.userLogin();
    }

  },
  onHide: function () {
    var that = this;

  },

  userLogin: function (cb) {
    var that = this;
    //用户登录
    wx.login
      (
      {
        success: function (res) {
          console.log('code',res)
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (userinfo_res) {
                console.log('userinfo_res',userinfo_res)
                wx.request(
                  {
                    url: Config.services + 'FCAPI/FaceSerise/UserLogin',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv, appcode: 'CD_ChangeFace', userinfo: userinfo_res.userInfo },
                    success: function (res) {
                      console.log('res',res)
                      //保存到全局
                      that.globalData.userInfo = res.data.data;
                      Config.uid = res.data.data.uid;
                      that.globalData.uid = res.data.data.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if (that.uidCallback) {
                        that.uidCallback()
                      }

                    },
                    fail: function (res) {
                      wx.showToast
                        (
                        {
                          title: "获取用户信息失败",
                          icon: 'success',
                          duration: 2000
                        }
                        )
                    }
                  }
                )
              },
              fail: function () {
                wx.openSetting({
                  success: (res) => {
                    that.userLogin();
                  }
                })

              }
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
  },


faceChange: {
  //获取首页展示的系列列表
  GetHomePageSeriseList: function () {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/GetHomePageSeriseList`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)//在异步操作成功时调用
          } else {
            reject(res);//在异步操作失败时调用
          }
        }
      })
    })
  },
  //根据提供系列ID，返回系列详细内容
  GetSeriseInfoBySeriseID: function (SeriseID) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/GetSeriseInfoBySeriseID?SeriseID=${SeriseID}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
  //打开相册选择图片，然后生成融合图片，返回图片URL
  CreateFaceImage: function (SeriseID, CurrentRoleID) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/CreateFaceImage?SeriseID=${SeriseID}&Uid=${Config.uid}&CurrentRoleID=${CurrentRoleID}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
//摇一摇生成图片接口
  ShakeCreateFaceImage: function (CurrentSeriseID, CurrentRoleID) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/ShakeCreateFaceImage?CurrentSeriseID=${CurrentSeriseID}&Uid=${Config.uid}&CurrentRoleID=${CurrentRoleID}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },

//根据角色ID获取角色更多信息
  GetRoleDetail: function (RoleID) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/GetRoleDetail?RoleID=${RoleID}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
//保存合成图片到本地
  DownLoadMergeImage: function (MergedFaceImageURL, ShowBarText, Wx_PagePath, CurrentSeriseID,uid) {
    console.log("进入保存合成图片到本地" + ShowBarText)
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/DownLoadMergeImage`,
        method: "POST",
        header: { 'content-type': 'application/json' },
        data: { MergedFaceImageURL: MergedFaceImageURL, ShowBarText: ShowBarText, Wx_PagePath: Wx_PagePath, CurrentSeriseID: CurrentSeriseID, uid: uid},
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
            console.log(res)
          }
        },
        fail:function(err) {
          console.log("进入失败",err)
        },
        complete:function(res){
          console.log("wanchengqingqiu",res)
        }

      })
    })
  },
  //支付接口
  UserPaySerise: function (BuySeriseID ) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/UserPaySerise?BuySeriseID=${BuySeriseID}&Uid=${Config.uid}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
  //系列详情
  GetSeriseDetail: function (SeriseID) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `${Config.services}FCAPI/FaceSerise/GetSeriseDetail?SeriseID=${SeriseID}&Uid=${Config.uid}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
  //更多系列
  GetSeriseList: function (pageIndex, pageSize) {
    return new Promise(function (resolve, reject) {
      wx.request({
        // url: `${Config.services}FCAPI/FaceSerise/GetSeriseDetail?SeriseID=${SeriseID}&Uid=${Config.uid}`,
        url: `${Config.services}FCAPI/FaceSerise/GetSeriseList?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(res);
          }
        }
      })
    })
  },
},
})