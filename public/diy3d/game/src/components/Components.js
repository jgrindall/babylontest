
define(["diy3d/game/src/components/HealthComponent", "diy3d/game/src/components/ObjectComponent", "diy3d/game/src/components/SpeedComponent",

"diy3d/game/src/components/MeshComponent", "diy3d/game/src/components/BaddieStrategyComponent",

"diy3d/game/src/components/CameraComponent", "diy3d/game/src/components/PossessionsComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent,

             MeshComponent, BaddieStrategyComponent,

	        CameraComponent, PossessionsComponent) {

		"use strict";

		return {
			"ALL":[
			    ObjectComponent,
                HealthComponent,
                PossessionsComponent,
                MeshComponent,
                SpeedComponent,
                BaddieStrategyComponent,
                CameraComponent
            ]
		};
	}
);
