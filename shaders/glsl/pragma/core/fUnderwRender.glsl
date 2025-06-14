vec3 PoolPixelRGB(){
        #if   USE_PIXEL_POOL == 1
    return vec3(0.7, 1.5, 1.8);
        #elif USE_PIXEL_POOL == 2
    return vec3(1.0);
        #endif
}