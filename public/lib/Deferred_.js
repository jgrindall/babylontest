
define(

    ['lib/bluebird'],

    function(Promise) {

        "use strict";

        var Deferred = function(){
            var _this = this;
            this.promise = new Promise(function resolver(resolve, reject) {
                _this.resolve = resolve;
                _this.reject = reject;
            });
        };

        Deferred.prototype.getState = function(){
            //done = fulfilled, rejected or cancelled
            return (this.promise.isPending() ? "pending" : "done");
        };

        Deferred.wrapAjax = function(options){
            var ajax = PM.pmAjax(options);
            return Promise.resolve(ajax);
        };

        return Deferred;
    }
);

