
define(["components/HealthComponent", "components/ObjectComponent", "components/SpeedComponent",

	"components/MessageComponent",

"components/MeshComponent", "components/BaddieStrategyComponent",

"components/CameraComponent", "components/PossessionsComponent", "components/DoorComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, DoorComponent) {

		"use strict";

		var ALL = [ObjectComponent, HealthComponent, MessageComponent, PossessionsComponent, DoorComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent];

		return {
			"ALL":ALL
		};
	}
);
