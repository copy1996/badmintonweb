import Promise from 'es6-promise';
var apiDomain = 'http://192.168.2.101:5000'
// var apiDomain = 'https://www.copy1996.design'
var app = getApp();

var oneRequest = {

  fetchApi: function (params) {

    var _this = this;

    return new Promise((resolve, reject) => {
      wx.request({
        url: apiDomain+params.API_URL,
        data: Object.assign({}, params.data),
        header: Object.assign({}, params.header),
        method: params.method,
        success: resolve,
        fail: reject
      })
    })

  },

  result: function (params) {

    var _this = this;

    return _this.fetchApi(params).then(res => res)

  }

};

var showModal = function (content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {

      }
    }
  })
}

module.exports = {
  oneRequest: oneRequest,
  APIDomian: apiDomain,
  failTips: showModal
}
