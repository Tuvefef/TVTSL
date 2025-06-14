#include "pragma/core/fUnderwRender.glsl"

void underWaterBufferTracerTernary(const bool underFunction, inout lowp vec3 PixelTracer){
    lowp vec3 gRenderPool = PoolPixelRGB();
    PixelTracer *= underFunction ? gRenderPool : vec3(float(InterValOne));
}