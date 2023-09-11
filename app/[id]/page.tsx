'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { getKnowHow } from '../services/knowHowService';
import { updateKnowHowAction } from '../actions/knowHowAction';
import { KnowHow } from '@prisma/client';

const Page = async ({ params }: { params: { id: string } }) => {

  // const knowHow = await getKnowHow(params.id);
  // if (knowHow) {
  //   knowHow.viewCount++;
  // }

  // useEffect(() => {
  //   if(knowHow){
  //     updateKnowHowAction(knowHow as KnowHow)
  //   }
   
  // }, [knowHow])

  return (<>

    <h1 >ID: {params.id}</h1>
    {/* <h2> {knowHow?.viewCount}</h2> */}
    <Link href="/">Home</Link>


  </>

  )
}

export default Page

function updataKnowHowAction(knowHow: ({ votes: { id: string; thumbsStatus: import("@prisma/client").$Enums.ThumbsSatus; forked: boolean; knowHowId: string; voterId: string; }[]; } & { id: string; title: string; description: string; thumNailImage: string | null; viewCount: number; thumbsUpCount: number; thumbsDownCount: number; authorId: string | null; categoryId: string; knowHowTypeId: string | null; tagIds: string[]; createdAt: Date; updatedAt: Date; }) | null | undefined) {
  throw new Error('Function not implemented.');
}
