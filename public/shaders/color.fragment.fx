#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D canvas2D;
uniform float u_vibrance;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_exposure;
uniform float u_time;
uniform vec3 u_color;
uniform float u_colormix;
uniform bool u_invert;


vec4 vibrance(vec4 color, float factor) {
    float average = (color.r + color.g + color.b) / 3.;
    float mx = max(color.r, max(color.g, color.b));
    float amount = (mx - average) * factor;
    return color - (mx - color) * amount;
}

vec4 contrast(vec4 color) {
    return (color - .5) * u_contrast + .5;
}

vec4 invert(vec4 color) {
    return vec4(1.0 - color.rgb, color.a);
}

vec4 brightness(vec4 color) {
    return color + u_brightness;
}

vec4 exposure(vec4 color) {
    return color * pow(2., u_exposure);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float czm_luminance(vec3 rgb)
{
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    return dot(rgb, W);
}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(void) {
    vec2 uv = vUV.xy;
    vec2 nuv = vUV.xy + snoise(vUV.xy * 5. + u_time * 0.05) * 0.1;

    vec3 text = texture2D(canvas2D, vUV.xy).rgb;

    vec4 color = texture2D(textureSampler, mix(uv, nuv, text.r + text.b));

    color = contrast(color);
    color = vibrance(color, u_vibrance);
    color = exposure(color);

     // Basic color grading
    float nb = czm_luminance(color.rgb);
    vec3 inColor = u_invert ? invert(vec4(u_color,1.0)).rgb : u_color;
    color = vec4(mix(color.rgb, nb*inColor, u_colormix),color.a);

    if(u_invert) color = mix(invert(color), color, text.r);
    color = vibrance(color, 1. + text.g * 100.);
    color *= 1. - text.b;

    gl_FragColor = vec4(color);

}
