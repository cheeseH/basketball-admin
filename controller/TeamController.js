var AV = require('avoscloud-sdk');
var Team = AV.Object.extend("Team");
var Game = AV.Object.extend("Game");
var Campus = AV.Object.extend('Campus');
var imageUtil = require('../util/image');
function TeamController(){
}

module.exports = TeamController;


function searchByCampus(campusId,callback){
	var query = new AV.Query("Team");
	var campus = new Campus();
	campus.id = campusId;
	query.equalTo('campusId',campus);
	query.find({
		success:function(teams){
			//传数组
			return callback(null,teams);
		},
		error:function(error){
			return callback(error);
		}
	})
}

function searchByGame(gameId,callback){
	var gameQuery = new AV.Query(Game);
	gameQuery.get(gameId,{
		success:function(game){
			var teamsRelation = game.relation('teams');
			var teamQuery = teamsRelation.query();
			teamQuery.find({
				success:function(teams){
					//
					return callback(null,teams);
				},
				error:function(error){
					return callback(error);
				}
			})
		},
		error:function(error){
			return callback(error);
		}
	})
}


TeamController.GameIndex = function(req,res,next){
	var gameId = req.query.gameId;
	searchByGame(gameId,function(error,teams){
		if(error){

		}
		else{
			//res.render('gameAdd');
			res.render("team",{teamList:teams,gameId:gameId});
		}
	})
}

TeamController.CampusIndex = function(req,res,next){
	var campusId = req.session.user.campusId;
	searchByCampus(campusId,function(error,teams){
		if(error){

		}
		else{

			res.render("allTeam",{teamList:teams});
		}

	})
}


TeamController.AddInSchool = function(req,res,next){
	var name = req.body.name;
	var info = req.body.info;
	var campusId = req.session.campusId;
	var campus = new Campus();
	campus.id = campusId;

	var logoUrl;
	imageUtil.upLoad(req,res,'imgFile',function(err,url){
		if(err){

		}
		else{
			logoUrl = url;
			var team = new Team();
			team.set('name',name);
			team.set('info',info);
			team.set('logoUrl',logoUrl);
			team.set('campusId',campus);
			team.save(null,{
				success:function(team){
					//return res.redirect('CampusIndex');
					res.send("success");
				},
				error:function(team,err){

				}
			});
		}

	})
}

TeamController.AddInGame = function(req,res,next){
	var name = req.body.name;
	var info = req.body.info;
	var campusId = req.session.campusId;
	var gameId = req.body.gameId;
	var campus = new Campus();
	campus.id = campusId;
	var logoUrl;
	imageUtil.upLoad(req,res,'imgFile',function(err,url){
		if(err){

		}else{
			logoUrl = url;
			var team = new Team();
			team.fetchWhenSave(true);
			team.set('name',name);
			team.set('info',info);
			team.set('logoUrl',logoUrl);
			team.set('campusId',campus);
			team.save(null,{
				success:function(team){
					var gameQuery = new AV.Query('Game');
					gameQuery.get(gameId,{
						success:function(game){
							var teams  = game.relation('teams');
							teams.add(team);
							game.save(null,{
								success:function(game){
									res.redirect('GameIndex');
									res.send("success");

								},
								error:function(game,err){

								}
							})
						},
						error:function(error){

						}
					})
				},
				error:function(team,err){

				}
			});
		}
	})
}

TeamController.TeamInfo = function(req,res,next){
	var teamId = req.query.teamId;
	var query = new AV.Query('Team');
	query.get(teamId,{
		success:function(team){
			res.send("success");

		},
		error:function(error){

		}
	})
}

TeamController.Update = function(req,res,next){
	var teamId = req.body.teamId;
	var query = new AV.Query('Team');
	query.get(teamId,{
		success:function(team){

			var name = req.body.name;
			var info = req.body.info;
			var logoUrl;
			imageUtil.upLoad(req,res,'imageFile',function(err,url){
				if(err){

				}
				else{
					logoUrl = url;
					team.set('name',name);
					team.set('info',info);
					team.set('logoUrl',logoUrl);
					team.save(null,{
						success:function(team){
							res.send("success");

						},
						error:function(team,error){

						}
					})
				}
			})

		},
		error:function(error){

		}
	})

}




