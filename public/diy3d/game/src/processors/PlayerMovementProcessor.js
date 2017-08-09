define(["diy3d/game/src/utils/GridUtils", "diy3d/game/src/consts/Consts", "diy3d/game/src/utils/FMath"], function(GridUtils, Consts, FMath){

    "use strict";

    var PIOVER2 = Math.PI/2;
    var ALPHA_DEG = 20; // less then 45, this is the sector of the gamepad that is used for each pure direction (u, d, l, r)
    var ALPHA = Math.PI * ALPHA_DEG/180;
    var MIN_RADIUS = 0.15;
    var ANG_SPEED = 0.035;
    var PLAYER_DIAMETER = Consts.BOX_SIZE/8;
    var PLAYER_DIAMETER2 = PLAYER_DIAMETER/2;
    var MIN_X = Consts.BOX_SIZE + PLAYER_DIAMETER2;
    var MAX_X = Consts.SIZE_J * Consts.BOX_SIZE - Consts.BOX_SIZE - PLAYER_DIAMETER2;
    var MIN_Z = Consts.BOX_SIZE + PLAYER_DIAMETER2;
    var MAX_Z = Consts.SIZE_I * Consts.BOX_SIZE - Consts.BOX_SIZE - PLAYER_DIAMETER2;
    var FMATH = new FMath();
    var NUM_ITERATIONS = 5;
    var TOLERANCE = Math.pow(2, -NUM_ITERATIONS);

    var PlayerMovementProcessor = function(game){
        this.game = game;
        this.manager = this.game.manager;
        this.camera = this.game.camera;
    };

    PlayerMovementProcessor.prototype.isFullIJ = function(ij){
        if(ij.i < 0 || ij.i >= Consts.SIZE_I || ij.j < 0 || ij.j >= Consts.SIZE_J){
            return true;
        }
        return (this.game.data.solid[ij.i][ij.j] === 1);
    };

    PlayerMovementProcessor.prototype.resolve = function(pos, movex, movez, slide){
        var _this = this, i, t0 = 0, t1 = 1, midPointT, _overlaps, slidex, slidez;
        _overlaps = function(t){
            var newPos, posToCheck;
            newPos = {    // the point I will move to
                x: pos.x + movex*t,
                z: pos.z + movez*t
            };
            posToCheck = {  //nw
                x: newPos.x - PLAYER_DIAMETER2,
                z: newPos.z + PLAYER_DIAMETER2
            };
            if(_this.isFullIJ(GridUtils.babylonToIJ(posToCheck))){
                return true;
            }
            posToCheck.x = newPos.x + PLAYER_DIAMETER2; //ne
            posToCheck.z = newPos.z + PLAYER_DIAMETER2;
            if(_this.isFullIJ(GridUtils.babylonToIJ(posToCheck))){
                return true;
            }
            posToCheck.x = newPos.x + PLAYER_DIAMETER2; //se
            posToCheck.z = newPos.z - PLAYER_DIAMETER2;
            if(_this.isFullIJ(GridUtils.babylonToIJ(posToCheck))){
                return true;
            }
            posToCheck.x = newPos.x - PLAYER_DIAMETER2; //sw
            posToCheck.z = newPos.z - PLAYER_DIAMETER2;
            if(_this.isFullIJ(GridUtils.babylonToIJ(posToCheck))){
                return true;
            }
            return false;
        };
        if(_overlaps(t1)){
            //bisect
            for(i = 0; i < NUM_ITERATIONS; i++){
                midPointT = (t0 + t1)/2;
                if(_overlaps(midPointT)){
                    t1 = midPointT;
                }
                else{
                    t0 = midPointT;
                }
            }
            midPointT = (t0 + t1)/2;
            if(midPointT < TOLERANCE){
                if(slide){
                    pos.x = pos.x - movex/100;
                    pos.z = pos.z - movez/100;
                    if(movex >= 0){
                        this.resolve(pos, 0.1, 0, false);
                    }
                    else {
                        this.resolve(pos, -0.1, 0, false);
                    }
                    if(movez >= 0){
                        this.resolve(pos, 0, 0.1, false);
                    }
                    else {
                        this.resolve(pos, 0, -0.1, false);
                    }
                }
            }
            else{
                pos.x = pos.x + movex * midPointT;
                pos.z = pos.z + movez * midPointT;
            }
        }
        else{
            pos.x = pos.x + movex;
            pos.z = pos.z + movez;
        }
    };

    PlayerMovementProcessor.prototype.updateSpeed = function (speedComp, data) {
        var fps, scale, r, scaledR, theta, fps, t;
        theta = data.theta;
        r = data.r;
        scaledR = (r - MIN_RADIUS) / (1 - MIN_RADIUS);
        speedComp.ang_speed = 0;
        speedComp.speed = 0;
        fps = Math.max(10, Math.min(this.game.engine.getFps(), 60));
        scale = 60/fps;
        if(r > MIN_RADIUS){
            if(theta > 0 && theta < ALPHA){
                //r
                speedComp.ang_speed = scaledR;
            }
            else if(theta > ALPHA && theta < PIOVER2 - ALPHA){
                // ru
                t = (theta - ALPHA) / (PIOVER2 - 2*ALPHA);
                speedComp.ang_speed = (1 - t)*scaledR;
                speedComp.speed = t * (-scaledR);
            }
            else if(theta > PIOVER2 - ALPHA && theta < PIOVER2){
                //u
                speedComp.speed = -scaledR;
            }
            else if(theta > PIOVER2 && theta < PIOVER2 + ALPHA){
                //u
                speedComp.speed = -scaledR;
            }
            else if(theta > PIOVER2 + ALPHA && theta < Math.PI - ALPHA){
                //ul
                t = (theta - PIOVER2 - ALPHA) / (PIOVER2 - ALPHA);
                speedComp.ang_speed = -t*scaledR;
                speedComp.speed = (1 - t) * (-scaledR);
            }
            else if(theta > Math.PI - ALPHA && theta < Math.PI){
                //l
                speedComp.ang_speed = -scaledR;
            }
            else if(theta > -Math.PI && theta < -Math.PI + ALPHA){
                //l
                speedComp.ang_speed = -scaledR;
            }
            else if(theta > -Math.PI + ALPHA && theta < -PIOVER2 - ALPHA){
                //dl
                t = (theta + PIOVER2 + ALPHA) / (-PIOVER2 + 2*ALPHA);
                speedComp.ang_speed = -t*scaledR;
                speedComp.speed = (1 - t) * scaledR;
            }
            else if(theta > -PIOVER2 - ALPHA && theta < -PIOVER2){
                //d
                speedComp.speed = scaledR;
            }
            else if(theta > -PIOVER2 && theta < -PIOVER2 + ALPHA){
                //d
                speedComp.speed = scaledR;
            }
            else if(theta > -PIOVER2 + ALPHA && theta < -ALPHA){
                //dl
                t = (theta + PIOVER2 - ALPHA) / (PIOVER2 - 2*ALPHA);
                speedComp.ang_speed = t*scaledR;
                speedComp.speed = (1 - t) * scaledR;
            }
            else if(theta > -ALPHA && theta < 0){
                //r
                speedComp.ang_speed = scaledR;
            }
        }
        speedComp.speed *= scale;
        speedComp.ang_speed *= scale;
    };

    PlayerMovementProcessor.prototype.update = function () {
        var speedComp, dx, dz;
        speedComp = this.manager.getComponentDataForEntity('SpeedComponent', this.game.playerId);
        this.updateSpeed(speedComp, this.game.gamePad.getData());
        speedComp.angle += speedComp.ang_speed * ANG_SPEED;
        dx = speedComp.speed*FMATH.sin(speedComp.angle);
        dz = speedComp.speed*FMATH.cos(speedComp.angle);
        this.resolve(this.camera.position, dx, dz, true);
        this.camera.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), speedComp.angle);
    };

    return PlayerMovementProcessor;

});