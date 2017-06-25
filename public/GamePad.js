define([], function(){
	"use strict";

	var RADIUS = 80;

	var GamePad = function(id){
		this.update = new MiniRunner('update');
		this.make(id);
	};

	GamePad.prototype.make = function(id){
		var update = this.update;
		this.manager = nipplejs.create({
			zone: document.getElementById(id),
			mode: 'static',
			size:2*RADIUS,
			position: {
				left: '50%',
				top: '50%'
			},
			color: 'red'
		});
		this.manager.on("move", function(e, data){
			var d, a;
			d = (data.distance / RADIUS);// from 0 to 1
			a = data.angle.degree;
			update.emit("change", {d:d, a:a});
		});
		this.manager.on("end", function(e, data){
			update.emit("end");
		});
	};

	GamePad.prototype.destroy = function(){
		this.manager.off();
		this.update = null;
		this.manager = null;
		//TODO - MORE NEEDED
	};

	return GamePad;

});
