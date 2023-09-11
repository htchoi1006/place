'use server'

import { revalidatePath } from "next/cache"
import { createTag, } from "../services/tagService"

export async function createTagAction(tagName: string) {
    if (!tagName)
        return;
    // console.log('createTagAction', tagName)
    await createTag(tagName)
    revalidatePath('/regContents')
}