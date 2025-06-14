mat2 gSttratosMatrixcore(float radians){
    return mat2(
        cos(radians), -sin(radians),
        sin(radians), cos(radians)
    );
}