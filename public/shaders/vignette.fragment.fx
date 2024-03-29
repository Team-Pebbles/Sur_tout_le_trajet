#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float time;
uniform vec2 u_resolution;

const float outerRadius = .45;
const float innerRadius = .3;
const float intensity = .7;

void main(void) {
    // Circular Vignette
    // vec4 color = texture2D(textureSampler, vUV.xy);

    // vec2 relativePosition = gl_FragCoord.xy / u_resolution - 0.5;
    // float len = length(relativePosition);
    // float vignette = smoothstep(outerRadius, innerRadius, len);
    // color.rgb = mix(color.rgb, color.rgb * vignette, intensity);

    // gl_FragColor = color;

    // Squared Vignette
    const float width = 800.0;
    
    vec2 uv = gl_FragCoord.xy  / u_resolution.xy;
    vec2 suv = abs(uv * 2.0 - 1.0);
    
    vec4 color = texture2D(textureSampler, vUV.xy);
    
    vec2 u = width / u_resolution.xy * 0.5;
    
    u = smoothstep(vec2(0), u, 1.0 - suv);
    color.rgb = mix(color.rgb, color.rgb * u.x * u.y , intensity);
    
    gl_FragColor = color;
}
