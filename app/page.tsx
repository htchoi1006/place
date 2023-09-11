import { KnowHow, User, Vote } from '@prisma/client'
import React from 'react'
import { getKnowHows } from './services/knowHowService'
import KnowHowItem from './components/knowHowItem'
import { getUsers } from './services/userService'
import { getServerSession } from "next-auth";
import { authOptions } from './api/auth/[...nextauth]/route'
import { getVote } from './services/voteService'


const PlaceHomePage = async () => {
  const knowHows = (await getKnowHows() as Array<KnowHow>).slice(0,1);;

  // console.log('howhows: ', JSON.stringify(knowHows,null,2))
  // const knowHows = (await getKnowHows() as Array<KnowHow>).slice(0,1);

  return (
    <>
      <div className="row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-4">
        {knowHows?.map(knowHow => (
          <KnowHowItem key={knowHow.id} knowHow={knowHow}  />
        ))}
      </div>
    </>
  )
}

export default PlaceHomePage