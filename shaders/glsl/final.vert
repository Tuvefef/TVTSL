#version 300 es

#include "vertexVersionCentroid.h"
#if __VERSION__ >= 300
	#ifndef BYPASS_PIXEL_SHADER
		_centroid out vec2 uv0;
		_centroid out vec2 uv1;
	#endif
#else
	#ifndef BYPASS_PIXEL_SHADER
		varying vec2 uv0;
		varying vec2 uv1;
	#endif
#endif

#ifndef BYPASS_PIXEL_SHADER
    out mediump vec4 color;
    out highp vec3 gpositionRealSpaceCoord;
    out highp vec3 ginternalFragCordinates;
#endif

#ifdef FOG
	varying vec4 fogColor;
#endif

#include "uniformWorldConstants.h"
#include "uniformPerFrameConstants.h"
#include "uniformShaderConstants.h"
#include "uniformRenderChunkConstants.h"

attribute POS4 POSITION;
attribute vec4 COLOR;
attribute vec2 TEXCOORD_0;
attribute vec2 TEXCOORD_1;

void main(){
    POS4 worldPos;
    #ifdef AS_ENTITY_RENDERER
        POS4 pos = WORLDVIEWPROJ * POSITION;
        worldPos = pos;
    #else
        worldPos.xyz = (POSITION.xyz * CHUNK_ORIGIN_AND_SCALE.w) + CHUNK_ORIGIN_AND_SCALE.xyz;
        worldPos.w = 1.0;
        POS4 pos = WORLDVIEW * worldPos;
        pos = PROJ * pos;
    #endif
        gl_Position = pos;
        gpositionRealSpaceCoord = worldPos.xyz;
        ginternalFragCordinates = POSITION.xyz;
     #ifndef BYPASS_PIXEL_SHADER
        uv0 = TEXCOORD_0;
        uv1 = TEXCOORD_1;
        color = COLOR;
    #endif
    #if defined(FOG) || defined(BLEND)
        #ifdef FANCY
            vec3 relPos = -worldPos.xyz;
            float cameraDepth = length(relPos);
        #else
            float cameraDepth = pos.z;
        #endif
    #endif
    #ifdef FOG
        float len = cameraDepth / RENDER_DISTANCE;
    #ifdef ALLOW_FADE
        len += RENDER_CHUNK_FOG_ALPHA;
    #endif

    fogColor.rgb = FOG_COLOR.rgb;
    fogColor.a = clamp((len - FOG_CONTROL.x) / (FOG_CONTROL.y - FOG_CONTROL.x), 0.0, 1.0);
    #endif
    #ifdef BLEND
        bool shouldBecomeOpaqueInTheDistance = color.a < 0.95;
        if(shouldBecomeOpaqueInTheDistance) {
    #ifdef FANCY  /////enhance water
        float cameraDist = cameraDepth / FAR_CHUNKS_DISTANCE;
        color = COLOR;
    #else
        vec4 surfColor = vec4(color.rgb, 1.0);
        color = surfColor;
        vec3 relPos = -worldPos.xyz;
        float camDist = length(relPos);
        float cameraDist = camDist / FAR_CHUNKS_DISTANCE;
    #endif
    float alphaFadeOut = clamp(cameraDist, 0.0, 1.0);
    color.a = mix(color.a, 1.0, alphaFadeOut);
        }
    #endif

    #ifndef BYPASS_PIXEL_SHADER
        #ifndef FOG
            color.rgb += FOG_COLOR.rgb * 0.000001;
        #endif
    #endif
}
