var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp();
Page({

  data: {
    matchArr:['男子单打', '女子单打', '男子双打', '女子双打', '混合双打'],
    matchIndex:0,
    startDate: utils.formatDay(new Date),
    startTime: "12:00",
    endDate: utils.formatDay(new Date),
    endTime: "12:00",
    deadline: utils.formatDay(new Date),
    deadlineTime: "12:00",
    address:'',
    memberLimited:0,
    imageList:[],
    imageUrl:'',
    ownerName: '',
    phoneNumber: '',
    token2:''
  },

  onLoad: function (options) {
    
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
  matchChange(e){
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
  inputAddress(e){
    this.setData({
      address: e.detail.value
    })
  },

  //修改人数上限
  inputLimited(e){
    this.setData({
      memberLimited: e.detail.value
    })
  },
  // 输入口令
  inputToken(e){
    this.setData({
      token2: e.detail.value
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
        var newArr = [];
        newArr.push(res.tempFilePaths[0])
        that.setData({
          imageList: newArr,
          imageUrl: res.tempFilePaths[0]
        }) 
       
      }
    })
  },

  //输入称呼
  inputName(e){
    console.log("inputName:")
    this.setData({
      ownerName: e.detail.value
    })
  },

  //输入手机号
  inputPhone(e){
    console.log("inputPhone:")
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  //点击提交
  submitInfo(){
    const submitData = {
      'gameType': parseInt(this.data.matchIndex) + 1,
      'beginTime': this.data.startDate+" "+this.data.startTime,
      'endTime': this.data.endDate+" "+this.data.endTime,
      'deadline': this.data.deadline+" "+this.data.deadlineTime,
      'address': this.data.address,
      'limitNum': this.data.memberLimited,
      'creator': this.data.ownerName,
      'creatorPhone': this.data.phoneNumber,
      'token2': this.data.token2
    }
    console.log("startDate  :", this.data.startDate)
    if (this.data.token2 != '340101'){
      request.failTips('口令错误，无法创建比赛')
      return
    }
    if (!(submitData['deadline']<=submitData['beginTime']&&submitData['beginTime']<=submitData['endTime'])){
      console.log("lalalal日期错误:",submitData['deadline'], ' ', submitData['beginTime'])
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

    if (this.data.imageList.length==0){
      //没有上传图片
      let _this = this;

      let param = {
        'API_URL': '/wx/game/create',
        'data': submitData,
        'header': {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': "token="+app.globalData.sessionId
        },
        'method': 'POST'
      }

      request.oneRequest.result(param).then(res => {
        console.log("返回request：",request," res.data:", res.data, " res:",res)
        // if (res.data.code == '400001') {
        //   request.failTips(res.data.msg)
        // }
        
        if (res.data.code == '000000') {
          //成功
          this.setData({
            matchIndex:0,
            startDate: utils.formatDay(new Date),
            startTime: "12:00",
            endDate: utils.formatDay(new Date),
            endTime: "12:00",
            deadline: utils.formatDay(new Date),
            deadlineTime: "12:00",
            phone:'',
            name:'',
            limitNum: '',
            address:'',
            token2: ''
          });
          wx.showToast({
            title: '创建比赛成功',
            icon: '',
            duration: 1000
          });
          setTimeout(function(){
            wx.switchTab({
              url: '../activity/activity',
            })
          }, 1000)
          // wx.switchTab({
          //   url: '../activity/activity',
          //   // success: function (e) {  
          //   //   var page = getCurrentPages().pop();  
          //   //   if (page == undefined || page == null) return;  
          //   //   page.onLoad();  
          //   // }  
          // })
        }else{
          request.failTips(res.data.msg)
        }
      }
      ).catch(e =>
        console.log(e)
        )
    }

    else{
      //有上传海报
      let that = this;
      wx.uploadFile({
        url: request.APIDomian + '/wx/game/create',
        filePath: that.data.imageList[0],
        name: 'file',
        formData: submitData,
        header: {
          'Cookie': app.globalData.sessionId
        },
        method: 'POST',
        success: function (res) {
          if(res.data.code=='600003'){
            request.failTips('签名验证未通过')
          }
          if(res.data.code=='400001'){
            request.failTips('有相关数据没有填写哦！')
          }
          if(res.data.code == '000000'){
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