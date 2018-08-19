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
Promise.promisifyAll(db.posts);
Promise.promisifyAll(db.posts.find().__proto__);
moment.locale('zh-cn');

router.get('/latest',function(req,res){
  var now = +moment();
  db.posts.find({timestamp:{$lt:now}}).sort({
      timestamp: -1
  }).limit(2).exec(function(err,docs){
    docs[0].prevpost = docs[1].day;
    docs[0].dayofweek = moment(docs[0].timestamp).format("E");
    res.send(docs[0])
  })
})

router.get('/day/:date',function(req,res){
  var now = +moment();
  db.posts.findOne({day:req.params.date,timestamp:{$lt:now}}).sort({
      timestamp: -1
  }).limit(2).exec(function(err,doc){
    db.posts.find({timestamp:{$lt:now}}).sort({timestamp:-1}).exec(function(err,docs){
      var docpos = docs.findIndex(function(obj){
        return obj.day == doc.day
      })
      if(docpos-1>=0){
        doc.nextpost = docs[docpos-1].day
      }
      if(docpos+1<docs.length){
        doc.prevpost = docs[docpos+1].day
      }
      doc.dayofweek = moment(doc.timestamp).format("E");
      res.send(doc)
    })
  })

})

router.get('/month/:date',function(req,res){
  var now = +moment();
  var targetmonth = req.params.date;
  if(targetmonth=='this'){
    targetmonth = moment(now).format("YYYY-MM");
  }
  db.posts.find({day:{ $regex:new RegExp(targetmonth)},timestamp:{$lt:now}}).sort({
      timestamp: -1
  }).exec(async function(err,docs){
    var bundle = {};
    var prevmonth = moment(targetmonth, "YYYY-MM").subtract(1, 'months').format("YYYY-MM");
    var nextmonth = moment(targetmonth, "YYYY-MM").add(1, 'months').format("YYYY-MM");
    var prevdocs = await db.posts.find({day:{ $regex:new RegExp(prevmonth)},timestamp:{$lt:now}}).execAsync();
    var nextdocs = await db.posts.find({day:{ $regex:new RegExp(nextmonth)},timestamp:{$lt:now}}).execAsync();
    if(prevdocs[0]){bundle.prevmonth=prevmonth};
    if(nextdocs[0]){bundle.nextmonth=nextmonth};
    bundle.docs = docs;
    bundle.curmonth = targetmonth.replace('-','/');
    res.send(bundle);
  })

})

router.post('/geneqr',function(req,res){
  qrcode.toDataURL(req.body.url, {
      errorCorrectionLevel:'L',
      margin: 0,
      scale:10
  }, function(err, url) {
      res.send(url)
  })
})

module.exports = router;
