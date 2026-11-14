export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
export const safeProgress = (p: number) => clamp(p, 0, 7);
export const sectionIndex = (p: number) => Math.round(safeProgress(p));
export type MotionState = { progress: number; intro: number; pointerX: number; pointerY: number };
export const shots = [
  { x:.80,y:.55,r:.40,rot:-1.83,tilt:.12,tx:.065,ty:.30,tw:.53,fs:7.1,center:false },
  { x:.035,y:.75,r:.53,rot:-2.32,tilt:.08,tx:.45,ty:.24,tw:.52,fs:5.8,center:false },
  { x:.50,y:1.29,r:.58,rot:-3.35,tilt:-.10,tx:.12,ty:.19,tw:.76,fs:7.3,center:true },
  { x:.10,y:.55,r:.40,rot:-4.50,tilt:.15,tx:.48,ty:.28,tw:.49,fs:5.8,center:false },
  { x:.85,y:.69,r:.45,rot:-5.60,tilt:-.14,tx:.065,ty:.25,tw:.54,fs:6.2,center:false },
  { x:.025,y:.61,r:.62,rot:-8.08,tilt:.02,tx:.54,ty:.27,tw:.44,fs:7.0,center:false },
  { x:.84,y:.53,r:.37,rot:-9.20,tilt:.08,tx:.065,ty:.29,tw:.58,fs:5.9,center:false },
  { x:.50,y:1.33,r:.64,rot:-10.15,tilt:.16,tx:.08,ty:.18,tw:.84,fs:7.2,center:true },
];
const arcs = [
  {x:.50,y:.82,r:1.65,roll:.26}, {x:.70,y:.30,r:.14,roll:-.20},
  {x:.10,y:1.04,r:1.32,roll:.22}, {x:.68,y:.94,r:.83,roll:-.25},
  {x:.45,y:.30,r:.16,roll:.19}, {x:.50,y:.56,r:1.80,roll:-.24},
  {x:.50,y:1.14,r:1.05,roll:.14},
];
export function samplePath(raw: number) {
  const value = safeProgress(raw), segment = Math.min(6, Math.floor(value));
  const t = clamp(value - segment), e = smooth(0,1,t), a = shots[segment], b = shots[segment+1], arc = arcs[segment];
  const swell = Math.pow(Math.sin(Math.PI*t),2.2);
  return {
    x:mix(a.x,b.x,e)+(arc.x-mix(a.x,b.x,.5))*swell,
    y:mix(a.y,b.y,e)+(arc.y-mix(a.y,b.y,.5))*swell,
    r:mix(a.r,b.r,e)+(arc.r-mix(a.r,b.r,.5))*swell,
    rot:mix(a.rot,b.rot,e),tilt:mix(a.tilt,b.tilt,e),roll:swell*arc.roll,travel:swell,
  };
}
