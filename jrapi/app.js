var express = require('express');
var bodyParser = require('body-parser'); //body-parser
var md5 = require('md5'); //md5 decode
var cors = require('cors');
//导入分离的路由
var su = require('./routes/su'); //load front routes
var api = require('./routes/api'); //load front routes
//初始化express
var app = express();
app.disable('x-powered-by');
// 初始化通用中间件
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
// 使用分离的路由
app.use('/api', api);
app.use('/su', su);
// 接住未捕获的错误
app.use(function(req, res) {
    res.status(500);
    res.send('500');
});
// 启动APP
app.listen(4030, function() {
    console.log('JR API服务器启动，运行在端口4030')
})
