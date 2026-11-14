import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { chapters } from '@/lib/content';
import { TopicPage } from '@/components/topic-page';
export function generateStaticParams(){return chapters.map(c=>({slug:c.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params,c=chapters.find(c=>c.slug===slug);return {title:c?.name??'Page introuvable',description:c?.intro};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params,index=chapters.findIndex(c=>c.slug===slug);if(index<0)notFound();
  return <TopicPage chapter={chapters[index]} index={index}/>;
}
