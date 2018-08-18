//index.js
var app = getApp();
var startat = {
  x: 0,
  y: 0
};
var util = require('../../utils/util.js')
Page({
  data: {
    x: app.globalData.x,
    y:0,
    imgurl: '',
    wpimgurl: '',
    attachClass: '',
    direction: null,
    prevpost: [],
    nextpost: [],
    openinfo: false,
    content: '',
    liked: false,
    yoffset:0,
    raw:{},
    uped:false
  },
  onShow: function(opt) {
    util.fillData.call(this, true)
  },
  up: function(){
    util.up.call(this)
  },
  like: function() {
    util.like.call(this)
  },
  unlike: function() {
    util.unlike.call(this)
  },
  onPullDownRefresh: function() {
    util.fillData.call(this, true)
  },
  Touchcancel: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  Switch: function() {
    util.Switch.call(this)
  },
  Release: function(ev) {
    util.release.call(this, ev, startat,true)
  },
  Recordpoint: function(ev) {
    util.Recordpoint(ev, startat)
  },
  Moving: function(ev) {
    util.Moving.call(this, ev, startat)
  },
  picLoaded: function() {
    util.picloaded.call(this)
  },
  Download: function() {
    util.download.call(this)
  },
  onReachBottom: function() {

  },
  onShareAppMessage: function(opt) {
    var info = {};
    info.title = '今日';
    info.path = this.route;
    return info;
  }
})
