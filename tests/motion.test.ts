import test from 'node:test';
import assert from 'node:assert/strict';
import { samplePath, sectionIndex, safeProgress, shots } from '../lib/motion';
import { chapters } from '../lib/content';

test('zero-size scroll calculations and invalid persisted progress never select a missing chapter',()=>{
  for(const value of [0/0,Infinity,-Infinity,-10,100,0,7,3.5]){
    const index=sectionIndex(value);assert.ok(chapters[index]);
    assert.ok(Number.isFinite(safeProgress(value)));
    assert.ok(Object.values(samplePath(value)).every(Number.isFinite));
  }
});
test('every camera path is continuous at chapter boundaries and returns to its intended shot',()=>{
  for(let i=0;i<8;i++){
    const p=samplePath(i);assert.ok(Math.abs(p.x-shots[i].x)<1e-8);assert.ok(Math.abs(p.r-shots[i].r)<1e-8);
    if(i>0&&i<7){const before=samplePath(i-1e-5),after=samplePath(i+1e-5);assert.ok(Math.abs(before.x-after.x)<1e-4);assert.ok(Math.abs(before.r-after.r)<1e-4);}
  }
  for(let p=0;p<=7;p+=.005){const pose=samplePath(p);assert.ok(pose.r>0);assert.ok(Object.values(pose).every(Number.isFinite));}
});
test('all chapter routes are unique and resources use verified official domains',()=>{
  assert.equal(new Set(chapters.map(c=>c.slug)).size,8);
  for(const chapter of chapters){assert.ok(chapter.resources.length);for(const r of chapter.resources){const url=new URL(r.href);assert.equal(url.protocol,'https:');assert.ok(/(^|\.)(worldbank|banquemondiale)\.org$/.test(url.hostname));}}
});
