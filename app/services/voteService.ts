'use server'
import prisma from '@/prisma/prisma'
import { KnowHow, ThumbsSatus, User, Vote } from '@prisma/client'
import exp from 'constants';
import { disconnect } from 'process';

export async function getKnowHows() {
    return await prisma.knowHow.findMany({
        include:{
            votes: true,
        }
    })
}

export async function createtVoteAndUpdateKnowHow(knowHow: KnowHow, voter: User, voteFormData: FormData) {
    if (voteFormData === null) {
        return;
    }
    // console.log("thumbsStatus", voteFormData.get("thumbsStatus"));

    let vote = await prisma.vote.findFirst({
        where: {
            knowHowId: knowHow.id,
            voterId: voter.id
        }
    })
    // console.log("vote found: ", vote?.thumbsStatus)

    if (vote !== null) {
        if (vote.thumbsStatus !== voteFormData.get("thumbsStatus")) {
            console.log("vote not null and satus is none", vote.thumbsStatus, voteFormData.get("thumbsStatus") as ThumbsSatus)
            const result = await prisma.vote.update({
                where: {
                    id: vote.id,
                },
                data: {
                    thumbsStatus: voteFormData.get("thumbsStatus") as ThumbsSatus,
                }
            })
            console.log("up count: ", knowHow.thumbsUpCount)
            console.log("up down: ", knowHow.thumbsDownCount)
        }
        else if (voteFormData.get("thumbsStatus") === ThumbsSatus.None) {
            try {
                const reslt = await prisma.vote.delete({
                    where: {
                        id: vote.id,
                    },
                })
            } catch (error) {
                console.log("vote deleted:", error)
            }
        }
    }
    else if (vote === null && voteFormData.get("thumbsStatus") !== ThumbsSatus.None) {
        console.log("vote null and ThumbsSatus.None")
        vote = await prisma.vote.create({
            data: {
                thumbsStatus: voteFormData.get("thumbsStatus") as ThumbsSatus,
                voter: {
                    connect: {
                        id: voter.id,
                    }
                },
                knowHow: {
                    connect: {
                        id: knowHow.id
                    }
                }
            },
        })
        const khupdate = await prisma.knowHow.update({
            where:{
                id: knowHow.id,
            },
            data: {
                thumbsUpCount: knowHow.thumbsUpCount,
                thumbsDownCount: knowHow.thumbsDownCount,
                votes:{
                    connect: [
                        {
                            id: vote.id,
                        }
                    ]
                }
            },
        })
        console.log("vote thumbsSatus:", vote.thumbsStatus)
    } 
}

export async function getVote(knowHow: KnowHow, voter: User) {
    try {
        console.log('get votes : ',knowHow.id, voter.id )
        const vote = await prisma.vote.findFirst({
            where: {
                voterId: voter.id,
                knowHowId:knowHow.id,
            }
          })
        console.log('get votes : ',JSON.stringify(vote, null, 2) )
    } catch (error) {
        console.log('error : ',error )
        return ({ error })
    }
}
// const formDataObj = Object.fromEntries(voteFormData.entries());
// console.log('formDataObj', JSON.stringify(formDataObj, null, 2) )
// console.log('voteFormData', JSON.stringify(voteFormData, null, 2) )
// voteFormData.set("voterId", logInUser.id);
