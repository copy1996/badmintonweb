function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDay(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1;
  if(month<10){
    month = 0+String(month)
  }
  var day = date.getDate()
  if(day < 10){
    day = 0+String(day)
  }
  return year+'-'+month+'-'+day
}
function formatTime2(date){
  var hour = date.getHours();
  var minute = date.getMinutes();
  if(hour < 10){
    hour = 0 + String(hour);
  }
  if(minute < 10){
    minute = 0 + String(minute);
  }
  return hour+":"+minute
}
function checkPassWord(number)  
{  
     var re =  /^[0-9a-zA-Z]*$/;  //判断字符串是否为数字和字母组合     
     return re.test(number)
}  
function checkPhoneNum(number){
  var re = /^1[3456789]\d{9}$/;
  return re.test(number)
}
module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  checkPassword: checkPassWord,
  checkPhoneNum: checkPhoneNum,
  formatTime2: formatTime2
}
