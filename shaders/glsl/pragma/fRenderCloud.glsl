float gBufferRenderCloud(lowp vec3 gpositionRealSpaceCoord1, float gg){
    lowp vec3 gpositionVecSpaceCoord = normalize(vec3(gpositionRealSpaceCoord1.x, -gpositionRealSpaceCoord1.y + thresHoldValue, -gpositionRealSpaceCoord1.z));
    lowp vec3 gpositionfinalRenderPixelSpaceCoord = gpositionVecSpaceCoord / gpositionVecSpaceCoord.y;
    lowp vec3 gCordinateTridimel = gpositionfinalRenderPixelSpaceCoord;
    lowp float gAbyssIterval = float(0);
    gAbyssIterval = step(rand(floor(TIME * 0.02 + gCordinateTridimel.xz * 3.0 + gg)), 0.3) * 0.5;
    return mix(gAbyssIterval, 0.6, gAbyssIterval);
}