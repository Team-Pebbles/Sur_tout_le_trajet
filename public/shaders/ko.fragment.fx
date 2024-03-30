#ifdef GL_ES
precision mediump float;
#endif
// get our varyings
varying vec2 vUV;
uniform sampler2D textureSampler;

uniform float u_difference;


uniform float u_rotate;
uniform float u_slices;
uniform float u_zoom;
uniform float u_aber;

const float pi = 3.14159;
const float globalFactor = 1.0;

vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

vec2 ko(vec2 textureCoord,float strength){
    vec2 uv = textureCoord;
    //uv.y = abs(uv.y - 0.5);
    vec2 dir = vec2(0.5) - uv;
    uv = uv + dir * length(dir) *  strength;

    vec2 baseUV = rotateUV(uv,u_rotate);
    vec2 mUV = baseUV;
    mUV.y = mUV.y + .17; // offset y
    mUV.y =  abs(fract(mUV.y + 0.5) - 0.5);


    vec2 angleUV = rotateUV(uv, pi * 0.5) - 0.5;
    
    float r = length(angleUV);
    float angle = atan(angleUV.y, angleUV.x);

    float slice = (pi * 2.) / max(u_slices,2.);

    angle = mod(angle, slice);
    angle = angle - 0.5 * slice;
    angle = abs(angle);

    vec2 koUV = (vec2(sin(angle), cos(angle))) * r;
    koUV = rotateUV(koUV, u_rotate - pi * 0.5);
    koUV = abs((0.5 - koUV) * u_zoom);



    vec2 a = mix(baseUV, mUV, clamp(u_slices,0.,1.));
    vec2 b = mix(a, koUV, clamp(u_slices - 1.,0.,1.));

    return b;
}

void main() {
    // map our texture with the original texture coords
    vec2 uv = vUV;

    vec2 uvR = ko(uv, u_difference);
    vec2 uvG = ko(uv, u_difference * 1. + u_aber);
    vec2 uvB = ko(uv, u_difference * 1. + u_aber * 2.);

    float r = texture2D(textureSampler, uvR).r;
    float g = texture2D(textureSampler, uvG).g;
    float b = texture2D(textureSampler, uvB).b;

    vec4 color = vec4(r,g,b,1.0);

    gl_FragColor = color;
  //  gl_FragColor = texture2D(textureSampler,ko(uv, 0.));
}