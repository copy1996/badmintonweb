import request from '../../request/requestFunc.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:'../../images/tab1/u73.png',
    gameType: '',
    beginTime: '',
    endTime: '',
    deadline: '',
    address: '',
    participantNum: 0,
    limitNum: 0,
    ownerName: '',
    phone: '',
    localtime: '',
    sendMatchId: 0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sendMatchId: options.matchid,
      gameType: options.gameType,
      beginTime: options.beginTime,
      endTime: options.endTime,
      deadline: options.deadline,
      address: options.address,
      participantNum: options.participantNum,
      limitNum: options.limitNum,
      ownerName: options.ownerName,
      phone: options.phone,
      localtime: options.localtime
    })
    // const that = this;
    // let param = {
    //   'API_URL': '/wx/game/query_by_id',
    //   'data': {
    //     'id': that.data.sendMatchId
    //   },
    //   'header': {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    //     'Cookie': 'token='+app.globalData.sessionId
    //   },
    //   'method': 'POST'
    // }

    // request.oneRequest.result(param).then(res => {
    //   // console.log("pic:shangmian")
    //   // console.log("imageUrl :", this.data.imageUrl)
    //   // if (res.data.result.data.pic!=''){
    //   //   console.log("pic:", res.data.result.data.pic)
    //   //   that.setData({
    //   //     imageUrl: request.APIDomian +'/'+ res.data.result.data.pic
    //   //   })
    //   // }
    //   console.log("enroll.js data:", res.data.result.data)
    //   that.setData({
    //     gameType: res.data.result.data.gameType,
    //     beginTime: res.data.result.data.beginTime,
    //     endTime: res.data.result.data.endTime,
    //     deadline: res.data.result.data.deadline,
    //     address: res.data.result.data.address,
    //     participantNum: res.data.result.data.participantNum,
    //     limitNum: res.data.result.data.limitNum,
    //     ownerName: res.data.result.data.creator,
    //     localtime: res.data.result.data.localtime,
    //     phone: res.data.result.data.creatorPhone
    //   })
    // },
    
    // ).catch(e =>
    //   console.log(e)
    // )
  },
  onShow: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  //进入信息填写页面
  gotoInfoPageSingle(e){
    wx.navigateTo({
      url: '../enrollInfoSingle/enrollInfoSingle?matchid=' + this.data.sendMatchId+"&gameType="+this.data.gameType
    })
  },
  //进入信息填写页面
  gotoInfoPageDouble(e){
    wx.navigateTo({
      url: '../enrollInfoDouble/enrollInfoDouble?matchid=' + this.data.sendMatchId+"&gameType="+this.data.gameType
    })
  }

  
  
})