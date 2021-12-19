#ifdef GL_ES
    precision highp float;
#endif

// Samplers
varying vec2 vUV;
uniform sampler2D textureSampler;

// Parameters
uniform vec2 screenSize;
uniform float threshold;

void main(void) 
{
    vec2 texelSize = vec2(1.0 / screenSize.x, 1.0 / screenSize.y);
    vec4 baseColor = texture2D(textureSampler, vUV);


    if (baseColor.r < threshold) {
        gl_FragColor = baseColor;
    } else {
        gl_FragColor = vec4(0);
    }
}