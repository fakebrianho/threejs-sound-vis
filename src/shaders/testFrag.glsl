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
  vec3 color=vec3(vNormal.x+lowFreq*lowPower*sin(uTime),vNormal.y+medFreq*medPower*(uTime),vNormal.z+highFreq*highPower*sin(uTime));
  if(color.x==0.||color.y==0.||color.z==0.){
    color.x=1.;
    color.y=1.;
    color.z=1.;
  }
  if(color==vec3(0.,0.,0.)){
    color=vec3(1.,1.,1.);
  }
  // float frequency=20.;
  // float amplitude=.1;
  // float displacement=sin(newPosition.x*frequency*uTime*.1);
  // newPosition.x+=displacement*normalZ*amplitude;
  gl_FragColor=vec4(color,sin(lowFreq));
  // gl_FragColor=vec4(1.,1.,1.,1.);
}