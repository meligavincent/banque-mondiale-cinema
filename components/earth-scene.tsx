'use client';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { clamp, mix, samplePath, smooth, type MotionState } from '@/lib/motion';
import { useSettings } from './providers';

const vertex=`varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main(){vUv=uv;vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}`;
const fragment=`uniform sampler2D uDay; uniform sampler2D uNight; uniform float uDark;
varying vec2 vUv; varying vec3 vNormal; varying vec3 vPosition;
void main(){
 vec3 n=normalize(vNormal);vec3 view=normalize(-vPosition);
 float light=max(dot(n,normalize(vec3(-.4,.65,1.0))),0.0);
 float rim=pow(1.0-max(dot(n,view),0.0),3.5);
 vec3 day=texture2D(uDay,vUv).rgb;
 vec3 cities=texture2D(uNight,vUv).rgb;
 vec3 daylight=day*(.36+light*.95);
 vec3 night=day*vec3(.014,.022,.045)+cities*1.8;
 night+=vec3(.015,.14,.32)*rim*.65;
 gl_FragColor=vec4(mix(daylight,night,uDark),1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const cloudFragment=`uniform sampler2D uCloud;uniform float uDark; varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
void main(){float c=texture2D(uCloud,vUv).r;float light=max(dot(normalize(vNormal),normalize(vec3(-.4,.65,1.0))),0.0);vec3 col=mix(vec3(.65+light*.4),vec3(.09,.15,.23),uDark);gl_FragColor=vec4(col,pow(c,1.4)*mix(.64,.23,uDark));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const atmosphereFragment=`uniform float uDark;varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.2);gl_FragColor=vec4(.16,.48,.83,rim*mix(.18,.40,uDark));
 #include <colorspace_fragment>
}`;
function Planet({motion,onReady,dark,reduced,paused}:{motion:React.RefObject<MotionState>;onReady:()=>void;dark:boolean;reduced:boolean;paused:boolean}) {
  const group=useRef<THREE.Group>(null),earth=useRef<THREE.Mesh>(null),clouds=useRef<THREE.Mesh>(null),stars=useRef<THREE.PointsMaterial>(null);
  const {camera,size,gl}=useThree();
  const surfaceMaterial=useRef<THREE.ShaderMaterial>(null),cloudMaterial=useRef<THREE.ShaderMaterial>(null),atmosphereMaterial=useRef<THREE.ShaderMaterial>(null);
  const textures=useLoader(THREE.TextureLoader,['/textures/day.webp','/textures/night.webp','/textures/clouds.webp']);
  const uniforms=useMemo(()=>({uDay:{value:textures[0]},uNight:{value:textures[1]},uDark:{value:0}}),[textures]);
  const cloudUniforms=useMemo(()=>({uCloud:{value:textures[2]},uDark:uniforms.uDark}),[textures,uniforms]);
  const atmosphereUniforms=useMemo(()=>({uDark:uniforms.uDark}),[uniforms]);
  const scratch=useMemo(()=>({q:new THREE.Quaternion(),e:new THREE.Euler(),time:0,spin:0,cloud:0,px:0,py:0}),[]);
  const starPositions=useMemo(()=>{
    const a=new Float32Array(450*3);let seed=173;
    const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    for(let i=0;i<a.length;i+=3){a[i]=(rand()-.5)*80;a[i+1]=(rand()-.5)*60;a[i+2]=-25-rand()*20;}
    return a;
  },[]);
  useEffect(()=>{
    textures[0].colorSpace=THREE.SRGBColorSpace;textures[1].colorSpace=THREE.SRGBColorSpace;
    textures.forEach(t=>{t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());t.needsUpdate=true;});onReady();
  },[textures,gl,onReady]);
  useFrame((_,rawDelta)=>{
    if(!group.current||!earth.current||!clouds.current||size.width<=0||size.height<=0)return;
    const dt=clamp(rawDelta,0,.05),state=motion.current,pose=samplePath(state.progress),mobile=size.width<768;
    const animate=!reduced&&!paused;
    if(animate){scratch.time+=dt;scratch.spin-=dt*.043;scratch.cloud+=dt*.011;}
    const nightTarget=dark?1:0,currentNight=surfaceMaterial.current?.uniforms.uDark.value??0;
    const night=reduced?nightTarget:THREE.MathUtils.damp(currentNight,nightTarget,3,dt);
    for(const material of [surfaceMaterial.current,cloudMaterial.current,atmosphereMaterial.current])if(material)material.uniforms.uDark.value=night;
    if(stars.current)stars.current.opacity=night*.38;
    scratch.px=THREE.MathUtils.damp(scratch.px,animate?state.pointerX:0,3,dt);scratch.py=THREE.MathUtils.damp(scratch.py,animate?state.pointerY:0,3,dt);
    const opening=reduced?1:state.intro;
    let px=mix(.48,pose.x,opening),py=mix(1.3,pose.y,opening),r=mix(1.55,pose.r,opening);
    if(mobile){px=.5+(pose.x-.5)*.20;py=.76+(pose.y-.53)*.02;r=.17+(pose.r-.3)*.10;}
    px+=Math.sin(scratch.time*.36)*.007+scratch.px*.01;py+=Math.sin(scratch.time*.61)*.009+scratch.py*.006;
    r*=1+Math.sin(scratch.time*.43)*.018;
    const cam=camera as THREE.PerspectiveCamera;
    cam.fov=34+(reduced?0:pose.travel*14+(1-opening)*9);
    const angularRadius=Math.atan(2*r*Math.tan(cam.fov*Math.PI/360)),distance=1.15/Math.sin(angularRadius);
    group.current.position.set(0,0,7-distance);group.current.rotation.z=reduced?0:pose.roll+Math.sin(scratch.time*.31)*.014;
    const tilt=pose.tilt+Math.sin(scratch.time*.23)*.018;
    earth.current.rotation.set(tilt,pose.rot+scratch.spin,0);
    const focus=1-smooth(.10,.65,Math.abs(state.progress-5));
    if(focus>0){scratch.e.set(tilt,-1.83+Math.sin(scratch.time*.28)*.13,0);scratch.q.setFromEuler(scratch.e);earth.current.quaternion.slerp(scratch.q,focus);}
    clouds.current.quaternion.copy(earth.current.quaternion);clouds.current.rotateY(scratch.cloud+.02);
    cam.position.set(scratch.px*.1, -scratch.py*.08,7);cam.lookAt(group.current.position);
    cam.setViewOffset(size.width,size.height,(.5-px)*size.width,(.5-py)*size.height,size.width,size.height);
  });
  return <>
    <points frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[starPositions,3]}/></bufferGeometry><pointsMaterial ref={stars} size={.045} transparent opacity={0} color="#dce9f5" depthWrite={false}/></points>
    <group ref={group}>
      <mesh ref={earth}><sphereGeometry args={[1.15,128,80]}/><shaderMaterial ref={surfaceMaterial} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment}/></mesh>
      <mesh ref={clouds} scale={1.006}><sphereGeometry args={[1.15,96,64]}/><shaderMaterial ref={cloudMaterial} uniforms={cloudUniforms} vertexShader={vertex} fragmentShader={cloudFragment} transparent depthWrite={false}/></mesh>
      <mesh scale={1.017}><sphereGeometry args={[1.15,96,64]}/><shaderMaterial ref={atmosphereMaterial} uniforms={atmosphereUniforms} vertexShader={vertex} fragmentShader={atmosphereFragment} side={THREE.BackSide} transparent depthWrite={false}/></mesh>
    </group>
  </>;
}
class SceneBoundary extends Component<{children:React.ReactNode;fallback:React.ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}
function Fallback({onReady}:{onReady:()=>void}){const {dark}=useSettings();useEffect(onReady,[onReady]);return <div className="earth-fallback" style={{backgroundImage:`url(/textures/${dark?'night':'day'}.webp)`}}/>;}
export default function EarthScene({motion,onReady}:{motion:React.RefObject<MotionState>;onReady:()=>void}){
  const {dark,reduced,paused}=useSettings();
  const [visible,setVisible]=useState(true);
  useEffect(()=>{const update=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
  return <div className="earth-canvas" aria-hidden="true"><SceneBoundary fallback={<Fallback onReady={onReady}/>}><Canvas camera={{position:[0,0,7],fov:34,near:.1,far:100}} dpr={[1,1.65]} frameloop={visible?'always':'never'} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} fallback={<Fallback onReady={onReady}/>}><Suspense fallback={null}><Planet motion={motion} onReady={onReady} dark={dark} reduced={reduced} paused={paused}/></Suspense></Canvas></SceneBoundary></div>;
}
