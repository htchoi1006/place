'use server'
import prisma from '@/prisma/prisma'
import { KnowHow, Tag, User, } from '@prisma/client'
import { getTagsByName, } from './tagService'

export async function getKnowHowTypes() {
    try {
        const knowHowTypes = await prisma.knowHowType.findMany()
        return knowHowTypes
    } catch (error) {
        return ({ error })
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
                    thumNailImage: formData.get('thumNailImage') as string,
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
            // console.log('created KnowHow:', kn)

            return kn;
        } catch (error) {
            console.log('KnowHow creation error:', error)
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
                },
                include:{
                    votes:true,
                    author: true,
                }
            })
            // console.log("knowHow after: ", JSON.stringify(kn, null, 2))
            return kn;
        } catch (error) {
            console.log('KnowHow creation error:', error)
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
            }
        })
        // console.log('get products: ', products)
        return knowHows
    }
    catch (error) {
        return error
    }

}