import request from '../../request/requestFunc.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imageUrl:'../../images/tab1/u73.png',
    name: '',
    sex: '',
    phone: '',
    age: 0,
    salaryID: '',
    clothNum: '',
    pantsNum: '',
    identification: '',
    partnerName: '',
    partnerSex: '',
    partnerPhone: '',
    partnerAge: 0,
    partnerSalaryID: '',
    partnerClothNum: '',
    partnerPantsNum: '',
    memberId:0,
    gameType:'',
    partnerIdentification: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberId: options.id,
      gameType: options.gameType
    })
    const that = this;
    let param = {
      'API_URL': '/wx/game/memberDetails',
      'data': {
        'id': that.data.memberId
      },
      'header': {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'token='+app.globalData.sessionId
      },
      'method': 'POST'
    }

    request.oneRequest.result(param).then(res => {
      if (res.data.code == '000000') {
        that.setData({
          name: res.data.result.data.name,
          phone: res.data.result.data.phone,
          identification: res.data.result.data.identification,
          sex: res.data.result.data.sex,
          age: res.data.result.data.age,
          salaryID: res.data.result.data.salaryid,
          clothNum: res.data.result.data.clothnum,
          pantsNum: res.data.result.data.pantsnum,
          partnerName: res.data.result.data.partnername,
          partnerSex: res.data.result.data.partnersex,
          partnerPhone: res.data.result.data.partnerphone,
          partnerAge: res.data.result.data.partnerage,
          partnerSalaryID: res.data.result.data.partnersalaryid,
          partnerClothNum: res.data.result.data.partnerclothnum,
          partnerPantsNum: res.data.result.data.partnerpantsnum,
          partnerIdentification: res.data.result.data.partnerIdentification
        })
      }
      
    }
    ).catch(e =>
      console.log(e)
    )
  },
  onShow: function () {
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // },

  //进入信息填写页面
  // gotoInfoPage(e){
  //   wx.navigateTo({
  //     url: '../enrollInfo/enrollInfo?matchid=' + this.data.sendMatchId
  //   })
  // }
})