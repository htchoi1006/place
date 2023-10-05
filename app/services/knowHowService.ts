'use server'
import prisma from '@/prisma/prisma'
import { KnowHow, Tag, User, KnowHowDetailInfo, ThumbnailType, } from '@prisma/client'
import { getTagsByName, } from './tagService'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export async function getKnowHowTypes() {
    try {
        const knowHowTypes = await prisma.knowHowType.findMany()
        // console.log(knowHowTypes)
        return knowHowTypes
    } catch (error) {
        return ({ error })
    }
}
export async function createKnowHowWithDetailInfo(formData: FormData, knowhowDetailInfo:Omit<KnowHowDetailInfo, "id"|"knowHowId">) {
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
                    knowHowDetailInfo:true,
                }
            })
            console.log('created KnowHow:', kn)

            // let ids:string[] ;
            // if(knowhowDetailInfo.videoIds.length > 0){
            //     ids = knowhowDetailInfo.videoIds.map(s=>s)
               
            // }
            // else{
            //     ids = [];
            // }
            console.log('knowhow detail infomation youtube video id:', knowhowDetailInfo.videoIds)
            console.log('knowhow detail infomation cloudinary youtube thumbnail type:', knowhowDetailInfo.thumbnailType)
            console.log('knowhow detail infomation cloudinary img public Ids:', knowhowDetailInfo.cloudinaryImgPublicIds)
            console.log('knowhow detail infomation cloudinary text file public Ids:', knowhowDetailInfo.cloudinaryTextFilePublicIds)
            // console.log('knowhow detail infomation detail text:', knowhowDetailInfo.detailText)

            // const khdi = await prisma.knowHowDetailInfo.create({
            //     data:{
            //         videoIds: knowhowDetailInfo.videoIds,
            //         thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
            //         cloudinaryImgPublicIds: knowhowDetailInfo.cloudinaryImgPublicIds,
            //         cloudinaryTextFilePublicIds: knowhowDetailInfo.cloudinaryTextFilePublicIds,
            //         // detailText: knowhowDetailInfo.detailText,
            //         knowHow:{
            //             connect:{
            //                 id: kn.id
            //             }
            //         }
            //     }
            // })
            const khd = await prisma.knowHowDetailInfo.create({
                data: {
                    videoIds:  knowhowDetailInfo.videoIds as [],
                    thumbnailType: knowhowDetailInfo.thumbnailType as ThumbnailType,
                    cloudinaryImgPublicIds: knowhowDetailInfo.cloudinaryImgPublicIds,
                    cloudinaryTextFilePublicIds: knowhowDetailInfo.cloudinaryTextFilePublicIds,
                    detailText: knowhowDetailInfo.detailText,
                    knowHow: {
                        connect: {
                            id: kn.id
                        }
                    }
                }
            });
        
            console.log('knowhow detail infomation created:',JSON.stringify(khd, null, 2))

            return kn;
        } catch (error) {
            console.log('KnowHow creation error(createKnowHowWithDetailInfo):', error)
        }
    } catch (error) {
        console.log('createKnowHow error:', error)
    }
}

export async function createKnowHow(formData: FormData) {
    try {
        console.log('createKnowHow:', formData)
        
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
                knowHowDetailInfo:true,
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
                knowHowDetailInfo:true,
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