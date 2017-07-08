
define(["components/HealthComponent", "components/ObjectComponent", "components/SpeedComponent",

	"components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent) {

		"use strict";

		var ALL = [ObjectComponent, HealthComponent, MessageComponent, PossessionsComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent];

		var Components = {};

		Components.addTo = function(manager){
			_.each(ALL, function(c){
				manager.addComponent(c.name, c);
			});
		};

		return Components;

});
