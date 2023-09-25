'use server'
import prisma from '@/prisma/prisma'
import { KnowHow, Tag, User, YoutubeData, } from '@prisma/client'
import { getTagsByName, } from './tagService'

export async function getKnowHowTypes() {
    try {
        const knowHowTypes = await prisma.knowHowType.findMany()
        // console.log(knowHowTypes)
        return knowHowTypes
    } catch (error) {
        return ({ error })
    }
}
export async function createKnowHowWithYt(formData: FormData,ytData:Pick<YoutubeData,"videoIds"| "thumbnailType">) {
    try {
        if (formData === null) {
            return;
        }
        const tag = formData.get('tags') as string;
        const tagNames = tag.toLocaleLowerCase().split(" ");
        const tagWhere: any = [];
        tagNames.map(n => {
            {
                const wh = { name: n };
                tagWhere.push(wh);
            }
        })
        const tags = await prisma.tag.findMany({
            where: {
                OR: tagWhere,
            },

        })

        let tagConnect: any = [];
        tags.map(t => { const con = { id: t.id }; tagConnect.push(con) });
        try {
            const kn = await prisma.knowHow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    thumbNailImage: formData.get('thumbNailImage') as string,
                    knowHowTypeId: formData.get('knowHowTypeId') as string,
                    categoryId: formData.get('categoryId') as string,
                    authorId: formData.get('authorId') as string,
                    tags: {
                        connect: tagConnect,
                    }
                },
                include: {
                    tags: true,
                }
            })
            console.log('created KnowHow:', kn)

            let ids:string[] ;
            if(ytData.videoIds.length > 0){
                ids = ytData.videoIds.map(s=>s)
               
            }
            else{
                ids = [];
            }
            console.log('videoIds and ids:', ytData.videoIds, ids)
            const yt = await prisma.youtubeData.create({
                data:{
                    videoIds: ids,
                    thumbnailType: ytData.thumbnailType,
                    knowHowId:kn.id,
                }
            })
            console.log('youtube data created:', yt)
            return kn;
        } catch (error) {
            console.log('KnowHow creation error(createKnowHowWithYt):', error)
        }
    } catch (error) {
        console.log('createKnowHow error:', error)
    }
}

export async function createKnowHow(formData: FormData) {
    try {
        if (formData === null) {
            return;
        }
        const tag = formData.get('tags') as string;
        const tagNames = tag.toLocaleLowerCase().split(" ");
        const tagWhere: any = [];
        tagNames.map(n => {
            {
                const wh = { name: n };
                tagWhere.push(wh);
            }
        })
        const tags = await prisma.tag.findMany({
            where: {
                OR: tagWhere,
            },

        })

        let tagConnect: any = [];
        tags.map(t => { const con = { id: t.id }; tagConnect.push(con) });
        try {
            const kn = await prisma.knowHow.create({
                data: {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    thumbNailImage: formData.get('thumbNailImage') as string,
                    knowHowTypeId: formData.get('knowHowTypeId') as string,
                    categoryId: formData.get('categoryId') as string,
                    authorId: formData.get('authorId') as string,
                    tags: {
                        connect: tagConnect,
                    }
                },
                include: {
                    tags: true,
                }
            })
            console.log('created KnowHow:', kn)

            return kn;
        } catch (error) {
            console.log('KnowHow creation error(createKnowHow):', error)
        }
    } catch (error) {
        console.log('createKnowHow error:', error)
    }

}

export async function updateKnowHow(knowHow: KnowHow) {
    try {
        // console.log("knowHow before update: ", JSON.stringify(knowHow, null, 2))

        if (knowHow === null) {
            return;
        }
        try {
            const kn = await prisma.knowHow.update({
                where: {
                    id: knowHow.id
                },
                data: {
                    thumbsUpCount: knowHow.thumbsUpCount,
                    thumbsDownCount: knowHow.thumbsDownCount,
                    viewCount: knowHow.viewCount,
                },
                include:{
                    votes:true,
                    author: true,
                }
            })
            // console.log("knowHow after: ", JSON.stringify(kn, null, 2))
            return kn;
        } catch (error) {
            console.log('update KnowHow error:', error)
        }
    } catch (error) {
        console.log('createKnowHow error:', error)
    }

}

export async function getKnowHows() {
    try {
        const knowHows = await prisma.knowHow.findMany({
            include: {
                // tags: true,
                // author: true,
                votes: true,
                youtubeData:true,
            }
        })
        // console.log('get products: ', products)
        return knowHows
    }
    catch (error) {
        console.log(error)
        // return error
    }

}
export async function getKnowHow(id:string) {
    try {
        const knowHow = await prisma.knowHow.findUnique({
            where:{
                id:id,
            },
            include: {
                // tags: true,
                // author: true,
                votes: true,
                youtubeData:true,
            }
        })
        // console.log('get products: ', products)
        return knowHow
    }
    catch (error) {
        console.log(error)
        // return error
    }

}