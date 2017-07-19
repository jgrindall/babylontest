varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float degree;

void main(void)
{
	vec3 color = texture2D(textureSampler, vUV).rgb;
	gl_FragColor = vec4(color.r + degree, color.g, color.b, 1.0);
}