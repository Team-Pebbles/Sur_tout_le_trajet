precision highp float;

varying vec2 vUV;
uniform sampler2D textureSampler;

void main(void) {
    //vec4 tex = Texture2D(textureSampler, vec2(0,0))
    //vec2 textCoords = vUV;
    //float scale = .5;
    //texCoords.x = (texCoords.x - 0.5) * scale + (0.5 * scale);
    gl_FragColor = texture2D(textureSampler, vUV);
}