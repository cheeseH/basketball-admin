
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var qiniu = require('qiniu');
exports.upLoad = function(req,res,filename,callback){
 if(req.files['imgFile'].size == 0){
        //使用同步方式删除一个文件
        fs.unlinkSync(req.files[i].path);
        console.log(' Successsfully removed an empty file!');
    } else {
        var target_path = '&lt; 我本地存图片的路径 &gt;' + req.files['imgFile'].name;
        console.log(target_path);
        //使用同步方式重命名一个文件
        var readStream = fs.createReadStream(req.files['imgFile'].path);
        var writeStream = fs.createWriteStream(target_path);
        readStream.pipe(writeStream, function(){
            fs.unlinkSync(req.files[i].path);
        });
        qiniu.conf.ACCESS_KEY = 'v_d4R_-nzDOrMJUnB5tynyL5IRfTtM9clDKj8Gtr';//qiniu_config是我的配置文件
        qiniu.conf.SECRET_KEY = 's0LCB1kKbYBfKOIQqiNKstpjwAdhH31pzmzO-vfN';
        var uptoken = new qiniu.rs.PutPolicy('hola').token();
        var extra = new qiniu.io.PutExtra();
        console.log( "file is exists ? " + fs.existsSync(target_path));
        fs.readFile(target_path, function(err, data){
            console.log("data length is " + data.length);
            qiniu.io.put(uptoken, 'img/' + req.files['imgFile'].name, data, extra, function(err, ret) {
                fs.unlinkSync(target_path);
                console.log(ret);
                var url = 'http://7xlqng.com1.z0.glb.clouddn.com/'+ret.key;
                callback(err,url);
            });
        });
    }

}