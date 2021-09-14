uniform float uTime;
varying vec3 newPos;

void main(){

  float sinePulse = newPos.x + sin(uTime);
  float cosPulse = newPos.y + cos(uTime);
  vec3 color = vec3(sinePulse, cosPulse, 1.);
  gl_FragColor = vec4(color, 1.);
}