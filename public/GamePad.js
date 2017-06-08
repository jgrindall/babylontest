define([], function(){
	
	var ROT_SPEED = 0.03, SPEED = 0.6, RADIUS = 40;
	
	var GamePad = function(id){
		this.update = new MiniRunner('update');
		this.make(id);
	};
	
	GamePad.prototype.make = function(id){
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
			this.update.emit("change", {d:d, a:a});
		});
		this.manager.on("end", function(e, data){
			this.update.emit("end");
		});
	};

	return GamePad;
	
});
