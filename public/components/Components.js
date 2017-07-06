
define(["MeshUtils", "GridUtils", "MeshCache", "SceneBuilder", "TerrainBuilder", "CharacterBuilder", "ObjectBuilder", "GreedyMeshAlgo", "Materials", "GamePad",

"GamePadUtils", "lib/entity-manager",

"components/HealthComponent", "components/SpeedComponent", "components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent", "components/GridComponent",

"components/CameraComponent", "components/PossessionsComponent", "processors/CameraMatchPlayerProcessor",

"processors/UpdateHUDProcessor",

"processors/PlayerMovementProcessor", "processors/BaddieMovementProcessor", "processors/UpdateHuntProcessor",

"processors/BaddieCollisionProcessor", "processors/ObjectCollisionProcessor", "DATA", "HUD"],

	function(MeshUtils, GridUtils, MeshCache, SceneBuilder, TerrainBuilder, CharacterBuilder, ObjectBuilder, GreedyMeshAlgo, Materials, GamePad, GamePadUtils, EntityManager,

	HealthComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent, GridComponent,

	CameraComponent, PossessionsComponent, CameraMatchPlayerProcessor, UpdateHUDProcessor, PlayerMovementProcessor, BaddieMovementProcessor, UpdateHuntProcessor,

	BaddieCollisionProcessor, ObjectCollisionProcessor, DATA, HUD) {

		"use strict";

		var ALL = [HealthComponent, MessageComponent, GridComponent, PossessionsComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent];

		var Components = {};

		Components.addTo = function(manager){
			_.each(ALL, function(c){
				manager.addComponent(c.name, c);
			});
		};

		return Components;

});