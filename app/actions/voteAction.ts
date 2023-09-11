'use server';

import { KnowHow, User, Vote } from "@prisma/client";
import { getKnowHows, updateKnowHow } from "../services/knowHowService";
import { createtVoteAndUpdateKnowHow } from "../services/voteService";
import { stat } from "fs";
import { revalidatePath } from "next/cache";
import { VoteData } from "../components/knowHowItem";

export async function createVoteActionAndUpdateKnowHow(knowHow: KnowHow, logInUser: User, voteInput: VoteData) {
    try {

        // console.log('voteInput: ', JSON.stringify(voteInput, null, 2));
        const rslt = await createtVoteAndUpdateKnowHow(knowHow, logInUser, voteInput)
        const updated = await updateKnowHow(knowHow)
        revalidatePath('/')

    } catch (error) {
        console.log('createVoteActionAndUpdateKnowHow error');
        // console.log(error)
        // return ({ error })
    }
}