//app.js
App({
  onLaunch: function() {
    var x = wx.getStorageSync('x');
    if (!x) {
      var sysInfo = wx.getSystemInfoSync(),
        windowWidth = sysInfo.windowWidth,
        windowHeight = sysInfo.windowHeight,
        rpxTopx = windowWidth / 750,
        picWidth = Math.floor(500 * rpxTopx),
        picHeight = Math.floor(picWidth * 1.7777),
        x = (windowWidth * 4 - picWidth) / 2;
      wx.setStorageSync('x', x);
      wx.setStorageSync('offset', Math.floor(windowWidth / 4));
      var x = wx.getStorageSync('x');
    }
    var offset = wx.getStorageSync('offset');
    var like = wx.getStorageSync('like')
    if(!like[0]){
      like = [];
    }
    this.globalData.x = x;
    this.globalData.offset = offset;
    this.globalData.like = like;
    this.globalData.showwp = false;
    this.globalData.upcount = [];
    wx.onUserCaptureScreen(function(res) {
      wx.showModal({
        title: '提示',
        content: '如果想保存图片,请长按图片.在说明里有更多的信息',
        showCancel: false,
        confirmText: '嗯',
        confirmColor: '#000000'
      })
    })
  },

  globalData: {

  }
})
