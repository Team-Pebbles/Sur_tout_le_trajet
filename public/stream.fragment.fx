precision highp float;

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float time;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // float p = 3.14159265359;
    // vec2 resolution = u_resolution.xy;
    // vec2 uv = fragCoord.xy;
    // fragColor = texture2D(textureSampler, uv);
    vec2 uv = fragCoord.xy;
    //vec2 coord = 1.0 - uv * 2.0;
    //uv.y =  - abs(1. - uv.y * 2.);
    uv.y = 1. - abs(1. - uv.y * 2.);
    uv.x = 1. - abs(1. - uv.x * 2.);
    uv.y *= .99;
    //uv = fract(( 1. - abs(1. - uv * 2.))*.5);
    fragColor = texture2D(textureSampler, uv);
    //fragColor = vec4(1., vec2(uv), 1.);
}


void main(void) {
    //gl_FragColor = vec4(1.,1. , 1., 1.);
    vec2 translatedUV = (vUV.xy - .5 );
    // vec2 normUv = vec2(translatedUV.y, translatedUV.x * (u_resolution.x/u_resolution.y));
    vec4 originalTex = texture2D(textureSampler, translatedUV);
    vec4 fragColor;
    mainImage(fragColor, vUV.xy);
    //gl_FragColor = vec4(vec2(normUv), 0. ,0.);
    gl_FragColor = fragColor; 
}
