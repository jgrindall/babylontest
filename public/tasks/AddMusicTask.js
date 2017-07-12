define([], function(){

	var AddMusicTask = function(game){
		var music = new BABYLON.Sound("Music", "assets/sea.mp3", game.scene, null, { loop: true, autoplay: true });
		music.setVolume(0.1);
	};

	return AddMusicTask;

});