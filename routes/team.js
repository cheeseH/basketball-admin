var express = require('express');
var router = express.Router();
var AV = require('../avos.js');
/* GET users listing. */
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var qiniu = require('qiniu');
var TeamController = require('../controller/TeamController');
var teamController = TeamController();
var imageUtil = require('../util/image');
router.post('/testImg',multipartMiddleware,function(req,res,next){
	
	imageUtil.upLoad(req,res,'imgFile',function(err, ret) {
                if(!err) {
                    // 上传成功， 处理返回值
//                    console.log(ret.key, ret.hash);
                    res.write(JSON.stringify({
                        "error" : 0,
                        "url" : '7xlqng.com1.z0.glb.clouddn.com' + ret.key
                    }));
                    console.log("上传成功！");
                } else {
                    // 上传失败， 处理返回代码
//                    console.log(err);
                    // http://developer.qiniu.com/docs/v6/api/reference/codes.html
                    res.write(JSON.stringify({
                        "error" : 1,
                        "message" : "上传失败"
                    }));
                    console.log("上传失败！");
                }
                res.end();
            })


});

router.get('/test',function(req,res,next){
	res.render('gameAdd.jade');
})
module.exports = router;
