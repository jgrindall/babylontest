
define(["diy3d/game/src/components/HealthComponent", "diy3d/game/src/components/ObjectComponent", "diy3d/game/src/components/SpeedComponent",

	"diy3d/game/src/components/MessageComponent",

"diy3d/game/src/components/MeshComponent", "diy3d/game/src/components/BaddieStrategyComponent",

"diy3d/game/src/components/CameraComponent", "diy3d/game/src/components/PossessionsComponent", "diy3d/game/src/components/DoorComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent, MessageComponent, MeshComponent, BaddieStrategyComponent,

	CameraComponent, PossessionsComponent, DoorComponent) {

		"use strict";

		var ALL = [ObjectComponent, HealthComponent, MessageComponent, PossessionsComponent, DoorComponent, MeshComponent, SpeedComponent, BaddieStrategyComponent, CameraComponent];

		return {
			"ALL":ALL
		};
	}
);
