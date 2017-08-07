define([], function(){

    "use strict";

    var CleanCacheTask = function(game){
        game.meshStore.uncache();
    };

    return CleanCacheTask;

});