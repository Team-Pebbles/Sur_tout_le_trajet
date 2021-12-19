#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float time;
uniform vec2 u_resolution;



void main(void) {
    //gl_FragColor = vec4(1.,1. , 1., 1.);
    vec2 translatedUV = (vUV.xy - .0 );
    // vec2 normUv = vec2(translatedUV.y, translatedUV.x * (u_resolution.x/u_resolution.y));
    vec4 originalTex = texture2D(textureSampler, translatedUV);
    gl_FragColor = vec4(1.0 - originalTex.rgb, originalTex.a);
}
