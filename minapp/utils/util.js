var app = getApp();
var bucketbase = 'https://img.nine00.com/jinri/'
// var apibase = 'https://api.jinri.nine00.com/api/';
var apibase = 'http://testing.com/api/';
var ycounter = 0;
function like(){

  if(app.globalData.like.indexOf(this.data.raw.day)==-1){
    app.globalData.like.unshift(this.data.raw.day)
    wx.setStorageSync('like',app.globalData.like);
    wx.showToast({
      title: '已加入收藏',
      icon: 'success',
      duration: 1000
    })
    this.setData({
      liked:true
    })
  }
}

function unlike(){
  if(app.globalData.like.indexOf(this.data.raw.day)!=-1){
    app.globalData.like.splice(app.globalData.like.indexOf(this.data.raw.day),1)
    wx.setStorageSync('like',app.globalData.like);
    this.setData({
      liked:false
    })
  }
}

function Switch(){

  var url = '';
  if(app.globalData.showwp){
    url = bucketbase+this.data.raw.uri
  }else{
    url = bucketbase+this.data.raw.wpimguri
  }
  this.setData({
    imgurl:url
  })
  app.globalData.showwp = !app.globalData.showwp;
}

function up(){
  wx.request({
      url:apibase + 'up',
      method: 'POST',
      data: {code:'ilikesinging',day:this.data.raw.day},
      success: (res) => {
        var newraw = this.data.raw;
        newraw.up++;
        app.globalData.upcount.push(this.data.raw.day);
        this.setData({
          uped:true,
          raw:newraw
        })
      }
  })
}

function fillData(index,opt){
  if(index){
    var url = apibase + 'latest';
  }else{
    var url = apibase + 'day/'+opt.date;
  }
  wx.request({
    url: url,
    success: (res)=> {
      var data = res.data;
      var liked = (app.globalData.like.indexOf(data.day)==-1)?false:true;
      var prevpost = (data.prevpost) ? data.prevpost.split('-'):[];
      var nextpost = (data.nextpost) ? data.nextpost.split('-'):[];
      this.setData({
        imgurl:bucketbase+data.uri,
        wpimgurl:bucketbase+data.wpimguri,
        prevpost:prevpost,
        nextpost:nextpost,
        content:data.content.replace(/\n/g, "<br />"),
        liked:liked,
        raw:data,
        x:app.globalData.x
      })
      if(index){
        wx.stopPullDownRefresh()
      }
      if(app.globalData.upcount.indexOf(data.day)!=-1){
        this.setData({uped:true})
      }
    },
    fail: function() {
      wx.showModal({
        title: '提示',
        content: '没能联系上服务器...一会再试吧.',
        showCancel: false,
        confirmText: '嗯',
        confirmColor: '#000000'
      })
      if(index){
        wx.stopPullDownRefresh()
      }
    }
  })
}

function Recordpoint(ev,startat){
  if (ev.touches.length == 1){
    startat.x = ev.touches[0].clientX;
    startat.y = ev.touches[0].clientY;
  }
}

function release(ev,startat,index){
  //这是松手时触发1次的方法
  if (!this.data.direction) {
    //如果左右方向没被激活，松手时才判断是否打开面板
    var endY = ev.changedTouches[0].clientY;
    if ((startat.y - endY) > 110 && !this.data.openinfo) {
      this.setData({
        openinfo: true
      })
    } else if ((startat.y - endY) < -110 && this.data.openinfo) {
      this.setData({
        openinfo: false
      })
    }
    //判断距离来打开或关闭面板，这会激活margin-top的样式
  }
  switch (this.data.direction) {//如果位置有值
    case 'left':
      if (!this.data.raw.nextpost) {
        break;
      }
      setTimeout(() => {
        if(index){
          wx.navigateTo({
            url: '/pages/day/day?date=' + this.data.raw.nextpost
          })
        }else{
          wx.redirectTo({
            url: '/pages/day/day?date=' + this.data.raw.nextpost
          })
        }
      }, 300)
      this.setData({
        direction: null,
        x: 0
      });
      return;
      break;
    case 'right':
      if (!this.data.raw.prevpost) {
        break;
      }
      setTimeout(() => {
        if(index){
          wx.navigateTo({
            url: '/pages/day/day?date=' + this.data.raw.prevpost
          })
        }else{
          wx.redirectTo({
            url: '/pages/day/day?date=' + this.data.raw.prevpost
          })
        }
      }, 300)

      this.setData({
        direction: null,
        x: 5000
      });
      return;
      break;
  }
  this.setData({
    x: app.globalData.x-1
  });
  //movableview bug 强制渲染
  this.setData({
    y:0,
    x: app.globalData.x,
    direction: null
  });

}

function Moving(ev,startat){
  if(this.data.openinfo){
    this.data.direction = null
    this.setData({
      direction: null
    })
    return;
  }
  if (ev.touches.length == 1) {
    var clientX = ev.touches[0].clientX,
        clientY = ev.touches[0].clientY,
        dir,result;
    switch (true) {
      case (clientX - startat.x) > app.globalData.offset:
        dir = 'right';
        break;
      case (startat.x - clientX) > app.globalData.offset:
        dir = 'left';
        break;
      default:
        dir = null
        break;
    }

    this.setData({
      direction:dir
    })
  }
}

function picloaded(){
  this.setData({
    attachClass: "active"
  })
}

function download(){
  var url = (app.globalData.showwp) ? bucketbase + this.data.raw.wpimguri : bucketbase + this.data.raw.uri;
  wx.downloadFile({
    url: url,
    success: function(res) {
      var path = res.tempFilePath;
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success(res) {
          wx.showToast({
            title: '已保存到图库',
            icon: 'success',
            duration: 2000
          })
        },
        fail() {
          wx.showModal({
            title: '保存失败了',
            content: '没有得到保存图片的授权,请打开授权后重试.',
            showCancel: false,
            confirmText: '嗯',
            confirmColor: '#000000',
            complete: function() {
              wx.openSetting()
            }
          })
        }
      })
    }
  })
}

module.exports.like = like;
module.exports.up = up;
module.exports.unlike = unlike;
module.exports.Switch = Switch;
module.exports.fillData = fillData;
module.exports.Recordpoint = Recordpoint;
module.exports.release = release;
module.exports.Moving = Moving;
module.exports.picloaded = picloaded;
module.exports.download = download;
module.exports.apibase = apibase;
module.exports.bucketbase = bucketbase;
