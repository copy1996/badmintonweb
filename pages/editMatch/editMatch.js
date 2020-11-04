var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp();
Page({

  data: {
    updateId:0,
    matchArr: ['男子单打', '女子单打', '男子双打', '女子双打', '混合双打'],
    matchIndex: 0,
    startDate: utils.formatDay(new Date),
    startTime: "12:00",
    endDate: utils.formatDay(new Date),
    endTime: "12:00",
    deadline: utils.formatDay(new Date),
    deadlineTime: "12:00",
    address: '',
    memberLimited: 0,
    imageList: [],
    hasImage: false,
    imageUrl:'',
    ownerName: '',
    phoneNumber: ''
  },

  onLoad: function (options) {
    const MatchId= options.matchid;
    let _this = this;

    let param = {
      'API_URL': '/wx/game/query_by_id',
      'data': {
        'id': MatchId
      },
      'header': {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': "token="+app.globalData.sessionId
      },
      'method': 'POST'
    }

    request.oneRequest.result(param).then(res => {
      if (res.data.result.data.pic != '') {
        _this.setData({
          imageUrl: request.APIDomian + '/' + res.data.result.data.pic,
          hasImage: true
        })
      }
      else{
        _this.setData({
          imageUrl: '',
          hasImage: false
        })
      }
      _this.setData({
        updateId: MatchId,
        matchIndex: parseInt(res.data.result.data.gameType)-1,
        startDate:res.data.result.data.beginTime.split(" ")[0],
        startTime: res.data.result.data.beginTime.split(" ")[1],
        endDate: res.data.result.data.endTime.split(" ")[0],
        endTime: res.data.result.data.endTime.split(" ")[1],
        deadline: res.data.result.data.deadline.split(" ")[0],
        deadlineTime: res.data.result.data.deadline.split(" ")[1],
        address: res.data.result.data.address,
        memberLimited: res.data.result.data.limitNum,
        ownerName: res.data.result.data.creator,
        phoneNumber: res.data.result.data.creatorPhone
      })
    }
    ).catch(e =>
      console.log(e)
      )
  },

  onShow: function () {
    
  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  //修改比赛类型
  matchChange(e) {
    this.setData({
      matchIndex: e.detail.value
    })
  },

  //修改开始日期
  startDateChange(e){
  this.setData({
    startDate: e.detail.value
  })
  },
  // 修改开始时间
  startTimeChange(e){
    this.setData({
      startTime: e.detail.value
    })
  },

  // 修改结束日期
  endDateChange(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  //修改结束时间
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //修改截止日期
  deadlineChange(e) {
    this.setData({
      deadline: e.detail.value
    })
  },
  //修改截止时间
  deadlineTimeChange(e){
    this.setData({
      deadlineTime: e.detail.value
    })
  },

  //输入地点
  inputAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },

  //修改人数上限
  inputLimited(e) {
    this.setData({
      memberLimited: e.detail.value
    })
  },

  //选择海报
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)

      }
    })
  },

  //输入称呼
  inputName(e) {
    this.setData({
      ownerName: e.detail.value
    })
  },

  //输入手机号
  inputPhone(e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    
  },

  //点击提交
  submitInfo() {
    const submitData = {
      'id': this.data.updateId,
      'gameType': parseInt(this.data.matchIndex) + 1,
      'beginTime': this.data.startDate+" "+this.data.startTime,
      'endTime': this.data.endDate+" "+this.data.endTime,
      'deadline': this.data.deadline+" "+this.data.deadlineTime,
      'address': this.data.address,
      'limitNum': this.data.memberLimited,
      'creator': this.data.ownerName,
      'creatorPhone': this.data.phoneNumber
    }
    if (!(submitData['deadline']<=submitData['beginTime']&&submitData['beginTime']<=submitData['endTime'])){
      console.log("lalalal日期错误")
      request.failTips('日期错误')
      return
    }
    if (this.data.address == ''){
      request.failTips('地点不能为空')
      return
    }
    if (this.data.memberLimited == ''){
      request.failTips('人数上限不能为空')
      return 
    }
    if (this.data.ownerName == ''){
      request.failTips('请输入创建人姓名')
      return 
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.phoneNumber))){ 
      request.failTips('手机号格式错误')
      return    
    }
    if (this.data.imageList.length == 0) {
      //没有上传图片
      let _this = this;

      let param = {
        'API_URL': '/wx/game/update',
        'data': submitData,
        'header': {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': "token="+app.globalData.sessionId
        },
        'method': 'POST'
      }

      request.oneRequest.result(param).then(res => {
        if (res.data.code == '000000') {
          //成功
          wx.showToast({
            title: '修改成功',
            icon: '',
            duration: 1000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../mine/mine',
            })
          }, 1000)
          // wx.switchTab({
          //   url: '../mine/mine',
          // })
        }else{
          request.failTips(res.data.msg)
        }
      }
      ).catch(e =>
        console.log(e)
        )
    }

    else {
      //有上传海报
      let that = this;
      wx.uploadFile({
        url: request.APIDomian + '/wx/game/update',
        filePath: that.data.imageList[0],
        name: 'file',
        formData: submitData,
        header: {
          'Cookie': app.globalData.sessionId
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == '400001') {
            request.failTips('有相关数据没有填写哦！')
          }
          if (res.data.code == '000000') {
            //成功
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '评论失败',
            showCancel: false
          })
        }
      })
    }
  }

})