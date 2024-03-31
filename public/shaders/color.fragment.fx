#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float u_vibrance;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_exposure;

vec4 vibrance(vec4 color) {
    float average = (color.r + color.g + color.b) / 3.;
    float mx = max(color.r, max(color.g, color.b));
    float amount = (mx - average) * u_vibrance;
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

void main(void) {
    vec4 color = texture2D(textureSampler, vUV.xy);
    color = contrast(color);
    color = invert(color);
    color = vibrance(color);
    color = exposure(color);
    gl_FragColor = color;
}
