/*
* This class stores all the meshes in the scene, and returns a "diff" when you change them.
* it is up to the Tasks to then act on the diff and add/remove/edit the meshes.
* Sometimes meshes can be re-used (moved, rotated) and sometimes they must be disposed of
* */


define([], function(){
    "use strict";

    var ID = -1;

    var MeshStore = function(){
        this.clear();
    };

    /* public */

    MeshStore.prototype.addAndGetDiff = function(type, data){
        this._addData(data);
        return this._getDiffsForType(type);
    };

    MeshStore.prototype.clear = function(){
        this.data = {};
        this.names = {};
    };

    MeshStore.prototype.cache = function(){
        this.cachedData = JSON.parse(JSON.stringify(this.data));
        this.cachedNames = JSON.parse(JSON.stringify(this.names));
    };

    MeshStore.prototype.uncache = function(){
        this.cachedData = {};
        this.cachedNames = {};
    };




    /* private */

    MeshStore.prototype._getDiffsForType = function(type){
        var allNames, names, cachedNames, cachedData, data, _this = this;
        names = this.names[type] || [];
        cachedNames = this.cachedNames[type] || [];
        allNames = _.uniq(names.concat(cachedNames));
        cachedData = this.cachedData || {};
        data = this.data;
        return _.map(allNames, function(name){
            var key, diff;
            key = MeshStore._getKey(type, name);
            diff = _this._getDiff(cachedData[key], data[key]);
            return {
                "name":name,
                "diff":diff
            };
        });
    };

    MeshStore.prototype._addData = function(data){
        _.each(data, this._add.bind(this));
    };

    MeshStore.prototype._add = function(obj) {
        var key = MeshStore._getKey(obj.type, obj.name);
        this.names[obj.type] = this.names[obj.type] || [];
        this.data[key] = this.data[key] || [];
        if(this.names[obj.type].indexOf(obj.name) === -1){
            this.names[obj.type].push(obj.name);
        }
        this.data[key].push({
            "data":obj.data,
            "name":obj.name,
            "type":obj.type,
            "id":MeshStore._getUUIdForKey(key)
        });
    };

    MeshStore.prototype._getDiff = function(from, to){
        var i, minLength, actions;
        actions = {
            add:[
            ],
            remove:[
            ],
            edit:[
            ]
        };
        from = from || [];
        to = to || [];
        minLength = Math.min(from.length, to.length);
        i = from.length - 1;
        while(from.length - actions.remove.length > to.length){
            actions.remove.push(from[i]);
            i--;
        }
        for(i = 0; i < minLength; i++){
            actions.edit.push({
                "to":to[i],
                "from":from[i]
            });
        }
        i = minLength;
        while(from.length + actions.add.length < to.length){
            actions.add.push(to[i]);
            i++;
        }
        return actions;
    };

    /* private static */
    MeshStore._getUUIdForKey = function(key){
        ID++;
        return key + "_" + ID;
    };

    MeshStore._getKey = function(type, name){
        return type + "_" + name;
    };

    return MeshStore;

});


