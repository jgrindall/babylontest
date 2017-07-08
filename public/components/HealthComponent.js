define([], function(){

	var HealthComponent = {
		state: {
		    health:100,
			isRegenerating:false
		}
	};

	HealthComponent.name = "HealthComponent";

	return HealthComponent;

});
