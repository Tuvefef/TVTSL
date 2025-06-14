#version 300 es
precision highp float; 

#include "vertexVersionCentroidUV.h"
#include "uniformWorldConstants.h"

out mediump vec3 gpositionRealSpaceCoord;

attribute POS4 POSITION;
attribute vec2 TEXCOORD_0;

void main(){
    gl_Position = WORLDVIEWPROJ * POSITION;

    uv = TEXCOORD_0;
    gpositionRealSpaceCoord = vec3(POSITION);
}