var util = require('../../utils/util.js')
var app = getApp();
var like = [];
var posreset = true;
Page({
    data: {
        datafetched: true,
        data: [],
        like: [],
        start: {}
    },
    onLoad: function() {
        this.reload();
    },
    onShow: function() {
        if (JSON.stringify(this.data.like.sort()) !== JSON.stringify(app.globalData.like.sort())) {
            this.reload();
        };
    },
    reload: function() {
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
            data: []
        })
        like = app.globalData.like;
        if (!like[0]) {
           wx.hideLoading()
            this.setData({
                like: like,
                datafetched: false
            })
        } else {
            var url = util.apibase + 'liked';
            wx.request({
                url: url,
                method: 'POST',
                data: like,
                success: (res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].likeimgurl = util.bucketbase + res.data[i].wpimguri + '/jmf';
                        res.data[i].splitedd = res.data[i].day.split('-');
                        res.data[i].pos = 0;
                    }
                    this.setData({
                        like: like,
                        datafetched: true,
                        data: res.data
                    })
                    wx.hideLoading();
                },
                fail: function() {
                   wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '没能联系上服务器...一会再试吧.',
                        showCancel: false,
                        confirmText: '嗯',
                        confirmColor: '#000000'
                    })
                }
            })
        }
    },
    Record: function(ev) {
        if (ev.touches.length == 1 && ev.target.dataset.day) {
            this.setData({
                start: {
                    point: ev.touches[0].clientX,
                    day: ev.target.dataset.day,
                    index: ev.target.dataset.index
                }
            });
        }
    },
    Moving: function(ev) {
        if (ev.touches.length == 1) {
            var offset = this.data.start.point - ev.touches[0].clientX,
                result;
            switch (true) {
                case offset <= 0:
                    result = 0
                    break;
                case (offset > 0 && offset <= 115):
                    result = -offset;
                    break;
                case offset > 115:
                    result = -115
                    break;
            }
            var data = this.data.data;
            if (!posreset) {
                for (var i = 0; i < data.length; i++) {
                    data[i].pos = 0;
                }
                posreset = true;
            }
            data[this.data.start.index].pos = result;
            this.setData({
                data: data
            })
        }
    },
    release: function(ev) {
        if (ev.changedTouches.length == 1) {
            var offset = this.data.start.point - ev.changedTouches[0].clientX,
                result;
            switch (true) {
                case offset <= 53:
                    result = 0
                    break;
                case (offset > 53):
                    result = -115;
                    posreset = false;
                    break;
            }
            var data = this.data.data;
            data[this.data.start.index].pos = result;
            this.setData({
                data: data
            })
        }
    },
    goto: function(ev) {
        if (ev.target.dataset.day) {
            wx.navigateTo({
                url: '/pages/day/day?date=' + ev.target.dataset.day
            })
        }
    },
    delcard: function() {
        var data = this.data.data;
        var like = this.data.like;
        data.splice(this.data.start.index, 1);
        like.splice(this.data.start.index, 1);
        for (var i = 0; i < data.length; i++) {
            data[i].pos = 0;
        }
        posreset = true;
        wx.setStorageSync('like',like);
        app.globalData.like = like;
        var datafetched = (like[0])?true:false;
        this.setData({
            data: data,
            like: like,
            datafetched:datafetched
        })
    },
    onShareAppMessage: function(opt) {
        var info = {};
        if (opt.from == 'button') {
            var day = opt.target.dataset.date;
            info.title = '今日' + day;
            info.path = '/pages/day/day' + '?date=' + day;
        } else {
            info.title = '今日';
            info.path = 'pages/index/index'
        }

        return info;
    }
})
