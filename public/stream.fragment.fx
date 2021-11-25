precision highp float;

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 u_resolution;

void main(void) {
    gl_FragColor = texture2D(textureSampler, vUV);
}