#include <glm/glm.hpp>
#include <glm/gtc/constants.hpp>

/* original */

float gveccosine(const glm::vec3& x1, const glm::vec3& x2){
    float vectorProduct = glm::dot(x1, x2);
    float longitProduct = glm::length(x1) * glm::length(x2);
    if(longitProduct == 0.0f) return 0.0f;
    return vectorProduct / longitProduct;
}