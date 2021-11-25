precision highp float;

varying vec2 vUV;
uniform sampler2D textureSampler;
//uniform vec2 u_resolution;
uniform float time;

void main(void) {
    //gl_FragColor = vec4(1.,1. , 1., 1.);
    gl_FragColor = texture2D(textureSampler, vec2(vUV.x, vUV.y - sin(time)));
}