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

    MeshUtils.destroyTextures = function(material){
        if(material){
            if(material.opacityTexture){
                material.opacityTexture.dispose(true, true);
            }
            if(material.diffuseTexture){
                material.diffuseTexture.dispose(true, true);
            }
            if(material.particleTexture){
                material.particleTexture.dispose(true, true);
            }
            if(material.bumpTexture){
                material.bumpTexture.dispose(true, true);
            }
            if(material.reflectionTexture){
                material.reflectionTexture.dispose(true, true);
            }
            material.opacityTexture = null;
            material.diffuseTexture = null;
            material.particleTexture = null;
            material.bumpTexture = null;
            material.reflectionTexture = null;
        }
    };

	MeshUtils.destroyMaterial = function(material){
        if(material){
            MeshUtils.destroyTextures(material);
            material.dispose(true, true);
        }
    };

	return MeshUtils;

});
