#ifndef INDIGO_BOOLEAN
#define INDIGO_BOOLEAN

#include "pragma/core/fIndigoRender.glsl"

bool bufferDetectIndigo(lowp vec4 gPipeIndigoDependency){
    float gInterpolationVarial = 0.02;
    vec4 defineBufferColor = overlayIndigoBuffer();
    return all(lessThan(abs(gPipeIndigoDependency - defineBufferColor), vec4(gInterpolationVarial)));
}

#endif