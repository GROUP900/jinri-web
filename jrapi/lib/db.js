var db = require("linvodb3");
var moment = require('moment');
moment.locale('zh-cn');
db.dbPath = '../jrdata';
const bucketurl = 'xxx';

var usersSchema = {
    username: {
        type: String,
        index: true,
        unique: true
    },
    pass: String,
    salt: String
}

var postsSchema = {
    day: {
        type: String,
        index: true,
        unique: true
    },
    content: String,
    uri: {
        type: String,
        index: true,
        unique: true
    },
    wpimguri:String,
    color: String,
    timestamp:{
      get:function(){
        return +moment(this.day,"YYYY-MM-DD");
      }
    },
    dispuri:{
      get:function(){
        return bucketurl+this.uri
      }
    },
    dispwpuri:{
      get:function(){
        if(this.wpimguri){
          return bucketurl+this.wpimguri
        }else{
          return ""
        }
      }
    }
}

var users = new db('users', usersSchema, {});
var posts = new db('posts', postsSchema, {});

module.exports.users = users;
module.exports.posts = posts;
