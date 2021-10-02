uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec3 newPos;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
varying vec3 vPosition;
varying vec3 vTarget;

void main(){
  
  float deph=distance(vPosition,vTarget);
  vec3 color=sin(mix(uColor1,uColor2,deph*4.3));
  gl_FragColor=vec4(color,deph*.3+.2);
}