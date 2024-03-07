#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float time;

void main(void) {
    vec4 color = texture2D(textureSampler, vUV.xy);
    gl_FragColor = vec4(1.0 - color.rgb, color.a);
}
