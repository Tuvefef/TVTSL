#ifndef VECCOS_H
#define VECCOS_H

#include "pragma/core/program/macros.hpp"

highp float gveccosine(highp vec3 x1, highp vec3 x2){
    return dot(x1, x2) * inversesqrt(
        gMagnitudVector(x1) * gMagnitudVector(x2)
    );
}

#endif