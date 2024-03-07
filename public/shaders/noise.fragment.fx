#ifdef GL_ES
    precision highp float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float u_time;


float random (vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main(void) {
    vec2 uv = vUV.xy;
    vec4 color = texture2D(textureSampler, uv);
    gl_FragColor = vec4(color.rgb + (random(uv + fract(u_time)) - 0.5) * 0.1, color.a);
}
