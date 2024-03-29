#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float u_vibrance;
uniform float u_contrast;


void main(void) {
    vec4 color = texture2D(textureSampler, vUV.xy);
    float average = (color.r + color.g + color.b) / 3.;
    float mx = max(color.r, max(color.g, color.b));
    float amount = (mx - average) * u_vibrance;
    color = color - (mx - color) * amount; // vibrance
    color = (color - .5) * u_contrast + .5; // contrast
    gl_FragColor = vec4(1.0 - color.rgb, color.a); // invert
}
