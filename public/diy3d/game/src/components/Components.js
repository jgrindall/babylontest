
define(["diy3d/game/src/components/HealthComponent", "diy3d/game/src/components/ObjectComponent", "diy3d/game/src/components/SpeedComponent",

"diy3d/game/src/components/MeshComponent", "diy3d/game/src/components/BaddieStrategyComponent",

"diy3d/game/src/components/PossessionsComponent", "diy3d/game/src/components/SoundComponent"],

	function(HealthComponent, ObjectComponent, SpeedComponent,

             MeshComponent, BaddieStrategyComponent,

	        PossessionsComponent, SoundComponent) {

		"use strict";

		return {
			"ALL":[
			    ObjectComponent,
                HealthComponent,
                PossessionsComponent,
                MeshComponent,
                SpeedComponent,
                BaddieStrategyComponent,
                SoundComponent
            ]
		};
	}
);
