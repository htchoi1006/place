'use server'
import { revalidatePath } from "next/cache"
import { createKnowHow, updateKnowHow } from "../services/knowHowService";
import { } from "../services/tagService";
import { KnowHow, User } from "@prisma/client";

export async function createKnowHowAction(data: FormData) {
  await createKnowHow(data);
  revalidatePath('/')
}
export async function updateKnowHowAction(data: KnowHow) {
  console.log('update KnowHow Action',JSON.stringify(data, null, 2));
  await updateKnowHow(data);
  revalidatePath('/')
}

