#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float time;
uniform vec2 u_resolution;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // fragColor = texture2D(textureSampler, uv);
    vec2 uv = fragCoord.xy;
    //uv = fract(uv*3.);
    uv.y = uv.y + .17; //offset on y
    uv.y = abs(1. - uv.y * 2.); // Mirror
    uv.y *= .5; // ratio
    uv.y = 1. - uv.y; // invert Mirror
    // uv.x = 1. - abs(1. - uv.x * 2.) * .5;

    //fix separation line bug
    uv.y *= .99;
    uv.x *= .99;
    
    // Fract the uv
    // uv = fract(( 1. - abs(1. - uv * 2.))*.5);
    fragColor = texture2D(textureSampler, uv);
    //fragColor = vec4(vec2(uv), 1., 1.);
}


void main(void) {
    //gl_FragColor = vec4(1.,1. , 1., 1.);
    vec2 translatedUV = (vUV.xy - .5 );
    // vec2 normUv = vec2(translatedUV.y, translatedUV.x * (u_resolution.x/u_resolution.y));
    vec4 originalTex = texture2D(textureSampler, translatedUV);
    vec4 fragColor;
    mainImage(fragColor, vUV.xy);
    //gl_FragColor = vec4(vec2(normUv), 0. ,0.);
    gl_FragColor = vec4(1.0 - fragColor.rgb, fragColor.a); 
}
