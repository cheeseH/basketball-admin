var AV = require('avoscloud-sdk');
var Team = AV.Object.extend("Team");
var Game = AV.Object.extend("Game");
function TeamController(){

}


// TeamController.Index = function(req,res,next){
// 	var gameId = req.query.gameId;
// 	var query = new AV.Query(Team);
// 	var game = new Game();
// 	game.id = gameId;
// 	query.equalTo('gameId',game);
// 	query.find({
// 		success:function(teams){
// 			res.render('teamManage',{
// 				teams:teams;
// 			})
// 		},
// 		error:function(error){
// 			next(error);
// 		}
// 	})

// }

TeamController.Add = function(req,res,next){
	var gameId = req.query.gameId;
	var game = new Game();
	game.id = gameId;
	var  name = req.params.name;
	var info;
	var hasInfo = false;
	if(typeof(req.params.info) != 'undefined'){
		info = req.params.info;
		hasInfo = true;
	}

	var team = new Team();
	team.set('name',name);
}

TeamController.testImg = function(req,res,next){
	console.log(req.files);

}

module.exports = TeamController;

