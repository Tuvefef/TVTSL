#define gMagnitudVector(x) (dot((x), (x)))
#define gFresnelDefinition(x, y) (pow(clamp(x, 0.0, 1.0), y))