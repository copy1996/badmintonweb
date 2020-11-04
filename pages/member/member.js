import request from '../../request/requestFunc.js';
var app = getApp();
Page({
  data: {
    memberList: [],
    MatchId: '',
    noRecord: false,
    bottomNum: 1,
    hasToEnd: false
  },

  onLoad: function (options) {
    this.setData({
      MatchId: options.matchid
    })
    getMyMember(this)
  },

  onShow: function () {
    
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      getMyMember(this)
    }
    else {
      request.failTips('已经到底啦！')
    }
  },

  onShareAppMessage: function () {
  
  },

  //进入编辑页面
  gotoEdit(e){
    const matchId = e.currentTarget.dataset.matchid;
    wx.navigateTo({
      url: '../editMatch/editMatch?matchid=' + matchId,
    })
  },

  //进入添加页面
  gotoAdd(e){
    const matchId = e.currentTarget.dataset.matchid;
    console.log("添加成员：", matchId)
    wx.navigateTo({
      url: '../member/member?matchid=' + matchId,
    })
  },

  //进入赛程详情页面
  // gotoDetails(e){
  //   const matchId = e.currentTarget.dataset.matchid;
  //   wx.navigateTo({
  //     url: '../matchDetails/matchDetails?matchid=' + matchId,
  //   })
  // },

  //进入活动详情
  gotoDetails(e){
    const id = e.currentTarget.dataset.id;
    const gameType = e.currentTarget.dataset.gametype;
    console.log("member.js id:", id,",gameType:",gameType)
    wx.navigateTo({
      url: '../memberDetails/memberDetails?id=' + id+'&gameType='+gameType
    })
  },

  //删除
  deleteMember(e){
    const id = e.currentTarget.dataset.id;
    console.log("deleteMember e.currentTarget.dataset.matchid:", id)
    const that = this;
    wx.showModal({
      content: '确定删除该成员吗？',
      success: function (res) {
        if (res.confirm) {
          //调用接口
          let param = {
            'API_URL': '/wx/game/delete_member',
            'data': {
              'id': id
            },
            'header': {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              'Cookie': "token="+app.globalData.sessionId
            },
            'method': 'POST'
          }

          request.oneRequest.result(param).then(res => {
            if (res.data.code == '000000') {
              wx.showToast({
                title: '删除成功',
                icon: '',
                duration: 1000
              });
              setTimeout(function () {
                //翻页变量reset
                that.setData({
                  memberList: [],
                  bottomNum: 1,
                  hasToEnd: false
                });
                getMyMember(that)
              }, 1000)

            }else{
              wx.showToast({
                title: '删除失败',
                icon: '',
                duration: 1000
              });
            }
          }
          ).catch(e =>
            console.log(e)
            )
        } else if (res.cancel) {
          
        }
      }
    })
  }
})

function getMyMember(that) {
  let param = {
    'API_URL': '/wx/game/memberList',
    'data': {
      'matchId': that.data.MatchId,
      'pageNum': that.data.bottomNum,
      'perPage': 10
    },
    'header': {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': "token="+app.globalData.sessionId
    },
    'method': 'POST'
  }

  request.oneRequest.result(param).then(res => {
    var resJson = res.data.result.data;
    console.log("res.data.result.data:", res.data.result.data)
    var previousmemberList = that.data.memberList;
    for (var i = 0; i < resJson.length; i++) {
      previousmemberList.push(resJson[i])
    }

    that.setData({
      memberList: previousmemberList
    })

    if (that.data.bottomNum == res.data.result.totalPage) {
      that.setData({
        hasToEnd: true
      })
    }
  }
  ).catch(e =>
    console.log(e)
    )
}