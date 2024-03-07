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
    vec2 translatedUV = (vUV.xy - .5 );
    vec4 originalTex = texture2D(textureSampler, translatedUV);
    vec4 fragColor;
    mainImage(fragColor, vUV.xy);
    vec3 color = 1.0 - fragColor.rgb;

    color = color + color * (sin(time) + 1.) * 0.5 * 1.;

    gl_FragColor = vec4(color, fragColor.a); 
    gl_FragColor = texture2D(textureSampler, vUV.xy);
}
