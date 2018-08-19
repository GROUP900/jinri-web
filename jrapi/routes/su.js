var express = require('express');
var router = express.Router();
var db = require('../lib/db.js'); //Linvodb3 & schema
var md5 = require('md5');
var moment = require('moment');
var expressJwt = require('express-jwt');
var jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
var Promise = require("bluebird");
var randomString = require('crypto-random-string');
var qrcode = require('qrcode');

db.posts.on('construct', function(doc) {
    Promise.promisifyAll(doc)
})
Promise.promisifyAll(db.posts)
moment.locale('zh-cn');

var bucketSetting = {
    appid: '123',
    bucket: 'xxx',
    sid: 'sid',
    skey: 'skey'
}
var jwtsecret = 'secret';

function generateAppSign(mode, path) {
    var setting = bucketSetting;
    var random = parseInt(Math.random() * Math.pow(2, 32));
    var now = parseInt(Date.now() / 1000);
    if (!mode) {
        var expire = now + 86400;
        var path = ''; //多次签名这里填空
    } else {
        var expire = 0;
        var path = path;
    }
    var str = 'a=' + setting.appid + '&k=' + setting.sid + '&e=' + expire + '&t=' + now + '&r=' + random +
        '&f=' + path + '&b=' + setting.bucket;
    var sha1Res = CryptoJS.HmacSHA1(str, setting.skey); //这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
    var strWordArray = CryptoJS.enc.Utf8.parse(str);
    var resWordArray = sha1Res.concat(strWordArray);
    var res = resWordArray.toString(CryptoJS.enc.Base64);
    return res;
}

function fillposts(doc, bundle) {
    doc.day = bundle.day;
    doc.color = bundle.color;
    doc.content = bundle.content;
    doc.uri = bundle.uri;
    doc.wpimguri = bundle.wpimguri;
}

router.post('/login', function(req, res) {
    db.users.findOne({
        'username': req.body.username
    }, function(err, doc) {
        if (!doc) {
            res.send('user');
            return;
        }
        if (md5(req.body.password + doc.salt) != doc.pass) {
            res.send('pw')
            return;
        }
        var bundle = {
            token: jwt.sign({
                _id: doc._id
            }, jwtsecret, {
                expiresIn: '1d'
            })
        }
        res.send(bundle);
    })

});
router.use(expressJwt({
    secret: jwtsecret
}));

router.get('/cossign', function(req, res) {
    res.send(encodeURIComponent(generateAppSign()))
})


router.post('/add', function(req, res) {
    var bundle = req.body;

    //不论普通还是强制模式，上来先查bundle中日期是否已存在
    db.posts.findOne({
        'day': bundle.day
    }, async function(err, existpost) {
        if (bundle.editmode) {
          await db.posts.removeAsync({_id:bundle.id},{});
          existpost = null;
        }
        if (bundle.mode == 'force' && existpost) {
            await existpost.removeAsync();
            existpost = null;
        }
        if (!existpost) {
            var post = new db.posts;
            fillposts(post, bundle);
            post.save(function(err) {
                if (err) {
                    return res.send('unknown')
                }
                res.send('done');
            });
        } else {
            res.send('overlay')
        }

    })

})

router.post('/getmonthposts', function(req, res) {
    var curmonth = +moment(req.body.month, "YYYY/MM");
    var nextmonth = +moment(req.body.month, "YYYY/MM").add(1, 'months');
    db.posts.find({
        'timestamp': {
            $gte: curmonth,
            $lt: nextmonth
        }
    }).sort({
        timestamp: -1
    }).exec(function(err, docs) {
        res.send(docs)
    })
})

router.post('/changepw', function(req, res) {
    var pw = req.body;
    db.users.findOne({_id:req.user._id},function(err,user){
      if (md5(pw.oldpw + user.salt) != user.pass) {
          return res.send('wrong')
      }
      user.salt = randomString(15);
      user.pass = md5(pw.newpw+ user.salt);
      user.save(function(err){
        if(!err){
          res.send('done')
        }else{
          res.send('unknown')
        }
      })
    })
})

router.get('/drop/:id', function(req, res) {
    db.posts.remove({
        _id: req.params.id
    }, {}, function() {
        res.send('done')
    })
})

router.get('/postinfo/:id', function(req, res) {
    db.posts.findOne({
        _id: req.params.id
    }, function(err, doc) {
        res.send(doc)
    })
})

module.exports = router;
