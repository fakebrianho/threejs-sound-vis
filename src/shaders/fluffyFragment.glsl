uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
void main(){
  
  float redCol=sin(vNormal.x*lowFreq*uTime);
  float blueCol=sin(vNormal.y*medFreq*uTime);
  float greenCol=sin(vNormal.z*highFreq*uTime);
  float sinePulse=(1.+sin(vUv.x*lowFreq-uTime));
  // vec3 color=vec3(redCol,blueCol,greenCol);
  // gl_FragColor=vec4(color,1.);
  gl_FragColor=vec4(sinePulse,greenCol,redCol,lowFreq);
}