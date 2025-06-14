#version 300 es

#include "fragmentVersionCentroid.h"

#if __VERSION__ >= 300
	#ifndef BYPASS_PIXEL_SHADER
		#if defined(TEXEL_AA) && defined(TEXEL_AA_FEATURE)
			_centroid in highp vec2 uv0;
			_centroid in highp vec2 uv1;
		#else
			_centroid in vec2 uv0;
			_centroid in vec2 uv1;
		#endif
	#endif
#else
	#ifndef BYPASS_PIXEL_SHADER
		varying vec2 uv0;
		varying vec2 uv1;
	#endif
#endif

in mediump vec4 color;
in highp vec3 gpositionRealSpaceCoord;
in highp vec3 ginternalFragCordinates;

#ifdef FOG
    varying vec4 fogColor;
#endif

#include "uniformShaderConstants.h"
#include "util.h"

uniform mediump float TOTAL_REAL_WORLD_TIME;
#define time TOTAL_REAL_WORLD_TIME
uniform highp float TIME;
uniform vec2 FOG_CONTROL;
uniform vec4 FOG_COLOR;

LAYOUT_BINDING(0) uniform sampler2D TEXTURE_0;
LAYOUT_BINDING(1) uniform sampler2D TEXTURE_1;
LAYOUT_BINDING(2) uniform sampler2D TEXTURE_2;

/* preset */
/* 
In order to modify each function, it is necessary to read the instructions available in the github repository. 
This will allow any modification to be carried out appropriately, respecting the structure of the shader and without errors or unwanted calculations. 
*/
#define PRESET
#ifdef PRESET
//reflections
#define fReflectReso 0.5
#define fFresnelReso 0.55
#define fRougnessCoeff 0.3
#define fDistritionCoeef 0.35
//water
#define fTransparencyWater 0.4;
#define USE_PIXEL_POOL 1
#endif
/* preset */

bool WaterDetectBool0(lowp vec3 pixelFragIter){
    return pixelFragIter.b > pixelFragIter.r;
}

void gFinalRenderCloudReflect(const highp float grenderCloudType, const highp float gRetiferCross, inout highp vec3 PixelTracer){
    PixelTracer.rgb += mix(float(0.0), grenderCloudType * 0.30, gRetiferCross) * 1.2;
}

#include "pragma/core/program/gVectorCosine.glsl"

highp float gFrasnelFunc(highp vec3 n, highp vec3 v, float x1){
    highp float besc = 1.0 - gveccosine(n, v);
    return gFresnelDefinition(besc, x1);
}

float rand(vec2 coord){
    return fract(sin(dot(coord, vec2(12.9898,78.233))) * 43758.5453);
}

float srand(vec2 x){
    return rand(floor(x));
}

lowp float cloud(vec2 gCordinateSpace){
    float gcludBuffer;
    for(int i = 0; i < 20; i++){
        gCordinateSpace /= 1.002;
        gcludBuffer = step(rand(floor(TIME * 0.02 + gCordinateSpace * 1.5)), 0.3) * 0.3;
    }
    float final = clamp(gcludBuffer, 0.0, 1.0);
    return final;
}

float gAbsolutFunction(float i){
    return ((i) * sign(i));
}

const float thresHoldValue = 0.128;
const uint InterValOne = 1u;
vec3 colorS1 = vec3(0.45, 0.60, 0.90) * 1.5;
vec3 colorS2 = vec3(0.03, 0.03, 0.08);
vec3 colorS3 = vec3(1.0, 0.4, 0.1);
vec3 colorS4 = vec3(0.3, 0.3, 0.35);

#include "pragma/core/fUnderwaterTracer.glsl"
#include "pragma/core/fDetectIndigoStrat.glsl"
#include "pragma/core/fRotateSenCos.glsl"
#include "pragma/fRenderCloud.glsl"

void main(){
    
    float bufferDetectRain = smoothstep(0.66,0.3,FOG_CONTROL.x);
    float bufferDetectDay = pow(max(min(1.0-FOG_COLOR.r*1.2,1.0),0.0),0.4);
    float bufferDetectNight = pow(max(min(1.0-FOG_COLOR.r*1.5,1.0),0.0),1.2);
    float bufferDetectBur = clamp(FOG_COLOR.r-FOG_COLOR.g,0.0,0.5)*2.0;
    
    highp vec3 gColorSkyf =
        mix(
            mix(
                mix(
                    colorS1, colorS2, bufferDetectNight),
                    colorS3, bufferDetectBur),
                    colorS4, bufferDetectRain
        );
    
    #ifdef BYPASS_PIXEL_SHADER
        gl_FragColor = vec4(0, 0, 0, 0);
        return;
    #else 
    #if USE_TEXEL_AA
        vec4 finalRenderPixel = texture2D_AA(TEXTURE_0, uv0);
    #else
        vec4 finalRenderPixel = texture2D(TEXTURE_0, uv0);
    #endif
    #ifdef SEASONS_FAR
        finalRenderPixel.a = 1.0;
    #endif
    #if USE_ALPHA_TEST
        #ifdef ALPHA_TO_COVERAGE
        #define ALPHA_THRESHOLD 0.05
    #else
        #define ALPHA_THRESHOLD 0.5
    #endif
        if(finalRenderPixel.a < ALPHA_THRESHOLD)
        discard;
    #endif
    vec4 inColor = color;
    #if defined(BLEND)
        finalRenderPixel.a *= inColor.a;
    #endif
    #if !defined(ALWAYS_LIT)
        finalRenderPixel *= texture2D( TEXTURE_1, uv1 );
    #endif
    #ifndef SEASONS
        #if !USE_ALPHA_TEST && !defined(BLEND)
        finalRenderPixel.a = inColor.a;
    #endif
        finalRenderPixel.rgb *= inColor.rgb;
    #else
        vec2 uv = inColor.xy;
        finalRenderPixel.rgb *= mix(vec3(1.0,1.0,1.0), texture2D( TEXTURE_2, uv).rgb*2.0, inColor.b);
        finalRenderPixel.rgb *= inColor.aaa;
        finalRenderPixel.a = 1.0;
    #endif

    bool WaterDetectBool = WaterDetectBool0(color.rgb);
    bool UnderWaterDetect = (uv1.y < 0.9 && abs((2.0 * ginternalFragCordinates.y - 15.0) / 16.0 - uv1.y) < 0.00002);
    vec4 ColorDetect = texture2D(TEXTURE_0, uv0 + vec2(0.0156, 0.0));
    bool smoothSurfaceBuffer = bufferDetectIndigo(ColorDetect);

    highp vec3 gvectorDerivate = normalize(cross(dFdx(ginternalFragCordinates), dFdy(ginternalFragCordinates)));
    float gretiferVector = smoothstep(1.0, 0.1, dot(normalize(-gpositionRealSpaceCoord), gvectorDerivate));
    
    /* normals map */
    vec4 gdistortionRefle = texture2D(TEXTURE_0, uv0);
    vec3 gg1 = texture2D(TEXTURE_0, uv0).rgb;
    float gg2 = dot(vec3(9.685), gg1.rgb * 0.05);
    
    vec3 gDistorReflectN = normalize(gdistortionRefle.rgb * 2.0 - 1.0);
    mediump vec3 gvectorReflect = reflect(normalize(gpositionRealSpaceCoord), gDistorReflectN * fDistritionCoeef);
    float gCosgveccosine = gveccosine(gvectorDerivate, normalize(-gpositionRealSpaceCoord));

    highp float gRougness = clamp(1.0 - gCosgveccosine, 0.0, 1.0) * fRougnessCoeff;
    mediump vec3 gNoise1 = vec3(srand(uv0 * 10.0), srand(uv0 * 20.0), srand(uv0 * 30.0)) - 0.01;
    vec3 reflectColor1 = normalize(gvectorReflect);
    float factor = clamp(reflectColor1.y * 0.5 + 0.5, 0.0, 1.0);

    gvectorReflect = normalize(mix(gvectorReflect, normalize(gvectorReflect + gNoise1 * gRougness), gRougness));
    highp vec3 skyfinal = mix(gColorSkyf, gColorSkyf, pow(factor, 1.5));

    vec2 gBasedVectorReflect = (gpositionRealSpaceCoord.xz / gpositionRealSpaceCoord.y + 0.5 * (gvectorReflect.xz + 1.0));
    vec2 gFinalRotateSttratos = gSttratosMatrixcore(2.0) * gBasedVectorReflect;
    
    highp vec3 normlf1 = gvectorDerivate;
    highp vec3 viewRefRay = normalize(-gpositionRealSpaceCoord);
    highp float finalRenderFresnel = gFrasnelFunc(normlf1, viewRefRay, 6.0);

    highp float gCloudRefl = mix(cloud(gBasedVectorReflect), 0.15, -gvectorReflect.y) * max(1.0 - length(gpositionRealSpaceCoord.xz / gpositionRealSpaceCoord.y)* 0.13, 0.0);

    if(WaterDetectBool){
        finalRenderPixel.a *= fTransparencyWater;
        finalRenderPixel += gBufferRenderCloud(gpositionRealSpaceCoord, gg2) * max(1.0 -length(gpositionRealSpaceCoord.xz / (gpositionRealSpaceCoord.y - thresHoldValue)) * 0.18, 0.0) * -normalize(gpositionRealSpaceCoord.y - thresHoldValue);
    }

    if(smoothSurfaceBuffer){
        if(normalize(gpositionRealSpaceCoord.y) > 0.1)
        gFinalRenderCloudReflect(gCloudRefl, gretiferVector, finalRenderPixel.rgb);
        finalRenderPixel.rgb += vec3(0.678, 0.773, 0.788) * finalRenderFresnel * fFresnelReso;
        finalRenderPixel.rgb += skyfinal * factor * fReflectReso;
    }

    if(!WaterDetectBool){
        underWaterBufferTracerTernary(UnderWaterDetect, finalRenderPixel.rgb);
    }

    #ifdef FOG
        finalRenderPixel.rgb = mix( finalRenderPixel.rgb, fogColor.rgb, fogColor.a );
    #endif

    gl_FragColor = finalRenderPixel;
    #endif
}
