define([], function(){
	"use strict";

	var RADIUS = 80, ONEOVER = 1/RADIUS;

	var GamePad = function(selector){
		this.update = new window.MiniRunner('update');
        this.manager = window.nipplejs.create({
            zone: document.getElementById(selector),
            mode: 'static',
            size:2*RADIUS,
            position: {
                left: '50%',
                top: '50%'
            },
            color: 'purple'
        });
        $(this.manager.get(0).el).hide();
        this.unpause();
	};

	GamePad.prototype.show = function(){
		$(this.manager.get(0).el).show();
	};

	GamePad.prototype.pause = function(){
		this.manager.off();
	};

	GamePad.prototype.unpause = function(){
		var update = this.update;
		this.manager.on("move", function(e, data){
			var d, a;
			d = (data.distance * ONEOVER);// from 0 to 1
			a = data.angle.degree;
			update.emit("change", {d:d, a:a});
		});
		this.manager.on("end", function(){
			update.emit("end");
		});
	};

	GamePad.prototype.destroy = function(){
		this.manager.off();
		this.update = null;
		this.manager = null;
	};

	return GamePad;

});
