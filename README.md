# tuvefe vanilla trazer shaders legacy #
>This is a technical shader pack for Minecraft 1.18 and earlier

## it is important that you read ##

The reasons why this package is for those versions of Minecraft are:
## It's an original project that I dusted off. ##
This shader was going to be public for a long time until it was no longer compatible with new versions.
haro decided to make it public despite the time

## It is modifiable and prevents errors ##
In these versions you have the ability to go to the root of the package and modify directly
This way you can modify visual aspects to your liking
For this reason I haven't ported it to Minecraft patch either. 
precision errors may appear 
optimization settings and special configurations
something that is not possible in minecraft patch

## besides ##
This is intended to show a function that only high caliber shaders could do without lag.
something that was the most extravagant for the time
in addition to preserving the vanilla style

## features it adds ##
* false sky reflections 
* reflection distortion with normal map distorts the pixels
* fresnel depending on the angle position
* rougness
## catches
![smooth and shiny blocks](https://github.com/Tuvefef/TVTSL/blob/main/images/img_1.jpg)
![](https://github.com/Tuvefef/TVTSL/blob/main/images/img_2.jpg)
![](https://github.com/Tuvefef/TVTSL/blob/main/images/img_4.jpg)
![](https://github.com/Tuvefef/TVTSL/blob/main/images/img_3.jpg)

## configuration ##
* in "shaders/glsl/final.frag"
* you will have a small fragment of configurations exactly on line 43
### reflections ###
```cpp
#define fReflectReso //defines the color intensity of the highlights
                       The modification range is 0.1 to 0.7 recommended

#define fFresnelReso  //defines the intensity of the fresnel
                        configuration range from 0.1 to 1.0

#define fRougnessCoeff //define the roughness of the texture using noise
                          Modification range 0.1 0.7 recommended

#define fDistritionCoeef //define the distortion with the pixels using normal maps
                          modification range from 0.1 to 1.0
```

### water ###
```cpp
#define fTransparencyWater //define water transparency using alpha 
                             modification range from 0.1 to 1.0 [original]

#define USE_PIXEL_POOL //define the color of the water background, use a blue color by default, you can disable it to the original water
                         [1 is active, 2 is inactive]
```

### for doubts, suggestions and error reports ###
discord: #gab08549
