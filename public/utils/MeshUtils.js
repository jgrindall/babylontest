define([], function(){
	/* helper functions */

	"use strict";

	var MeshUtils = {};

	MeshUtils.setUVOffsetAndScale = function(mesh, uOffset, vOffset, uScale, vScale) {
		var i, UVs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind), len = UVs.length;
		if (uScale !== 1 || uOffset !== 0) {
			for (i = 0; i < len; i += 2) {
				UVs[i] = uOffset + UVs[i]*uScale;
			}
		}
		if (vScale !== 1 || vOffset !== 0) {
			for (i = 1; i < len; i += 2) {
				UVs[i] = vOffset + UVs[i]*vScale;
			}
		}
		mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, UVs);
	};

	return MeshUtils;

});
