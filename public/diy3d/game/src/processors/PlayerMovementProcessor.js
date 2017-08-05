define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts", "diy3d/game/src/utils/FMath"], function(GridUtils, Consts, FMath){

    "use strict";

    var PIOVER2 = Math.PI/2;
    var ALPHA_DEG = 20; // less then 45, this is the sector of the gamepad that is used for each pure direction (u, d, l, r)
    var ALPHA = Math.PI * ALPHA_DEG/180;
    var MIN_RADIUS = 0.2;
    var ANG_SPEED = 0.025;
    var PLAYER_DIAMETER = Consts.BOX_SIZE/2;
    var PLAYER_DIAMETER2 = PLAYER_DIAMETER/2;
    var EPS = 0.001;
    var MIN_X = Consts.BOX_SIZE + PLAYER_DIAMETER2;
    var MAX_X = Consts.SIZE_J * Consts.BOX_SIZE - Consts.BOX_SIZE - PLAYER_DIAMETER2;
    var MIN_Z = Consts.BOX_SIZE + PLAYER_DIAMETER2;
    var MAX_Z = Consts.SIZE_I * Consts.BOX_SIZE - Consts.BOX_SIZE - PLAYER_DIAMETER2;
    var FMATH = new FMath();

    var PlayerMovementProcessor = function(game){
        this.game = game;
        this.manager = this.game.manager;
        this.camera = this.game.camera;
    };

    PlayerMovementProcessor.prototype.isFull = function(i, j){
        if(i < 0 || i >= Consts.SIZE_I || j < 0 || j >= Consts.SIZE_J){
            return true;
        }
        return (this.game.data.solid[i][j] === 1);
    };

    PlayerMovementProcessor.prototype.resolve = function(pos, movex, movez){
        var dx, dy, me, n, s, w, e, sw, nw, ne, se, left, top, ij, i, j, newPos, SIZE = Consts.BOX_SIZE;
        newPos = {    // the point I will move to
            x: pos.x + movex,
            z: pos.z + movez
        };
        ij = GridUtils.babylonToIJ(newPos);
        i = ij.i;
        j = ij.j;
        dx = newPos.x - j*SIZE;
        dy = Consts.TOP_LEFT.z - newPos.z - i*SIZE;
        me = this.isFull(i, 	    j);
        n = this.isFull(i - 1, 	    j);
        s = this.isFull(i + 1, 	    j);
        w = this.isFull(i, 		    j - 1);
        e = this.isFull(i, 		    j + 1);
        nw = this.isFull(i - 1, 	j - 1);
        ne = this.isFull(i - 1, 	j + 1);
        sw = this.isFull(i + 1, 	j - 1);
        se = this.isFull(i + 1, 	j + 1);
        if(me){
            if(dx + dy >= SIZE && dx - dy <= 0){
                dy = SIZE + PLAYER_DIAMETER2 + EPS;
            }
            else if(dx + dy >= SIZE && dx - dy >= 0){
                dx = SIZE + PLAYER_DIAMETER2 + EPS;
            }
            else if(dx + dy <= SIZE && dx - dy >= 0){
                dy = -PLAYER_DIAMETER2 - EPS;
            }
            else {
                dx = -PLAYER_DIAMETER2 - EPS;
            }
        }
        else {
            if (dx >= SIZE - PLAYER_DIAMETER2) {
                left = 2;
            }
            else if (dx > PLAYER_DIAMETER2) {
                left = 1;
            }
            if (dy >= SIZE - PLAYER_DIAMETER2) {
                top = 2;
            }
            else if (dy > PLAYER_DIAMETER2) {
                top = 1;
            }
            if (top === 0 && left === 1 && n) {
                //b
                dy = PLAYER_DIAMETER2 + EPS;
            }
            else if (top === 1 && left === 2 && e) {
                //e
                dx = SIZE - PLAYER_DIAMETER2 - EPS;
            }
            else if (top === 2 && left === 1 && s) {
                //h
                dy = SIZE - PLAYER_DIAMETER2 - EPS;
            }
            else if (top === 1 && left === 0 && w) {
                //d
                dx = PLAYER_DIAMETER2 + EPS;
            }
            else if (top === 0 && left === 0) {
                //a
                if ((n && !nw && !w) || (n && nw && !w)) {
                    dy = PLAYER_DIAMETER2 + EPS;
                }
                else if ((!n && !nw && w) || (!n && nw && w)) {
                    dx = PLAYER_DIAMETER2 + EPS;
                }
                else if ((n && !nw && w) || (n && nw && w)) {
                    dy = PLAYER_DIAMETER2 + EPS;
                    dx = PLAYER_DIAMETER2 + EPS;
                }
                else if (!n && nw && !w) {
                    if (dx >= dy) {
                        dx = PLAYER_DIAMETER2 + EPS;
                    }
                    else {
                        dy = PLAYER_DIAMETER2 + EPS;
                    }
                }
            }
            else if (top === 0 && left === 2) {
                //c
                if ((n && !ne && !e) || (n && ne && !e)) {
                    dy = PLAYER_DIAMETER2 + EPS;
                }
                else if ((!n && !ne && e) || (!n && ne && e)) {
                    dx = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if ((n && !ne && e) || (n && ne && e)) {
                    dy = PLAYER_DIAMETER2 + EPS;
                    dx = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if (!n && ne && !e) {
                    if (dx + dy >= SIZE) {
                        dx = SIZE - PLAYER_DIAMETER2 - EPS;
                    }
                    else {
                        dy = PLAYER_DIAMETER2 + EPS;
                    }
                }
            }
            else if (top === 2 && left === 0) {
                //g
                if ((s && !sw && !w) || (s && sw && !w)) {
                    dy = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if ((!s && !sw && w) || (!s && sw && w)) {
                    dx = PLAYER_DIAMETER2 + EPS;
                }
                else if ((s && !sw && w) || (s && sw && w)) {
                    dy = SIZE - PLAYER_DIAMETER2 - EPS;
                    dx = PLAYER_DIAMETER2 + EPS;
                }
                else if (!s && sw && !w) {
                    if (dx + dy <= SIZE) {
                        dx = PLAYER_DIAMETER2 + EPS;
                    }
                    else {
                        dy = SIZE - PLAYER_DIAMETER2 - EPS;
                    }
                }
            }
            else if (top === 2 && left === 2) {
                //i
                if ((s && !se && !e) || (s && se && !e)) {
                    dy = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if ((!s && !se && e) || (!s && se && e)) {
                    dx = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if ((s && !se && e) || (s && se && e)) {
                    dy = SIZE - PLAYER_DIAMETER2 - EPS;
                    dx = SIZE - PLAYER_DIAMETER2 - EPS;
                }
                else if (!s && se && !e) {
                    if (dx <= dy) {
                        dx = SIZE - PLAYER_DIAMETER2 - EPS;
                    }
                    else {
                        dy = SIZE - PLAYER_DIAMETER2 - EPS;
                    }
                }
            }
        }
        pos.x = Math.max(MIN_X, Math.min(MAX_X, dx + j*SIZE));
        pos.z = Math.max(MIN_Z, Math.min(MAX_Z, Consts.TOP_LEFT.z - i*SIZE - dy));
    };

    PlayerMovementProcessor.prototype.update = function () {
        var scale, data, fps, speedComp, dx, dz, q, r, t, scaledR;
        data = this.game.gamePad.getData();
        q = Math.atan2(data.dy, data.dx);
        r = Math.sqrt(data.dx*data.dx + data.dy*data.dy);
        scaledR = (r - MIN_RADIUS) / (1 - MIN_RADIUS);
        speedComp = this.manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
        speedComp.ang_speed = 0;
        speedComp.speed = 0;
        fps = Math.max(10, Math.min(this.game.engine.getFps(), 60));
        scale = 60/fps;
        if(r > MIN_RADIUS){
            if(q > 0 && q < ALPHA){
                //r
                speedComp.ang_speed = scaledR;
            }
            else if(q > ALPHA && q < PIOVER2 - ALPHA){
                // ru
                t = (q - ALPHA) / (PIOVER2 - 2*ALPHA);
                speedComp.ang_speed = (1 - t)*scaledR;
                speedComp.speed = t * (-scaledR);
            }
            else if(q > PIOVER2 - ALPHA && q < PIOVER2){
                //u
                speedComp.speed = -scaledR;
            }
            else if(q > PIOVER2 && q < PIOVER2 + ALPHA){
                //u
                speedComp.speed = -scaledR;
            }
            else if(q > PIOVER2 + ALPHA && q < Math.PI - ALPHA){
                //ul
                t = (q - PIOVER2 - ALPHA) / (PIOVER2 - ALPHA);
                speedComp.ang_speed = -t*scaledR;
                speedComp.speed = (1 - t) * (-scaledR);
            }
            else if(q > Math.PI - ALPHA && q < Math.PI){
                //l
                speedComp.ang_speed = -scaledR;
            }
            else if(q > -Math.PI && q < -Math.PI + ALPHA){
                //l
                speedComp.ang_speed = -scaledR;
            }
            else if(q > -Math.PI + ALPHA && q < -PIOVER2 - ALPHA){
                //dl
                t = (q + PIOVER2 + ALPHA) / (-PIOVER2 + 2*ALPHA);
                speedComp.ang_speed = -t*scaledR;
                speedComp.speed = (1 - t) * scaledR;
            }
            else if(q > -PIOVER2 - ALPHA && q < -PIOVER2){
                //d
                speedComp.speed = scaledR;
            }
            else if(q > -PIOVER2 && q < -PIOVER2 + ALPHA){
                //d
                speedComp.speed = scaledR;
            }
            else if(q > -PIOVER2 + ALPHA && q < -ALPHA){
                //dl
                t = (q + PIOVER2 - ALPHA) / (PIOVER2 - 2*ALPHA);
                speedComp.ang_speed = t*scaledR;
                speedComp.speed = (1 - t) * scaledR;
            }
            else if(q > -ALPHA && q < 0){
                //r
                speedComp.ang_speed = scaledR;
            }
        }
        speedComp.speed *= scale;
        speedComp.ang_speed *= scale;
        speedComp.angle += speedComp.ang_speed * ANG_SPEED;
        dx = speedComp.speed*FMATH.sin(speedComp.angle);
        dz = speedComp.speed*FMATH.cos(speedComp.angle);
        this.resolve(this.camera.position, dx, dz);
        this.camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
    };

    return PlayerMovementProcessor;

});