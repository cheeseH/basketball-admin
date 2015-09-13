var express = require('express');
var router = express.Router();

var AV = require('avoscloud-sdk');
var Game=AV.Object.extend("Game");
var Campus=AV.Object.extend("Campus");

var GameController=require('../controller/GameController');

/* 返回赛事列表,根据campusId返回不同校区的赛事 */
router.get('/gameList', GameController.gameList);
/*返回某场赛事的详情*/
router.get('/gameDetail',GameController.gamrDetail);
/* 结束某场赛事*/
router.get('/gameFinshed',GameController.finishGame);
module.exports = router;
