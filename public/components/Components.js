
define(["components/HealthComponent", "components/ObjectComponent", "components/SpeedComponent",

	"components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "components/DoorComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, DoorComponent) {

		"use strict";

		var ALL = [ObjectComponent, HealthComponent, MessageComponent, PossessionsComponent, DoorComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent];

		var Components = {};

		Components.addTo = function(manager){
			_.each(ALL, function(c){
				manager.addComponent(c.name, c);
			});
		};

		return Components;

});
