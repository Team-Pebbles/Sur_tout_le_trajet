#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D canvas;

void main(void) {
    gl_FragColor = texture2D(textureSampler, vUV.xy);
}
