'use server'

import { KnowHow, User, Vote } from "@prisma/client"
import { getKnowHows, updateKnowHow } from "../services/knowHowService"
import { createtVoteAndUpdateKnowHow } from "../services/voteService"

export async function createVoteActionAndUpdateKnowHow(knowHow:KnowHow,logInUser:User, voteFormData:FormData) {
    try {
       const rslt =await createtVoteAndUpdateKnowHow(knowHow, logInUser, voteFormData)
        const updated = await updateKnowHow(knowHow)
    } catch (error) {
        return ({ error })
    }
}