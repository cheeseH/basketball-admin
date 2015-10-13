
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var qiniu = require('qiniu');
exports.upLoad = function(req,res,filename,type,callback){
    if(typeof(req.files[filename]) == "undefined"){
        return callback(null,null);
    }
 if(req.files[filename].size == 0){
        //使用同步方式删除一个文件
        fs.unlinkSync(req.files[filename].path);
        console.log(' Successsfully removed an empty file!');
        return callback(null,null);
    } else {
        var target_path = '&lt; 我本地存图片的路径 &gt;' + req.files[filename].name;
        console.log(target_path);
        //使用同步方式重命名一个文件
        var readStream = fs.createReadStream(req.files[filename].path);
        var writeStream = fs.createWriteStream(target_path);
        readStream.pipe(writeStream, function(){
            fs.unlinkSync(req.files[filename].path);
        });
        qiniu.conf.ACCESS_KEY = 'v_d4R_-nzDOrMJUnB5tynyL5IRfTtM9clDKj8Gtr';//qiniu_config是我的配置文件
        qiniu.conf.SECRET_KEY = 's0LCB1kKbYBfKOIQqiNKstpjwAdhH31pzmzO-vfN';
        var uptoken = new qiniu.rs.PutPolicy('dunk-webpage').token()
        var time = new Date();
        var year = time.getFullYear()+"";
        year = year.substring(2,3);
        var month = time.getMonth()+1;
        month = month<10?"0"+month:month+"";
        var day = time.getDate();
        day = day<10?"0"+day:day+"";
        time = year+month+day;
        var extra = new qiniu.io.PutExtra();
        console.log( "file is exists ? " + fs.existsSync(target_path));
        fs.readFile(target_path, function(err, data){
            console.log("data length is " + data.length);
            qiniu.io.put(uptoken, 'image_'+type+"_"+time+"_"+ req.files[filename].name, data, extra, function(err, ret) {
                fs.unlinkSync(target_path);
                console.log(ret);
                var url = 'http://7xnd0a.com1.z0.glb.clouddn.com/'+ret.key;
                callback(err,url);
            });
        });
    }

}