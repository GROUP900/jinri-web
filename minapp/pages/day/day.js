//day.js
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
  //branch
  onLoad: function(opt) {
    util.fillData.call(this, false,opt)
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
  //branch
  Touchcancel:function(){
    wx.reLaunch({
      url: '/pages/day/day?date='+this.data.raw.day
    })
  },
  Switch: function() {
    util.Switch.call(this)
  },
  //branch
  Release: function(ev) {
    util.release.call(this, ev, startat,false)
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
  //branch
  onShareAppMessage: function(opt) {
    var info = {};
    info.title = '今日'+this.data.raw.day;
    info.path = this.route+'?date='+this.data.raw.day;
    return info;
  }
})
