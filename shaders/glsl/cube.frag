#version 300 es
precision highp float;
#include "fragmentVersionCentroid.h";

#if __VERSION__ >= 300
#if defined(TEXEL_AA) && defined(TEXEL_AA_FEATURE)
_centroid in highp vec2 uv;
#else
_centroid in vec2 uv;
#endif

#else
varying vec2 uv;
#endif

uniform lowp float TOTAL_REAL_WORD_TIME;

in mediump vec3 gpositionRealSpaceCoord;

#include "uniformPerFrameConstants.h"
#include "uniformShaderConstants.h"
#include "util.h"

#define time TIME
const float thresHoldValue = 0.128;

float rand(vec2 coord){
    return fract(sin(dot(coord, vec2(12.9898,78.233))) * 43758.5453);
}

float srand(vec2 coord){
    return rand(floor(coord));
}

#include "pragma/fRenderCloud.glsl"

void main(){
    float bufferDetectRain = smoothstep(0.66,0.3,FOG_CONTROL.x);
    float bufferDetectDay = pow(max(min(1.0-FOG_COLOR.r*1.2,1.0),0.0),0.4);
    float bufferDetectNight = pow(max(min(1.0-FOG_COLOR.r*1.5,1.0),0.0),1.2);
    float bufferDetectBur = clamp(FOG_COLOR.r-FOG_COLOR.g,0.0,0.5)*2.0;

    vec3 gpositionVecSpaceCoord = normalize(vec3(gpositionRealSpaceCoord.x, -gpositionRealSpaceCoord.y + thresHoldValue, -gpositionRealSpaceCoord.z));
    vec3 gpositionfinalRenderPixelSpaceCoord = gpositionVecSpaceCoord / gpositionVecSpaceCoord.y;
    vec4 finalRenderPixel = vec4(1,1,1,0);
    if(gpositionVecSpaceCoord.y > 0.0){
        vec4 bufferAtmosphereScatter = mix(mix(mix(mix(mix(vec4(1.0), vec4(0.8), bufferDetectDay), vec4(1.5), bufferDetectNight), vec4(0.5), bufferDetectBur), vec4(0.05), bufferDetectRain),mix(vec4(0.01),vec4(0.01),bufferDetectRain),bufferDetectNight);
        float gg1 = 1.0;

        finalRenderPixel += gBufferRenderCloud(gpositionRealSpaceCoord, gg1) * max(1.0 -length(gpositionRealSpaceCoord.xz / (gpositionRealSpaceCoord.y - 0.128)) * 0.18, 0.0) * -normalize(gpositionRealSpaceCoord.y - thresHoldValue) * bufferAtmosphereScatter;
    }
    gl_FragColor = finalRenderPixel;
}
