uniform float uTime;

varying vec3 vNormal;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
varying float lowPower;
varying float medPower;
varying float highPower;

void main(){
  // vec4 newPosition=vec4(position,1.);
  // float normalZ=vNormal.z;
  // vec3 color=vNormal*.5+.5;
  vec3 color=vec3(vNormal.x+sin(lowFreq),vNormal.y+sin(medFreq),vNormal.z+sin(highFreq));
  // float frequency=20.;
  // float amplitude=.1;
  // float displacement=sin(newPosition.x*frequency*uTime*.1);
  // newPosition.x+=displacement*normalZ*amplitude;
  gl_FragColor=vec4(color,1.);
  // gl_FragColor=vec4(1.,.4,.5,1.);
}