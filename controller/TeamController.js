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

function searchByNameInGame(gameId,name,callback){
	var cql = "SELECT * FROM Team where related teams to pointer('Game','"+gameId+"') AND name like '%"+name+"%'";

	console.log(cql);

	AV.Query.doCloudQuery(cql,{
		success:function(teams){
			console.log(teams.results);
			return callback(null,teams.results);
		},
		error:function(error){
			console.log(error);
			return callback(error,null);
		}
	})

}

function searchByNameInCampus(campusId,name,callback){
	var cql = "SELECT * FROM Team where campusId in (select * from Campus where objectId= '"+campusId+"') AND name like '%"+name+"%'";
	console.log(cql);
	AV.Query.doCloudQuery(cql,{
		success:function(teams){
			console.log(teams.results);
			return callback(null,teams.results);
		},
		error:function(error){
			console.log(error);
			return callback(error,null);
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


TeamController.AddInCampus = function(req,res,next){
	var name = req.body.name;
	var info = req.body.info;
	var campusId = req.session.user.campusId;
	var campus = new Campus();
	campus.id = campusId;

	var logoUrl;
	imageUtil.upLoad(req,res,'logoUrl',function(err,url){
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
					res.redirect("/teams?pos=campus")
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
	var campusId = req.session.user.campusId;
	var gameId = req.body.gameId;
	var campus = new Campus();
	campus.id = campusId;
	var logoUrl;
	imageUtil.upLoad(req,res,'logoUrl',function(err,url){
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
									res.redirect('/teams?pos=game&gameId='+gameId);

								},
								error:function(game,err){
									console.log('1111');
									console.log(err);
								}
							})
						},
						error:function(error){
							console.log("22222");
							console.log(error);
						}
					})
				},
				error:function(team,err){
					console.log("33333");
					console.log(err);
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
			imageUtil.upLoad(req,res,'logoUrl',function(err,url){
				if(err){

				}
				else{
					team.set('name',name);
					team.set('info',info);
					if(url != null)
						team.set('logoUrl',url);
					team.save(null,{
						success:function(team){
							res.redirect("back");
						},
						error:function(team,error){
							console.log(error);
						}
					})
				}
			})

		},
		error:function(error){

		}
	})

}

function InArray(object,array){
	var id = object.id;
	var result = false;
	var i = 0;
	for(;i<array.length;i++){
		var compareId = array[i].id;
		if(compareId == id){
			result = true;
			return true;
		}

	}
	return false;
}
TeamController.Select = function(req,res,next){
	var gameId = req.query.gameId;
	searchByGame(gameId,function(err,teams){
		if(err){

		}
		else{
			var campusId = req.session.user.campusId;
			// var campusId = req.query.campusId;
			searchByCampus(campusId,function(err,campusTeams){
				if(err){

				}
				else{
					var restTeams = new Array();
					var i = 0;
					for(;i<campusTeams.length;i++){
						var obj = campusTeams[i];
						if(!InArray(obj,teams)){
							restTeams[restTeams.length] = obj;
						}
					}
					//比赛有的球队是teams，剩下的球队是restTeams
				res.render("oldTeamAdd",{teamList:restTeams,gameId:gameId});
				}
			})
		}
	})
}

TeamController.Pick = function(req,res,next){
	var gameId = req.body.gameId;
	console.log(gameId);
	var teams = req.body.teams;
	teams = JSON.parse(teams);
	var gameQuery = new AV.Query('Game');
	var teamObjs = new Array();
	var i = 0;
	for(;i<teams.length;i++){
		var newTeam = new Team();
		newTeam.id = teams[i];
		teamObjs[i] = newTeam;
	}
	gameQuery.get(gameId,{
		success:function(game){
			var teams  = game.relation('teams');
			teams.add(teamObjs);
			game.save(null,{
				success:function(game){
					//res.redirect('GameIndex');
					res.json({});

				},
				error:function(game,err){
					console.log(err);
				}
			})
		},
		error:function(error){
			console.log(error);
		}
	})
}

TeamController.removeFromGame = function(req,res,next){
	var gameId = req.query.gameId;
	var teamId = req.query.teamId;
	var query = new AV.Query("Game");
	query.get(gameId,{
		success:function(game){
			var teams = game.relation('teams');
			var toRemove = new Team();
			toRemove.id = teamId;
			teams.remove(toRemove);
			game.save(null,{
				success:function(game){
					res.json({});
				},
				error:function(game,error){
					
				}
			})
		},
		error:function(error){

		}
	})
}

TeamController.searchByName = function(req,res,next){
	var pos = req.query.pos;
	if(pos == 'game'){
		searchByNameInGame(req.query.gameId,req.query.name,function(err,teams){
			if(err){
				console.log(err);
			}
			else{
				res.json({teams:teams})
			}
		})
	}
	else if(pos == 'campus'){
		//var campusId = req.session.user.campusId;
		var campusId = req.session.user.campusId;
		searchByNameInCampus(campusId,req.query.name,function(err,teams){
			if(err){
				console.log(err);
			}
			else{
				res.json({teams:teams})
			}
		})
	}
}

TeamController.searchByNameInRest = function(req,res,next){
	var name = req.query.name;
	var gameId = req.query.gameId;
	console.log(name);
	searchByGame(gameId,function(err,teams){
		if(err){

		}
		else{
			var campusId = req.session.user.campusId;
			// var campusId = req.query.campusId;
			searchByNameInCampus(campusId,name,function(err,campusTeams){
				if(err){

				}
				else{
					var restTeams = new Array();
					var i = 0;
					for(;i<campusTeams.length;i++){
						var obj = campusTeams[i];
						if(!InArray(obj,teams)){
							restTeams[restTeams.length] = obj;
						}
					}
					res.json({teams:restTeams});
				}
			})
		}
	})
}
