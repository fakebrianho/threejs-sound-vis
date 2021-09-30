uniform float uTime;
varying vec2 vUv;
varying float pulse;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
void main(){
  // float sinePulse = (1. + sin(vUv.x*50. - uTime));
  // vec3 color = (1., 1., 0.);
  float sinePulse=(1.+sin(vUv.x*lowFreq-uTime));
  // gl_FragColor = vec4(color, 1.);
  // gl_FragColor = vec4( sinePulse,-sinePulse,0.,1.);
  //need to map freq to colors
  
  gl_FragColor=vec4(pulse,0.,-pulse,1.);
  
}