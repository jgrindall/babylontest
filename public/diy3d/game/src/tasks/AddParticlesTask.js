
define(["diy3d/game/src/Textures"], function(Textures){

	"use strict";


	var _makeParticle = function(game, texture, color){
		var particleSystem = new BABYLON.ParticleSystem("particles", 32, game.scene);
        particleSystem.particleTexture = texture;
        particleSystem.color1 = color;
        particleSystem.color2 = new BABYLON.Color4(0, 0, 0, 1);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 1);
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(SIZE, 1, SIZE);
        particleSystem.minSize = 0.15;
        particleSystem.maxSize = 0.75;
        particleSystem.minLifeTime = 0.75;
        particleSystem.maxLifeTime = 1;
        particleSystem.emitRate = 500;
        particleSystem.disposeOnStop = false;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, 10, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-3, 4, 3);
        particleSystem.direction2 = new BABYLON.Vector3(3, 4, -3);
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 1.5;
        particleSystem.updateSpeed = 0.02;
	};

	var AddParticlesTask = function(game){
		var texture, color;
		texture = Textures.getTextureFromURL("fire", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/1+yHgAHtAKYD9BncgAAAABJRU5ErkJggg==", game.scene);
		if(game.scene.particleSystems.length === 0){
			color = new BABYLON.Color4(1, 0, 0, 1);
			_makeParticle(game, texture, color);
		}
	};

	return AddParticlesTask;

});


/*

this.startDirectionFunction = (emitPower: number, worldMatrix: Matrix, directionToUpdate: Vector3): void => 
{                var randX = randomNumber(this.direction1.x, this.direction2.x);                
var randY = randomNumber(this.direction1.y, this.direction2.y);                v
ar randZ = randomNumber(this.direction1.z, this.direction2.z);                
BABYLON.Vector3.TransformNormalFromFloatsToRef(randX * emitPower, randY * emitPower, randZ * emitPower, worldMatrix, directionToUpdate);            }           


 this.startPositionFunction = (worldMatrix: Matrix, positionToUpdate: Vector3): void => {  

               var randX = randomNumber(this.minEmitBox.x, this.maxEmitBox.x);     
                          var randY = randomNumber(this.minEmitBox.y, this.maxEmitBox.y);        
                                  var randZ = randomNumber(this.minEmitBox.z, this.maxEmitBox.z);        
                                          BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);     

                                                }


*/