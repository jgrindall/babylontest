
var meshCache = {};

var sections = {};

var RND = 1;

var getMesh = function(scene, len, materialName){
    var plane, key;
	//materialName = "brick";
	key = materialName + "" + len;
	plane = sections[key].createInstance("_" + RND);
	plane.scaling.x = len;
    RND++;
    return plane;
};

var makeMeshes = function(){
	_.each(LENGTHS, function(len){
		var brick = BABYLON.Mesh.CreatePlane("brick" + len, SIZE, scene, false, BABYLON.Mesh.DEFAULTSIDE);
		var steel = BABYLON.Mesh.CreatePlane("steel" + len, SIZE, scene, false, BABYLON.Mesh.DEFAULTSIDE);
		brick.convertToUnIndexedMesh();
		steel.convertToUnIndexedMesh();
		brick.material = brickMaterial;
		steel.material = steelMaterial;
		setUVScale(brick, len, 1);
		setUVScale(steel, len, 1);
		sections["brick" + len] = brick;
		sections["steel" + len] = steel;
		scene.meshes.pop();
		scene.meshes.pop();
	});
};

var setUVScale = function(mesh, uScale, vScale) {
	var i,
		UVs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind),
		len = UVs.length;
	
	if (uScale !== 1) {
		for (i = 0; i < len; i += 2) {
			UVs[i] *= uScale;
		}
	}
	if (vScale !== 1) {
		for (i = 1; i < len; i += 2) {
			UVs[i] *= vScale;
		}
	}
	mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, UVs);
};


var addSky = function(){
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1024}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;
	    
};

var ground;

var addGround = function(){
	ground = BABYLON.Mesh.CreatePlane("ground", 500, scene);
	var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
	groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
	groundMaterial.backFaceCulling = false;
	ground.position = new BABYLON.Vector3(0, 0, 0);
	ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
	ground.material = groundMaterial;
};

var makeWalls = function(){
	var path = [], DIR = ["n", "s", "w", "e"];
	var dirs = {
		"n":[0, 1],
		"s":[0, -1],
		"w":[-1, 0],
		"e":[1, 0]
	};
	var pos = [0, 0];
	for(var i = 0; i < 50; i++){
		dir = DIR[Math.floor(Math.random()*4)];
		path.push({
			"dir":dir,
			"len":Math.floor(Math.random()*10) + 1
		});
	}
	_.each(path, function(p){
		var dir = dirs[p.dir];
		var midpoint = [pos[0] + dir[0]*len, pos[1] + dir[1]*len];
	});
};

var setupGravity = function(){
	scene.gravity = new BABYLON.Vector3(0,-1,0);
	scene.collionsEnabled = true;
	camera.checkCollisions = true;
	camera.applyGravity = true;
	camera.ellipsoid = new BABYLON.Vector3(1,1,1);
	ground.checkCollisions = true;
};

var addBoxes = function(){
	var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
	box.material = new BABYLON.StandardMaterial("Mat", scene);
	box.material.diffuseTexture = new BABYLON.Texture("brick.jpg", scene);
	box.position = new BABYLON.Vector3(0, 3, 0);
	box.applyGravity = true;
	box.moveWithCollisions(scene.gravity);
};


