var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clothArr:[],
    clothIndex:0,
    pantsArr:[],
    pantsIndex:0,
    name: '',
    phone: '',
    salaryID: '',
    identification: '',
    clothNum: '',
    getMatchId:0,
    gameType: '',
    list1:[],
    list2:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      getMatchId: options.matchid,
      gameType: options.gameType
    })
    const that = this;
    setTimeout(function(){
      that.setData({
        getMatchId: options.matchid,
        gameType: options.gameType
      })
    },500)
    console.log("gameType:", options.gameType)
    if(options.gameType == '男单'){
      that.setData({
        clothArr:['M(165/88)', 'L(170/92)', 'XL(175/96)', '2XL(180/100)', '3XL(185/104)', '4XL(190/108)'],
        pantsArr:['M(165/74)', 'L(170/78)', 'XL(175/82)', '2XL(180/86)', '3XL(185/90)', '4XL(190/94)']
      })
    }
    if(options.gameType == '女单'){
      that.setData({
        clothArr:['M(155/78)', 'L(160/82)', 'XL(165/86)', '2XL(170/90)', '3XL(175/94)'],
        pantsArr:['M(155/64)', 'L(160/68)', 'XL(165/72)', '2XL(170/76)', '3XL(175/80)']
      })
    }
    wx.setNavigationBarTitle({
      title: that.data.gameType+"比赛报名"
    })
    
  },

  onShow: function () {
    
  },

  onShareAppMessage: function () {
  
  },

  //输入用户名
  inputName(e){
    this.setData({
      name: e.detail.value
    })
  },
  // 修改衣服尺码
  clothChange(e){
    this.setData({
      clothIndex: e.detail.value
    })
  },
  // 修改裤子尺码
  pantsChange(e){
    this.setData({
      pantsIndex: e.detail.value
    })
  },

  //输入电话
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  
  //输入工资号/一卡通号
  inputSalaryID(e) {
   this.setData({
     salaryID: e.detail.value
   })
 },

   //输入身份证号
   inputIdentification(e) {
    this.setData({
      identification: e.detail.value
    })
  },
  //提交报名
  submitInfo(){
    const that = this;
    if (that.data.name == ''){
      request.failTips('姓名不能为空')
      return 
    }
    if(that.data.identification.length != 18){
      console.log("length")
      request.failTips('身份证号填写错误')
      return 
    }
    if(!(utils.checkPassword(that.data.identification))){
      console.log("checkPhoneNum")
      request.failTips('身份证号填写错误')
      return 
    }
    if(!(utils.checkPhoneNum(that.data.phone))){ 
      request.failTips('手机号格式错误')
      return    
    }
    if (!(utils.checkPassword(that.data.salaryID))){
      request.failTips('工资号填写错误')
      return 
    }
    let param = {
      'API_URL': '/wx/participant_single/add',
      'data': {
        'gameId': that.data.getMatchId,
        'name': that.data.name,
        'phone': that.data.phone,
        'salaryID': that.data.salaryID,
        'clothNum': that.data.clothArr[that.data.clothIndex],
        'pantsNum': that.data.pantsArr[that.data.pantsIndex],
        'identification': that.data.identification
      },
      'header': {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': "token="+app.globalData.sessionId
      },
      'method': 'POST'
    }

    request.oneRequest.result(param).then(res => {
      if (res.data.code=='000000') {
        wx.showToast({
          title: '报名成功',
          icon: '',
          duration: 1000
        });
        setTimeout(function(){
          wx.switchTab({
            url: '../activity/activity'
          })
        },1000)

      }
      else if(res.data.code == '600202'){
        var str = '已报名一场男双\r\n搭档名：'+ res.data.result.data.name+ '\r\n工资号：'+ res.data.result.data.salaryid+'\r\n身份证号：'+res.data.result.data.identification
        request.failTips(str)
      }
      else if(res.data.code == '600203'){
        var list1 = res.data.result.data1;
        var list2 = res.data.result.data2;
        console.log("list1:",list1," list2:", list2)
        if(list1.length == 2){
          var str = "已报名两场女双\r\n";
          for(var i=0;i<list1.length;i++){
            var str2 = '搭档名：'+ list1[i].name+ '\r\n工资号：'+ list1[i].salaryid+ '\n身份证号：'+ list1[i].identification;
            str = str+str2;
            str.concat('\r\n')
          }
          request.failTips(str)
        }
        else if(list2.length == 2){
          var str = "已报名两场混双\r\n";
          for(var i=0;i<list2.length;i++){
            var str2 = '搭档名：'+ list2[i].name+ '\r\n工资号：'+ list2[i].salaryid+ '\n身份证号：'+ list2[i].identification;
            str = str+str2;
            str.concat('\r\n')
          }
          request.failTips(str)
        }
        else if(list1.length == 1 && list2.length == 1){
          var str = "已报名一场女双一场混双\r\n";
          for(var i=0;i<list1.length;i++){
            var str2 = '搭档名：'+ list1[i].name+ '\r\n工资号：'+ list1[i].salaryid+ '\n身份证号：'+ list1[i].identification;
            str = str+str2;
            str.concat('\r\n')
          }
          for(var i=0;i<list2.length;i++){
            var str2 = '搭档名：'+ list2[i].name+ '\r\n工资号：'+ list2[i].salaryid+ '\n身份证号：'+ list2[i].identification;
            str = str+str2;
          }
          request.failTips(str)
        }else if(list1.length == 1){
          var str = "已报名一场女单一场女双\r\n";
          for(var i=0;i<list1.length;i++){
            var str2 = '搭档名：'+ list1[i].name+ '\r\n工资号：'+ list1[i].salaryid+ '\n身份证号：'+ list1[i].identification;
            str = str+str2;
          }
          request.failTips(str)
        }else{
          var str = "已报名一场女单一场混双\r\n";
          for(var i=0;i<list2.length;i++){
            var str2 = '搭档名：'+ list2[i].name+ '\r\n工资号：'+ list2[i].salaryid+ '\n身份证号：'+ list2[i].identification;
            str = str+str2;
          }
          request.failTips(str)
        }
      }
      else{
        request.failTips(res.data.msg)
      }
    }
    ).catch(e =>
      console.log(e)
      )

    
  }
})