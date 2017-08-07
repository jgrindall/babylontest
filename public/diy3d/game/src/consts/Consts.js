define([], function(){

	"use strict";

	var Consts = {
	    BOX_SIZE:10,
        SIZE_I:14,
        SIZE_J:18
    };

    Consts.BOX_SIZE2 = Consts.BOX_SIZE/2;
    Consts.SKY_SIZE = 2 * Math.max(Consts.SIZE_I, Consts.SIZE_J) * Consts.BOX_SIZE;
    Consts.TOP_LEFT = {"x":0, "z":Consts.SIZE_I * Consts.BOX_SIZE};

	return Consts;

});
