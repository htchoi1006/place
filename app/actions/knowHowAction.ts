'use server'
import { revalidatePath } from "next/cache"
import { createKnowHow, createKnowHowWithYt, updateKnowHow } from "../services/knowHowService";
import { } from "../services/tagService";
import { KnowHow, User, YoutubeData } from "@prisma/client";

export async function createKnowHowWithYtAction(genData: FormData,ytData:Pick<YoutubeData,"videoIds"| "thumbnailType">) {
  console.log('createKnowHowWithYtAction: ', JSON.stringify(ytData,null,2))
  await createKnowHowWithYt(genData,ytData);
  // revalidatePath('/')
}

export async function createKnowHowAction(data: FormData) {
  await createKnowHow(data);
  revalidatePath('/')
}
export async function updateKnowHowAction(data: KnowHow) {
  console.log('update KnowHow Action',JSON.stringify(data, null, 2));
  await updateKnowHow(data);
  revalidatePath('/')
}

